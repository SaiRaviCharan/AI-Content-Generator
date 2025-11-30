# Project Deliverables: AI-Powered Content Generator

## 1. Project Overview
This project is a modern, responsive web application designed to assist users in generating various forms of text content using Artificial Intelligence. By leveraging the Google Gemini API, the application allows users to input prompts and select specific content types (e.g., Social Media Captions, Blog Ideas) to receive high-quality, AI-generated text. The application prioritizes user experience with a clean interface, real-time feedback, and history management.

## 2. Tech Stack
- **Frontend Framework**: Next.js (React.js) - Chosen for its robust features and seamless API integration.
- **Styling**: Tailwind CSS - Used for rapid, responsive, and modern UI development.
- **Backend/API**: Next.js Serverless API Routes - Acts as a secure proxy to handle API keys and requests.
- **AI Provider**: Google Gemini Pro API - Selected for its high-quality text generation and free tier availability.
- **Icons**: Lucide React - For a clean and consistent icon set.

## 3. Screenshots of UI
*(Please insert screenshots here when submitting the PDF)*
- **Home Screen**: Shows the input form, dropdown, and history sidebar.
- **Loading State**: Shows the "Generating..." spinner.
- **Result View**: Displays the generated text with Copy and Download buttons.

## 4. API Call Explanation
The application uses a **Serverless Proxy Pattern** to secure the API key.

1.  **Frontend**: The user clicks "Generate". The frontend sends a `POST` request to our internal endpoint `/api/generate` with the `prompt` and `type`.
2.  **Backend (Next.js API Route)**:
    - The serverless function receives the request.
    - It retrieves the `GEMINI_API_KEY` from the secure server-side environment variables.
    - It constructs a specialized prompt based on the selected `type` (e.g., adding "Write a catchy caption..." for social media).
    - It calls the Google Gemini API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`).
    - It returns the generated text to the frontend.

This ensures the API key is **never** exposed to the client browser.

## 5. Code Snippets

### Frontend: API Call (`app/page.js`)
```javascript
const handleGenerate = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type: contentType }),
    });
    const data = await response.json();
    setGeneratedContent(data.result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Backend: Secure Proxy (`app/api/generate/route.js`)
```javascript
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt, type } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a ${type}: ${prompt}` }] }]
      })
    }
  );
  
  const data = await response.json();
  return NextResponse.json({ result: data.candidates[0].content.parts[0].text });
}
```

## 6. Challenges & Solutions
- **Challenge**: Securing the API Key without a dedicated backend server.
  - **Solution**: Used Next.js API Routes. This allows us to run server-side code within the same project deployment, effectively giving us a "backend" without managing a separate Node.js Express server.
- **Challenge**: Handling different content types effectively.
  - **Solution**: Implemented a switch statement in the backend to prepend specific system instructions (e.g., "Write a professional email") to the user's prompt, ensuring the AI understands the context.
- **Challenge**: Persisting user history.
  - **Solution**: Utilized the browser's `localStorage` to save the last 10 generated items, allowing users to revisit their previous ideas even after refreshing the page.

## 7. Links
- **GitHub Repository**: [Insert Link Here]
- **Live Demo**: [Insert Link Here]
