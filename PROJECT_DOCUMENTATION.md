# AI Content Generator - Project Documentation

---

## 1. Project Overview

This is a web application that helps users create different types of written content using artificial intelligence. Users can select what kind of content they need (like a social media post or an email), describe their topic, and the application generates relevant text for them.

The application has two main parts:
- A landing page that explains what the tool does
- A generator page where users actually create content

The tool supports four content types:
1. Social Media Captions - Short posts with hashtags for platforms like Instagram or Twitter
2. Blog Ideas - Article titles and outlines for blog writers
3. Product Descriptions - Marketing text for selling products
4. Email Templates - Professional email drafts for business communication

---

## 2. Tech Stack

| Component | Technology | Why I Used It |
|-----------|------------|---------------|
| Framework | Next.js 14 | Allows both frontend and API routes in one project. No need for a separate backend server. |
| Frontend | React.js | Component-based structure makes the UI easy to build and maintain. |
| Styling | Tailwind CSS | Fast to write and keeps styles consistent across the app. |
| AI Model | Google Gemini API | Free tier available, good quality text generation, simple to integrate. |
| Icons | Lucide React | Clean, lightweight icon library. |
| Markdown | react-markdown | Renders AI responses with proper formatting (headings, lists, bold text). |

**Why Next.js instead of plain React?**

The project requirements said not to expose the API key in frontend code. Next.js solves this problem with API Routes - these are server-side functions that run on the server, not in the browser. The API key stays hidden on the server, and the frontend only talks to our own `/api/generate` endpoint.

---

## 3. Screenshots of UI

### Landing Page - Hero Section
*(Insert screenshot here)*
- Shows the main headline and two call-to-action buttons
- Background has subtle gradient effects

### Landing Page - Features Section
*(Insert screenshot here)*
- Six feature cards with icons
- Each card explains one capability of the tool

### Landing Page - How It Works
*(Insert screenshot here)*
- Three numbered steps explaining the process
- Simple visual guide for new users

### Landing Page - Call to Action Banner
*(Insert screenshot here)*
- Gradient background (purple to pink to blue)
- Final prompt to start using the tool

### Generator Page - Content Type Selection
*(Insert screenshot here)*
- Four clickable cards with icons
- Selected type is highlighted with purple border

### Generator Page - Input and Generate
*(Insert screenshot here)*
- Text area for describing the topic
- Character counter in bottom right
- Purple gradient "Generate Content" button

### Generator Page - Generated Output
*(Insert screenshot here)*
- Result displayed with proper formatting
- Copy and Download buttons in the header
- Markdown rendered correctly (headings, bullet points)

### Generator Page - History Sidebar
*(Insert screenshot here)*
- Shows recent generations
- Click any item to reload that result

---

## 4. API Call Explanation

### How the flow works:

```
User clicks "Generate"
        ↓
Frontend sends POST request to /api/generate
        ↓
Next.js API Route receives the request (server-side)
        ↓
API Route reads GEMINI_API_KEY from environment variables
        ↓
API Route sends request to Google Gemini API
        ↓
Gemini returns generated text
        ↓
API Route sends response back to frontend
        ↓
Frontend displays the result
```

### Why this approach?

The API key never reaches the browser. If someone inspects the network requests in their browser, they will only see calls to `/api/generate` - our own endpoint. The actual Gemini API call happens on the server where the key is stored securely in environment variables.

### Request structure sent to Gemini:

```javascript
{
  contents: [
    {
      parts: [
        {
          text: "You are a social media expert. Write a catchy caption for: [user's topic]"
        }
      ]
    }
  ]
}
```

The system adds specific instructions based on the content type selected. For example, if the user selects "Email Template", the prompt starts with instructions to write a professional email with subject line, greeting, body, and closing.

---

## 5. Code Snippets

### Frontend - Making the API Call (app/page.js)

```javascript
const handleGenerate = async () => {
  // Check if user entered something
  if (!prompt.trim()) {
    setError('Please enter a prompt.');
    return;
  }

  setLoading(true);
  setError('');
  setGeneratedContent('');

  try {
    // Call our own API route, not Gemini directly
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type: contentType }),
    });

    const data = await response.json();

    // Check if something went wrong
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    // Show the result
    setGeneratedContent(data.result);
    
    // Save to history
    const newEntry = {
      id: Date.now(),
      type: contentType,
      prompt: prompt,
      result: data.result,
      date: new Date().toLocaleDateString()
    };
    setHistory([newEntry, ...history].slice(0, 10));

  } catch (err) {
    setError(err.message || "Failed to connect to the server.");
  } finally {
    setLoading(false);
  }
};
```

