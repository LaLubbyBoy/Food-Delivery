import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon } from 'lucide-react';

export const AiCraveBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: 'Hi! I am CraveBot, your AI food assistant. Ask me for recommendations, meal ideas, or order help!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'I recommend trying our spicy Jollof or crispy Zinger burger!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting to AI services right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-orange-500/40 transition transform hover:scale-105 font-bold text-sm"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>Ask CraveBot AI</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[450px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">CraveBot AI</h4>
                <p className="text-[10px] text-orange-100">Powered by Google Gemini</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50 dark:bg-zinc-950/50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start space-x-2 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${m.sender === 'user' ? 'bg-orange-600 text-white' : 'bg-amber-500 text-white'}`}>
                  {m.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/50'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-zinc-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin text-orange-500" />
                <span>CraveBot is typing...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for food recommendations..."
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
