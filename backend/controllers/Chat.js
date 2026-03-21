const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Bạn là chatbot hỗ trợ bán hàng cho website ecommerce.
Trả lời ngắn gọn, thân thiện.

User: ${message}`,
    });

    const reply = response.output[0].content[0].text;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { chatWithAI }; // ✅ QUAN TRỌNG