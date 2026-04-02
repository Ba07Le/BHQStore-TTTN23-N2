const OpenAI = require("openai");
const Product = require("../models/Product"); // Import Model để lấy dữ liệu

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. LẤY DỮ LIỆU SẢN PHẨM THỰC TẾ (RAG Strategy)
        const products = await Product.find({ isDeleted: false })
            .select("title price description")
            .limit(20); // Lấy 20 sản phẩm mới nhất để tránh quá tải token

        // 2. CHUYỂN DỮ LIỆU THÀNH VĂN BẢN ĐỂ AI ĐỌC
        const productContext = products.map(p => 
            `- ${p.title}: Giá ${p.price.toLocaleString()}đ. Mô tả: ${p.description}`
        ).join("\n");

        // 3. THIẾT LẬP PROMPT NGHIÊM NGẶT (Strict Prompting)
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Sửa lại tên model cho chính xác
            messages: [
                {
                    role: "system",
                    content: `Bạn là trợ lý ảo chuyên nghiệp của cửa hàng công nghệ BHQ Store. 
                    Dưới đây là danh sách sản phẩm hiện có trong kho:
                    ${productContext}

                    QUY TẮC TRẢ LỜI:
                    1. Chỉ tư vấn về các sản phẩm công nghệ có trong danh sách trên.
                    2. TUYỆT ĐỐI không trả lời về các chủ đề khác như quần áo, ẩm thực, hay các cửa hàng khác. 
                    3. Nếu khách hỏi về chủ đề không liên quan, hãy trả lời: "Rất tiếc, BHQ Store hiện chỉ chuyên về các thiết bị công nghệ. Bạn có muốn mình tư vấn về chuột hay bàn phím gaming không?"
                    4. Trả lời bằng tiếng Việt, thân thiện, lễ phép.`
                },
                { role: "user", content: message }
            ],
            temperature: 0.5, // Giảm độ sáng tạo để Bot bớt "nói linh tinh"
        });

        const reply = response.choices[0].message.content;
        res.status(200).json({ reply });

    } catch (error) {
        console.error("Chat AI error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { chatWithAI };