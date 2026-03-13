const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

async function extractTextFromPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let textContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map(item => item.str);
    textContent += strings.join(" ") + "\n";
  }

  return textContent;
}

module.exports = extractTextFromPDF;