import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, type } = req.body;

    if (!prompt || !type) {
      return res.status(400).json({ error: 'Prompt and Content Type are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API Key missing.' });
    }

    // Construct a specific prompt based on the content type
    let systemInstruction = "";
    switch (type) {
      case "Social Media Caption":
        systemInstruction = "You are a social media expert. Generate 3 distinct social media caption options for the following topic: 1) Short & Punchy, 2) Engaging/Question-based, and 3) Storytelling/Longer. For each option, include relevant emojis and 3-5 popular hashtags. Also provide a brief 'Image Idea' that would go well with these captions.";
        break;
      case "Blog Idea":
        systemInstruction = "You are a professional content strategist. Generate 5 creative, SEO-friendly blog post titles and a detailed outline for ONE of them based on the following topic. The outline should include an Introduction, 3 Main Body Paragraphs with key points, and a Conclusion.";
        break;
      case "Product Description":
        systemInstruction = "You are a professional copywriter. Write a persuasive, compelling, and human-like product description for the following product. Focus on benefits rather than just features. Use sensory words to make it appealing. Structure it with a catchy headline, a short paragraph, and a bulleted list of key features.";
        break;
      case "Email Template":
        systemInstruction = "You are a business communication expert. Write a professional, polite, and clear email template for the following scenario. Include a Subject Line, Salutation, Body, and Closing. Use placeholders like [Name] where necessary.";
        break;
      default:
        systemInstruction = "You are a helpful AI assistant. Generate high-quality, human-like content for the following request.";
    }

    const finalPrompt = `${systemInstruction}\n\nTopic/Details: ${prompt}\n\nIMPORTANT: Write exactly what is asked. Do not add conversational filler like 'Here is the content you asked for'. Just give the result.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: finalPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      const errorMessage = errorData?.error?.message || 'Failed to fetch response from AI provider.';
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'No content generated.' });
    }

    return res.status(200).json({ result: generatedText });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
