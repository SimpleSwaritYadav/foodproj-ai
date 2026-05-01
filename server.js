import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.static("."));
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: `You are FoodSaver AI Bot for SDG 2: Zero Hunger.

Your job:
- Help users cook meals using food they already have
- Suggest affordable meals
- Suggest high protein or low carb meals if asked
- Help reduce food waste
- Give leftover food ideas
- Give food donation guidance
- Keep answers simple, practical, and student-friendly

Rules:
- Only answer questions related to food, cooking, nutrition, hunger, leftovers, food waste, affordable meals, and food donation.
- If the user asks anything unrelated, politely say you only help with food and SDG 2 Zero Hunger topics.
- Do not give medical advice.`
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("HF ERROR:", data);
            return res.json({ reply: "AI error. Check terminal." });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.log("SERVER ERROR:", error);
        res.json({ reply: "Server error. Please try again." });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});