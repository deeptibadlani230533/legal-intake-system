const summarizeText = require("../services/geminiService");

async function summarizeRoutes(app) {
  app.post("/summarize", async (request, reply) => {
    try {
      const { text } = request.body;

      const summary = await summarizeText(text);

      return { summary };

    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Failed to summarize text" });
    }
  });
}

module.exports = summarizeRoutes;