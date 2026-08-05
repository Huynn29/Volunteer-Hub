require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

app.post("/ai/create-event", async (req, res) => {
    try {
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [

            {
                role: "system",
                content:
                `
Bạn là chuyên gia tổ chức sự kiện tình nguyện.

Người dùng sẽ nhập một ý tưởng.

Phải tạo sự kiện đúng với ý tưởng đó.

Không được tự ý đổi chủ đề.

Luôn trả về JSON.
Chỉ trả về JSON hợp lệ.
Không được bọc trong \`\`\`json.
Không được giải thích.

{
"title":"",
"description":"",
"location":"",
"category":"",
"startDate":"",
"endDate":""
}
`
            },

            {
                role:"user",
                content:prompt
            }

        ]

    });

    const event = JSON.parse(completion.choices[0].message.content);

    console.log("Event AI:");
    console.log(event);

    const imagePrompt = encodeURIComponent(`
Create one realistic volunteer event poster.

Event title:
${event.title}

Event description:
${event.description}

Location:
${event.location}

Category:
${event.category}

Generate an illustration that matches ONLY this event.

The activities in the image must exactly match the event description.

Do not create a generic volunteer scene.

No text.

No logo.

Highly detailed.

Realistic.
`);

    const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}`;

    const image = await axios.get(imageUrl, {
        responseType: "arraybuffer"
    });

    const imagePath = path.join(
        __dirname,
        `banner-${Date.now()}.png`
    );

    fs.writeFileSync(imagePath, image.data);

    const upload = await cloudinary.uploader.upload(imagePath, {
        folder: "volunteerhub_ai"
    });

    fs.unlinkSync(imagePath);

    event.banner = upload.secure_url;

    res.json(event);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể tạo sự kiện bằng AI" });
}

});

app.listen(8000,()=>{
    console.log("AI Agent running");
});