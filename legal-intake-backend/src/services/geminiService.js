const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeText(filePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fileBuffer = fs.readFileSync(filePath);

  const result = await model.generateContent([
    {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: "application/pdf",
      },
    },
    "Summarize this legal document clearly in bullet points.",
  ]);

  return result.response.text();
}

module.exports = summarizeText;