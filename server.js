const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Initialize the Gemini client (it will automatically pick up process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI();

app.post('/api/generate', async (req, res) => {
  try {
    // Support both simple prompt format and nested Google SDK format
    const userPrompt = req.body.prompt || 
                       req.body.contents?.[0]?.parts?.[0]?.text || 
                       "Hello";

    // Call the Gemini model (using gemini-2.5-flash or your preferred model)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
    });

    // Send back the generated text response
    res.json({
      success: true,
      result: response.text
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
