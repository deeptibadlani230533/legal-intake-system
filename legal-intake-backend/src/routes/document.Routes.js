const authenticate = require('../middleware/authMiddleware');
const documentController = require('../controllers/document.controller');
const allowRoles = require('../middleware/rolePolicy');
const generateAISummaryController = require("../controllers/document.controller");
module.exports = async function (fastify) {

  fastify.post('/', {
    preHandler: [authenticate],
  }, documentController.uploadDocument);

  fastify.get('/:id/download', {
  preHandler: [authenticate],
}, documentController.downloadDocument);

fastify.get('/case/:caseId/history/:originalName', {
  preHandler: [authenticate],
}, documentController.getDocumentHistory);


  fastify.get('/case/:caseId', {
    preHandler: [authenticate],
  }, documentController.getDocumentsByCase);

  fastify.delete('/:id', {
  preHandler: [authenticate,allowRoles("admin")],
}, documentController.deleteDocument);
  
  fastify.post('/generate-ai-summary', {
    preHandler: [authenticate],
  }, documentController.generateAISummaryController);


};