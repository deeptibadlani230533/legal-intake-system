const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeText(filePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const fileBuffer = fs.readFileSync(filePath);

  const prompt = `
You are an AI legal assistant.

Read the attached legal case document and create a concise professional summary.

Do NOT copy text from the document.
Instead explain the case in your own words.

Your summary must include:
• The nature of the dispute
• The parties involved
• What happened in the incident
• The legal allegation or claim
• Any financial or legal impact
• Current case status if mentioned

Write 1 short paragraph summary followed by 3-5 key points.

Keep the language professional and clear.
`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: "application/pdf",
      },
    },
    prompt,
  ]);

  return result.response.text();
}

module.exports = summarizeText;