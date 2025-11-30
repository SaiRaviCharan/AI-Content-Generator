<div align="center">

# ✨ ContentGen AI

**Transform ideas into content. In seconds.**

[Live Demo](https://your-demo-link.vercel.app) · [Report Bug](https://github.com/yourusername/contentgen-ai/issues) · [Request Feature](https://github.com/yourusername/contentgen-ai/issues)

---

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)

</div>

---

## 📖 What is this?

ContentGen AI is a web application that uses Google's Gemini AI to write content for you. 

Tell it what you need, pick a format, click generate. That's it.

No complicated prompts. No AI expertise needed. Just describe your topic in plain English.

---

## 🎯 What can it write?

| Type | What you get |
|------|--------------|
| **Social Media Caption** | Short, catchy posts with emojis and hashtags |
| **Blog Idea** | Article titles + detailed outline for one |
| **Product Description** | Persuasive marketing copy with feature highlights |
| **Email Template** | Professional emails with subject line and body |

---

## 🖥️ Preview

<div align="center">

### Landing Page
> Clean, modern design with clear call-to-action

![Landing Page](https://via.placeholder.com/800x450/9333ea/ffffff?text=Landing+Page+Screenshot)

### Generator
> Simple interface - pick type, describe topic, generate

![Generator](https://via.placeholder.com/800x450/ec4899/ffffff?text=Generator+Screenshot)

### Output
> Formatted results with copy & download options

![Output](https://via.placeholder.com/800x450/3b82f6/ffffff?text=Output+Screenshot)

</div>

*Replace placeholder images with actual screenshots*

---

## ⚡ Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/contentgen-ai.git
cd contentgen-ai
npm install
```

### 2. Add your API key

Create a file called `.env.local` in the root folder:

```env
GEMINI_API_KEY=your_api_key_here
```

> Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
contentgen-ai/
├── app/
│   ├── page.js          # Main UI (landing + generator)
│   ├── layout.js        # Root layout
│   └── globals.css      # Styles
├── pages/
│   └── api/
│       └── generate.js  # API endpoint (talks to Gemini)
├── public/
│   └── icon.svg         # Favicon
└── .env.local           # Your API key (not in repo)
```

---

## 🔒 How is the API key protected?

The API key never touches the browser.

```
Browser                    Server                     Gemini
   │                          │                          │
   │  POST /api/generate      │                          │
   │ ───────────────────────> │                          │
   │  {prompt, type}          │                          │
   │                          │                          │
   │                          │  POST (with API key)     │
   │                          │ ───────────────────────> │
   │                          │                          │
   │                          │ <─────────────────────── │
   │                          │       response           │
   │ <─────────────────────── │                          │
   │       result             │                          │
```

The frontend calls our own `/api/generate` endpoint. That endpoint (running on the server) adds the API key and calls Gemini. Users never see the key.

---

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with API routes
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Google Gemini API](https://ai.google.dev/)** - AI text generation
- **[Lucide React](https://lucide.dev/)** - Icons
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Render formatted output

---

## ✅ Features

- [x] Four content types with specific prompts
- [x] Real-time loading states
- [x] Error handling with clear messages
- [x] Markdown rendering (headings, lists, bold)
- [x] Copy to clipboard
- [x] Download as .txt file
- [x] History saved in browser (last 10)
- [x] Fully responsive (mobile + desktop)
- [x] Clean landing page with feature showcase

---

## 📝 License

Open source under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch (`git checkout -b feature/something`)
3. Commit changes (`git commit -m 'Add something'`)
4. Push (`git push origin feature/something`)
5. Open a Pull Request

---

<div align="center">

**Made with ☕ and curiosity**

If this helped you, consider giving it a ⭐

</div>
