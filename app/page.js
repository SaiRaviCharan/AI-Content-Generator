'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, RefreshCw, Sparkles, AlertCircle, Zap, Shield, MessageSquare, PenTool, FileText, Mail, Hash } from 'lucide-react';

export default function Home() {
  const [contentType, setContentType] = useState('Social Media Caption');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('contentHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('contentHistory', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type: contentType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setGeneratedContent(data.result);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: contentType,
        prompt: prompt,
        result: data.result,
        date: new Date().toLocaleDateString()
      };
      setHistory([newEntry, ...history].slice(0, 10));

    } catch (err) {
      console.error("Frontend Error:", err);
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copied to clipboard!');
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "generated-content.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const contentTypes = [
    { name: 'Social Media Caption', icon: Hash, color: 'bg-pink-100 text-pink-600' },
    { name: 'Blog Idea', icon: PenTool, color: 'bg-purple-100 text-purple-600' },
    { name: 'Product Description', icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { name: 'Email Template', icon: Mail, color: 'bg-green-100 text-green-600' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates high-quality, human-like content tailored to your needs.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: "Get instant responses powered by Google's Gemini AI technology.",
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your prompts and generated content are processed securely and never stored on our servers.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageSquare,
      title: 'Multiple Content Types',
      description: 'Generate social media captions, blog ideas, product descriptions, and email templates.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: RefreshCw,
      title: 'History & Regenerate',
      description: 'Access your recent generations and easily regenerate or modify previous content.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Download,
      title: 'Easy Export',
      description: 'Copy to clipboard or download your generated content as a text file instantly.',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  const steps = [
    { number: 1, title: 'Choose Content Type', description: 'Select what kind of content you want to create from our options.', color: 'bg-blue-500' },
    { number: 2, title: 'Describe Your Topic', description: 'Enter details about what you want the AI to write about.', color: 'bg-purple-500' },
    { number: 3, title: 'Generate & Use', description: 'Click generate and get professional content in seconds.', color: 'bg-green-500' },
  ];

  // Landing Page View
  if (!showGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={28} />
            <span className="text-xl font-bold text-gray-900">ContentGen AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowGenerator(true)}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 md:px-12 py-20 md:py-32 text-center">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10"></div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              ContentGen AI
            </span>
          </h1>
          
          <div className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 mb-8 shadow-sm">
            <span className="text-purple-600">AI</span>-Powered Content Generation
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform your ideas into engaging content. Generate social media captions,
            blog ideas, product descriptions, and emails using advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Sparkles size={20} />
              Start Generating
            </button>
            <a 
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <MessageSquare size={20} />
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Everything you need to create professional content in seconds
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-purple-100 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 md:px-12 py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${step.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Create your first piece of AI-generated content and experience the power of intelligent writing.
            </p>
            <button 
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg"
            >
              <Sparkles size={20} />
              Start Creating Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-8 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
            © 2025 ContentGen AI. Powered by Google Gemini.
          </div>
        </footer>
      </div>
    );
  }

  // Generator View
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <button 
          onClick={() => setShowGenerator(false)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Sparkles className="text-purple-600" size={28} />
          <span className="text-xl font-bold text-gray-900">ContentGen AI</span>
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGenerator(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Home
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Create <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Magic</span> with AI
          </h1>
          <p className="text-gray-600 text-lg">Select your content type and describe what you need</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Content Type Cards */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                What do you want to create?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setContentType(type.name)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 border-2 ${
                      contentType === type.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <type.icon size={20} />
                    </div>
                    <span className={`text-xs font-semibold ${contentType === type.name ? 'text-purple-700' : 'text-gray-600'}`}>
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                Describe your topic
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A new coffee blend that tastes like chocolate and hazelnut..."
                  className="w-full p-5 border border-gray-200 rounded-xl h-40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none bg-gray-50 focus:bg-white text-gray-800 placeholder:text-gray-400"
                />
                <div className="absolute bottom-3 right-3 text-xs font-medium text-gray-400 bg-white/80 px-2 py-1 rounded">
                  {prompt.length} chars
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    Generate Content
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            {generatedContent && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-t-4 border-t-purple-500">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                    Generated {contentType}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      onClick={downloadText}
                      className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Download as Text"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="prose prose-lg max-w-none prose-purple prose-headings:font-bold prose-h2:text-purple-600 prose-a:text-blue-600 prose-strong:text-gray-900">
                    <ReactMarkdown>
                      {generatedContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / History */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                <RefreshCw size={20} className="text-purple-500" />
                Recent History
              </h3>
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Your creative journey starts here.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="group p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-purple-200" 
                      onClick={() => {
                        setPrompt(item.prompt);
                        setContentType(item.type);
                        setGeneratedContent(item.result);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{item.type}</span>
                        <span className="text-[10px] text-gray-400">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">{item.prompt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
