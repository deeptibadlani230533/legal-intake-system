const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Document, Case } = require("../models");
const ApiError = require("../utils/apiError");
const summarizeText = require("../services/geminiService");
const pdfParse = require("pdf-parse");


async function uploadDocument(request) {
  console.log("UPLOAD DOCUMENT ROUTE HIT");

  const file = await request.file();

  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  const caseId = file.fields?.caseId?.value;

  if (!caseId) {
    throw new ApiError(400, "caseId is required");
  }

  const existingCase = await Case.findByPk(caseId);

  if (!existingCase) {
    throw new ApiError(404, "Case not found");
  }

  // Version logic
  const latestDoc = await Document.findOne({
    where: {
      caseId,
      originalName: file.filename,
    },
    order: [["version", "DESC"]],
  });

  const newVersion = latestDoc ? latestDoc.version + 1 : 1;

  const extension = path.extname(file.filename);
  const storedName = uuidv4() + extension;

  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, storedName);

  // Save file to disk
  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(uploadPath);
    file.file.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  // Save document immediately (summary will be added later)
  const documentRecord = await Document.create({
    caseId,
    uploadedBy: request.user.id,
    originalName: file.filename,
    storedName,
    filePath: uploadPath,
    fileType: file.mimetype,
    fileSize: file.file.bytesRead,
    version: newVersion,
    summary: null,
  });

  // Background AI processing
setImmediate(async () => {
  console.log(typeof pdfParse);
  try {
    console.log("Starting Gemini summarization...");

    const buffer = fs.readFileSync(uploadPath);

    const pdfData = await pdfParse(buffer);

    const extractedText = pdfData.text;

    const summary = await summarizeText(extractedText);

    await Document.update(
      { summary },
      { where: { id: documentRecord.id } }
    );

    console.log("Gemini summary stored for document:", documentRecord.id);

  } catch (err) {
    console.error("Gemini summarization failed:", err.message);
  }
});

  return { success: true, data: documentRecord };
}

async function getDocumentHistory(caseId, originalName) {
  const documents = await Document.findAll({
    where: {
      caseId,
      originalName,
    },
    order: [["version", "DESC"]],
  });

  if (!documents.length) {
    throw new ApiError(404, "No versions found for this file");
  }

  return documents;
}

async function getDocumentsByCase(caseId) {
  const docs = await Document.findAll({
    where: { caseId },
    order: [["createdAt", "DESC"]],
  });

  return docs;
}

async function downloadDocumentById(id) {
  const document = await Document.findByPk(id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (!fs.existsSync(document.filePath)) {
    throw new ApiError(404, "File not found on server");
  }

  return document;
}

async function deleteDocumentById(id) {
  const document = await Document.findByPk(id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  // Remove file from disk
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  await document.destroy();

  return {
    success: true,
    message: "Document deleted successfully",
  };
}

module.exports = {
  uploadDocument,
  getDocumentsByCase,
  downloadDocumentById,
  getDocumentHistory,
  deleteDocumentById,
};
