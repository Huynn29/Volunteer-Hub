require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const { InferenceClient } = require("@huggingface/inference");
const fs = require("fs");
const path = require("path");
const cloudinary = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================
// GEMINI
// ============================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// HUGGING FACE
// ============================================================

const hf = new InferenceClient(process.env.HF_TOKEN);

// ============================================================
// CREATE EVENT
// ============================================================

app.post("/ai/create-event", async (req, res) => {
  let imagePath = null;

  try {
    const { prompt } = req.body;

    // ========================================================
    // VALIDATE INPUT
    // ========================================================

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Ý tưởng sự kiện không được để trống",
      });
    }

    // ========================================================
    // BƯỚC 1
    // GEMINI TẠO THÔNG TIN SỰ KIỆN
    // ========================================================

    console.log("");
    console.log("========================================");
    console.log("GEMINI ĐANG TẠO SỰ KIỆN...");
    console.log("========================================");

    console.log("IDEA:", prompt);

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",

      contents: `
Bạn là AI chuyên tạo sự kiện tình nguyện cho nền tảng VolunteerHub.

Ý tưởng của người dùng là nguồn thông tin DUY NHẤT.

QUY TẮC BẮT BUỘC:

1. Phải bám sát hoàn toàn chủ đề và hoạt động chính của người dùng.

2. Không được tự ý thay đổi chủ đề.

3. Không được tạo một sự kiện khác với ý tưởng.

4. Nếu người dùng nói:
- hiến máu → chỉ tạo sự kiện hiến máu
- trồng cây → chỉ tạo sự kiện trồng cây
- dọn rác → chỉ tạo sự kiện dọn rác
- dạy học → chỉ tạo sự kiện dạy học
- hỗ trợ người khó khăn → chỉ tạo sự kiện hỗ trợ người khó khăn

5. Tiêu đề phải phản ánh trực tiếp ý tưởng.

6. Mô tả phải mô tả đúng hoạt động chính.

7. Không được thêm hoạt động làm thay đổi bản chất sự kiện.

8. category phải là MỘT trong các giá trị:

"Giáo dục & đào tạo"
"Y tế & chăm sóc sức khỏe"
"Môi trường & bảo vệ thiên nhiên"
"Văn hóa – nghệ thuật"
"Thể thao & giải trí"
"Hoạt động cộng đồng"

9. Nếu người dùng không cung cấp địa điểm:

location = ""

Không được tự bịa địa điểm.

10. Nếu người dùng không cung cấp ngày:

startDate = ""

endDate = ""

Không được tự bịa ngày.

11. imagePrompt:

Phải tạo một prompt tiếng Anh dùng để tạo ảnh banner.

imagePrompt phải mô tả CHÍNH XÁC hoạt động chính của sự kiện.

Phải mô tả:

- người tham gia
- hành động chính
- môi trường
- vật dụng hoặc công cụ liên quan

Không được viết chung chung.

Ví dụ TRỒNG CÂY:

"Volunteers actively planting young trees outdoors, people digging holes in the soil with gardening tools, placing young tree seedlings into the ground, covering the roots with soil, realistic environmental volunteer activity"

Ví dụ HIẾN MÁU:

"Volunteers donating blood in a clean medical environment, a donor sitting in a blood donation chair, medical staff assisting the donor, realistic blood donation equipment"

Ví dụ DỌN RÁC:

"Volunteers actively collecting garbage outdoors, wearing protective gloves and holding trash bags, picking up plastic waste from the ground, realistic community cleanup activity"

imagePrompt phải bằng tiếng Anh.

12. Chỉ trả về JSON.

13. Không markdown.

14. Không giải thích.

FORMAT:

{
  "title": "",
  "description": "",
  "location": "",
  "category": "",
  "startDate": "",
  "endDate": "",
  "imagePrompt": ""
}

Ý TƯỞNG CỦA NGƯỜI DÙNG:

${prompt}
      `,

      config: {
        responseMimeType: "application/json",
      },
    });

    // ========================================================
    // PARSE GEMINI
    // ========================================================

    const event = JSON.parse(response.text);

    console.log("");
    console.log("========================================");
    console.log("GEMINI EVENT AI:");
    console.log("========================================");

    console.log(event);

    // ========================================================
    // BƯỚC 2
    // TẠO PROMPT CHO IMAGE AI
    // ========================================================

    const imagePrompt = `
Create a realistic documentary-style photograph for a volunteer event website banner.

MAIN VOLUNTEER ACTIVITY:
${event.imagePrompt}

EVENT TITLE:
${event.title}

REQUIREMENTS:

- The exact volunteer activity described above must be the main subject.
- Show volunteers actively performing the activity.
- Show realistic people.
- Show realistic human anatomy.
- Show a realistic environment related to the activity.
- Show appropriate tools and objects.
- The activity must be immediately recognizable.
- Do not replace the activity with generic volunteering.
- Do not introduce unrelated activities.
- No text.
- No letters.
- No logo.
- No watermark.
- No poster.
- No infographic.
- No UI.
- No captions.
- Natural lighting.
- Professional documentary photography.
- Photorealistic.
- Highly detailed.
- Landscape composition.
- Wide banner composition.
- Suitable for a volunteer event website.
`;

    console.log("");
    console.log("========================================");
    console.log("HUGGING FACE IMAGE PROMPT:");
    console.log("========================================");

    console.log(imagePrompt);

    // ========================================================
    // BƯỚC 3
    // HUGGING FACE TẠO ẢNH
    // ========================================================

    console.log("");
    console.log("========================================");
    console.log("HUGGING FACE ĐANG TẠO ẢNH...");
    console.log("========================================");

    const image = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: imagePrompt,
        provider: "auto",
    });

    // ========================================================
    // KIỂM TRA IMAGE
    // ========================================================

    if (!image) {
      throw new Error("Hugging Face không trả về ảnh");
    }

    console.log("Hugging Face đã tạo ảnh.");

    // ========================================================
    // BƯỚC 4
    // CHUYỂN IMAGE → BUFFER
    // ========================================================

    const imageBuffer = Buffer.from(await image.arrayBuffer());

    console.log("Image size:", imageBuffer.length, "bytes");

    // ========================================================
    // BƯỚC 5
    // LƯU FILE TẠM
    // ========================================================

    imagePath = path.join(
      __dirname,
      `banner-${Date.now()}.png`
    );

    fs.writeFileSync(imagePath, imageBuffer);

    console.log("File tạm:", imagePath);

    // ========================================================
    // BƯỚC 6
    // UPLOAD CLOUDINARY
    // ========================================================

    console.log("");
    console.log("========================================");
    console.log("ĐANG UPLOAD CLOUDINARY...");
    console.log("========================================");

    const upload = await cloudinary.uploader.upload(
      imagePath,
      {
        folder: "volunteerhub_ai",
        resource_type: "image",
      }
    );

    console.log("Cloudinary URL:");
    console.log(upload.secure_url);

    // ========================================================
    // BƯỚC 7
    // XÓA FILE TẠM
    // ========================================================

    try {
      fs.unlinkSync(imagePath);
      imagePath = null;

      console.log("Đã xóa file tạm.");
    } catch (deleteError) {
      console.log(
        "Không thể xóa file tạm:",
        deleteError.message
      );
    }

    // ========================================================
    // BƯỚC 8
    // GẮN BANNER VÀO EVENT
    // ========================================================

    event.banner = upload.secure_url;

    // ========================================================
    // RESPONSE
    // ========================================================

    console.log("");
    console.log("========================================");
    console.log("HOÀN THÀNH CREATE EVENT AI");
    console.log("========================================");

    console.log(event);

    return res.json(event);

  } catch (error) {

    // ========================================================
    // XÓA FILE TẠM NẾU CÒN
    // ========================================================

    if (imagePath) {
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (deleteError) {
        console.log(
          "Không thể xóa file tạm:",
          deleteError.message
        );
      }
    }

    // ========================================================
    // ERROR LOG
    // ========================================================

    console.error("");
    console.error("========================================");
    console.error("AI ERROR");
    console.error("========================================");

    console.error("Message:", error.message);

    if (error.status) {
      console.error("Status:", error.status);
    }

    if (error.response) {
      console.error("Response:", error.response);
    }

    console.error("========================================");

    return res.status(500).json({
      message: "Không thể tạo sự kiện bằng AI",
      error: error.message,
    });
  }
});

// ============================================================
// SERVER
// ============================================================

app.listen(8000, () => {
  console.log("");
  console.log("========================================");
  console.log("VolunteerHub Gemini AI Server");
  console.log("========================================");
  console.log("Server running: http://localhost:8000");
  console.log("========================================");
});