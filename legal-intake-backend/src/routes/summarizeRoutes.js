const summarizeText = require("../services/geminiService");

router.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const summary = await summarizeText(text);

    res.json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});