### Backend - API Route (pages/api/generate.js)

```javascript
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, type } = req.body;

    // Validate input
    if (!prompt || !type) {
      return res.status(400).json({ error: 'Prompt and Content Type are required.' });
    }

    // Get API key from environment (never exposed to browser)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Build specific instructions based on content type
    let systemInstruction = "";
    switch (type) {
      case "Social Media Caption":
        systemInstruction = "You are a social media expert. Generate 3 caption options with emojis and hashtags.";
        break;
      case "Blog Idea":
        systemInstruction = "You are a content strategist. Generate 5 blog titles and an outline for one.";
        break;
      case "Product Description":
        systemInstruction = "You are a copywriter. Write a compelling product description with features.";
        break;
      case "Email Template":
        systemInstruction = "You are a business writer. Write a professional email with subject and body.";
        break;
    }

    const finalPrompt = `${systemInstruction}\n\nTopic: ${prompt}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData?.error?.message || 'AI provider error.' 
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'No content generated.' });
    }

    return res.status(200).json({ result: generatedText });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

### Displaying Formatted Output

```javascript
import ReactMarkdown from 'react-markdown';

// In the component:
<div className="prose prose-lg max-w-none">
  <ReactMarkdown>
    {generatedContent}
  </ReactMarkdown>
</div>
```

This renders markdown syntax (like `## Heading` or `**bold**`) as actual formatted HTML instead of showing the raw characters.

---

## 6. Project Links

- **GitHub Repository**: [Insert your GitHub link here]
- **Live Demo**: [Insert Vercel/Netlify link here if deployed]

---

## 7. Challenges and Solutions

### Challenge 1: API Key Security

**Problem**: The requirements said not to expose the API key in frontend code. But in a pure React app, any code runs in the browser where users can see it.

**Solution**: Used Next.js API Routes. These run on the server, not the browser. The frontend calls `/api/generate` (our own endpoint), and that endpoint calls Gemini with the secret key. The key is stored in `.env.local` which is never sent to the browser.

---

### Challenge 2: Finding the Right AI Model

**Problem**: The Gemini API returned errors saying "model not found" for `gemini-pro` and `gemini-1.5-flash`.

**Solution**: Created a script to list all available models for my API key. Found that `gemini-2.0-flash` was available and working. Used that instead.

```javascript
// Script to check available models
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
);
const data = await response.json();
console.log(data.models.map(m => m.name));
```

---

### Challenge 3: 404 Errors on API Route

**Problem**: The frontend kept getting 404 errors when calling `/api/generate`, even though the file existed.

**Solution**: Moved the API route from `app/api/generate/route.js` (App Router style) to `pages/api/generate.js` (Pages Router style). The Pages Router approach is more stable for API routes in Next.js 14.

---

### Challenge 4: Markdown Not Rendering

**Problem**: The AI returns text with markdown formatting like `## Title` and `* bullet point`, but it was displaying as plain text with those characters visible.

**Solution**: Installed `react-markdown` library and wrapped the output in a `<ReactMarkdown>` component. Also added `@tailwindcss/typography` for automatic prose styling.

---

### Challenge 5: Making Content Type-Specific

**Problem**: The AI was giving generic responses regardless of what content type was selected.

**Solution**: Added specific system instructions for each content type in the API route. For example, when "Email Template" is selected, the prompt includes: "Write a professional email with Subject Line, Salutation, Body, and Closing."

---

## 8. Features Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Select Content Type | Done | Four types with icon cards |
| Input Prompt Field | Done | Textarea with character counter |
| Generate Button | Done | Shows loading state while processing |
| AI API Call | Done | Uses Gemini 2.0 Flash |
| Display AI Output | Done | Rendered with markdown formatting |
| Loading State | Done | Spinner and "Creating Magic..." text |
| Error Handling | Done | Shows specific error messages |
| API Key Security | Done | Stored in .env.local, used via API route |
| Responsive Design | Done | Works on mobile and desktop |
| Copy to Clipboard | Done | Button in output section |
| Download as Text | Done | Downloads .txt file |
| History | Done | Stored in localStorage, shows last 10 |

---

## 9. How to Run Locally

1. Clone the repository
2. Run `npm install`
3. Create `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. Run `npm run dev`
5. Open `http://localhost:3000`

---

## 10. File Structure

```
Content Generator/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout with metadata
│   └── page.js           # Main UI component (landing + generator)
├── pages/
│   └── api/
│       └── generate.js   # API route that calls Gemini
├── .env.local            # API key (not committed to git)
├── .gitignore            # Ignores node_modules, .env.local, .next
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Setup instructions
```

---

*Document prepared for project submission.*
