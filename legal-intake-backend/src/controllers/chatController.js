const { askGemini, askLegalQuestion } = require("../services/geminiService");

async function chatHandler(request, reply) {
  try {
    const { question } = request.body;

    // basic validation
    if (!question) {
      return reply.code(400).send({
        error: "Question is required"
      });
    }

    // call AI service
    const response = await askLegalQuestion(question);

    return reply.send({
      success: true,
      response
    });

  } catch (error) {
    console.error("Chat Controller Error:", error.message);

    return reply.code(500).send({
      error: "Something went wrong"
    });
  }
}

module.exports = { chatHandler };