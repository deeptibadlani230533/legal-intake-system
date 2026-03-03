const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/apiError');
const authenticate = require('../middleware/authMiddleware');
const { Document, Case } = require('../models');


module.exports = async function (fastify) {

  fastify.post('/', {
    preHandler: [authenticate],
  }, async (request, reply) => {

    let caseId;
    let filePart;

    for await (const part of request.parts()) {

      if (part.type === 'field' && part.fieldname === 'caseId') {
        caseId = part.value;
      }

      if (part.type === 'file') {
        filePart = part;
      }
    }

    if (!filePart) {
      throw new ApiError(400, 'No file uploaded');
    }

    if (!caseId) {
      throw new ApiError(400, 'caseId is required');
    }

    const existingCase = await Case.findByPk(caseId);

    if (!existingCase) {
      throw new ApiError(404, 'Case not found');
    }

    const extension = path.extname(filePart.filename);
    const storedName = uuidv4() + extension;
    const uploadPath = path.join(process.cwd(), 'uploads', storedName);

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(uploadPath);
      filePart.file.pipe(writeStream);

      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const documentRecord = await Document.create({
      caseId,
      uploadedBy: request.user.id,
      originalName: filePart.filename,
      storedName,
      filePath: uploadPath,
      fileType: filePart.mimetype,
      fileSize: filePart.file.bytesRead
    });

    return reply.code(201).send({
      success: true,
      message: 'Document uploaded successfully',
      data: documentRecord
    });

  });

};
