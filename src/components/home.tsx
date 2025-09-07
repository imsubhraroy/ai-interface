import { useState, useEffect } from 'react';
import { Send, Copy, Download, Moon, Sun, Sidebar, X, ChevronDown } from 'lucide-react';
import type { Message } from '../interfaces/interfaces';

const Home = () => {
    const [theme, setTheme] = useState('light');
    const [selectedModel, setSelectedModel] = useState('GPT-4');
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1000);
    const [savedTemplates] = useState([
        { id: 1, name: 'Creative Writing', prompt: 'Write a creative story about...' },
        { id: 2, name: 'Code Review', prompt: 'Please review this code and suggest improvements...' },
        { id: 3, name: 'Data Analysis', prompt: 'Analyze this dataset and provide insights...' }
    ]);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('ai-interface-theme') || 'light';
        setTheme(savedTheme);
    }, []);

    // Save theme to localStorage when changed
    useEffect(() => {
        localStorage.setItem('ai-interface-theme', theme);
    }, [theme]);

    const models = ['GPT-3.5', 'GPT-4', 'Claude-3', 'Gemini Pro', 'Custom Model'];

    const handleSendMessage = async () => {
        if (!prompt.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setPrompt('');

        setTimeout(() => {
            const aiResponse: Message = {
                role: 'assistant',
                content: `Response from ${selectedModel}: This is a simulated response to demonstrate the chat interface.`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const handleDownloadChat = () => {
        const chatData = {
            model: selectedModel,
            parameters: { temperature, maxTokens },
            messages,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-export.json';
        a.click();
    };

    const loadTemplate = (template: { prompt: string }) => {
        setPrompt(template.prompt);
    };

    const themeClasses = theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-50 text-gray-900';

    const cardClasses = theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200';

    return (
        <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden ${cardClasses} border-r`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">AI Assistant</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                aria-label="Close sidebar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Model Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <div className="relative">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className={`w-full p-2 rounded-md border ${cardClasses} appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                    aria-label="Select AI model"
                                >
                                    {models.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none" />
                            </div>
                        </div>

                        {/* Parameters Panel */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3">Parameters</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1">Temperature: {temperature}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        className="w-full"
                                        aria-label="Temperature slider"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Max Tokens: {maxTokens}</label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="2000"
                                        step="100"
                                        value={maxTokens}
                                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                        className="w-full"
                                        aria-label="Max tokens slider"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Saved Templates */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3">Templates</h3>
                            <div className="space-y-2">
                                {savedTemplates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => loadTemplate(template)}
                                        className={`w-full p-2 text-left rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className={`${cardClasses} border-b p-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    aria-label="Open sidebar"
                                >
                                    <Sidebar size={20} />
                                </button>
                            )}
                            <h1 className="text-xl font-semibold">AI Interface - {selectedModel}</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownloadChat}
                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                aria-label="Download chat"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-20">
                                <h2 className="text-2xl font-semibold mb-4">Welcome to AI Interface</h2>
                                <p className="mb-8">Start a conversation by typing a message below.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                    <div className={`p-4 rounded-lg ${cardClasses} border`}>
                                        <h3 className="font-medium mb-2">Creative Writing</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Generate stories, poems, and creative content</p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${cardClasses} border`}>
                                        <h3 className="font-medium mb-2">Code Assistant</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Debug code, write functions, and explain concepts</p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${cardClasses} border`}>
                                        <h3 className="font-medium mb-2">Data Analysis</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Analyze datasets and generate insights</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3xl p-4 rounded-lg ${message.role === 'user'
                                        ? 'bg-blue-600 text-white ml-12'
                                        : `${cardClasses} border mr-12`
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="flex-1 whitespace-pre-wrap">{message.content}</p>
                                        <button
                                            onClick={() => handleCopyMessage(message.content)}
                                            className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${message.role === 'user' ? 'text-white/70 hover:text-white' : ''
                                                }`}
                                            aria-label="Copy message"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`max-w-3xl p-4 rounded-lg ${cardClasses} border mr-12`}>
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                        <span>Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className={`${cardClasses} border-t p-4`}>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type your message here... (Shift+Enter for new line)"
                                    className={`w-full p-3 rounded-lg border ${cardClasses} resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                    rows={3}
                                    aria-label="Message input"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!prompt.trim() || isLoading}
                                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>Press Shift+Enter for new line</span>
                            <span>{prompt.length} characters</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;