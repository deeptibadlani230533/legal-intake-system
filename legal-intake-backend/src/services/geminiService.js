const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeText(filePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const extension = path.extname(filePath).toLowerCase();

  const prompt = `
You are an intelligent document analysis assistant.

First determine whether the document is a LEGAL document or a GENERAL document.

If it is a LEGAL document:
- Act as an AI legal assistant.
- Create a concise professional legal case summary.
- Do NOT copy text directly from the document.
- Explain the case clearly in your own words.
- Include:
  • Nature of the dispute
  • Parties involved
  • What happened in the incident
  • Legal allegation or claim
  • Financial or legal impact
  • Current case status if mentioned

If it is NOT a legal document:
- Create a clear general summary of the document.
- Explain the main idea, important information, and key takeaways.

Output format:
1 short paragraph summary  
followed by  
3–5 key bullet points.

Use clear, professional language.
`;

  let result;

  // ----- PDF FILE -----
  if (extension === ".pdf") {
    const fileBuffer = fs.readFileSync(filePath);

    result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      },
      prompt,
    ]);
  }

  // ----- WORD FILE (.docx) -----
  else if (extension === ".docx") {
    const doc = await mammoth.extractRawText({ path: filePath });

    result = await model.generateContent([
      doc.value,
      prompt,
    ]);
  }

  else {
    throw new Error("Unsupported file type. Only PDF and DOCX allowed.");
  }

  return result.response.text();
}

module.exports = summarizeText;