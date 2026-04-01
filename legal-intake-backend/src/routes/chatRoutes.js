const { chatHandler } = require("../controllers/chatController");

async function chatRoutes(fastify, options) {
  
  // POST /chat
  fastify.post("/chat", chatHandler);

}

module.exports = chatRoutes;