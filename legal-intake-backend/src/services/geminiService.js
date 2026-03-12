const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeChunk(text) {

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Summarize the following legal document in 2-3 sentences.

Document:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = summarizeChunk;