const documentService = require('../services/document.service');
const fs = require('fs');

async function uploadDocument(request, reply) {
  const result = await documentService.uploadDocument(request);
  return reply.code(201).send(result);
}

async function getDocumentsByCase(request, reply) {
  const { caseId } = request.params;
  const documents = await documentService.getDocumentsByCase(caseId);
  return reply.send({ success: true, data: documents });
}

async function downloadDocument(request, reply) {
  const { id } = request.params;
  const document = await documentService.downloadDocumentById(id);

  reply.header('Content-Type', document.fileType);
  reply.header(
    'Content-Disposition',
    `attachment; filename="${document.originalName}"`
  );

  return reply.send(fs.createReadStream(document.filePath));
}

async function getDocumentHistory(request, reply) {
  const { caseId, originalName } = request.params;

  const documents = await documentService.getDocumentHistory(
    caseId,
    originalName
  );

  return reply.send({ success: true, data: documents });
}

async function deleteDocument(request, reply) {
  const { id } = request.params;

  const result = await documentService.deleteDocumentById(
    id,
    
  );

  return reply.send(result);
}


module.exports = {
  uploadDocument,
  getDocumentsByCase,
  downloadDocument,
  getDocumentHistory,
  deleteDocument
};