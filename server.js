const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Initialize the Gemini client (uses GEMINI_API_KEY from Render Environment)
const ai = new GoogleGenAI();

// Health check route so Render and browsers get an immediate response
app.get('/', (req, res) => {
  res.send('Logix server is running!');
});

app.post('/api/generate', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || req.body.contents?.[0]?.parts?.[0]?.text || "Hello";

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

// Bind to '0.0.0.0' and process.env.PORT for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
