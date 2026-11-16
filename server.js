const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Initialize the Gemini client (picks up process.env.GEMINI_API_KEY automatically)
const ai = new GoogleGenAI();

app.post('/api/generate', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || 
                       req.body.contents?.[0]?.parts?.[0]?.text || 
                       "Hello";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
    });

    res.json({
      success: true,
      result: response.text
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CRITICAL FOR RENDER: Use process.env.PORT so Render can detect the open port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
