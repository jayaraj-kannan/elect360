"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Vanakkam! I'm Elee, your enVote assistant. How can I help you prepare for the April 23 Tamil Nadu elections today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated Response (to be replaced by Gemini API)
    setTimeout(() => {
      const resp = getMockResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: resp }]);
    }, 1000);
  };

  const getMockResponse = (text: string) => {
    const lowText = text.toLowerCase();
    if (lowText.includes('id') || lowText.includes('document')) {
      return "For the TN election, you can use your EPIC card (Voter ID). If you don't have it, you can use any of the 11 alternatives like Aadhar, PAN card, Driving License, or Passport. Do you have any of these?";
    }
    if (lowText.includes('time') || lowText.includes('open')) {
      return "Polls in Tamil Nadu open at 7:00 AM and close at 6:00 PM on April 23. The best time to vote is usually between 2 PM and 4 PM to avoid long queues!";
    }
    return "That's a great question about the election process. I'm here to ensure you have a smooth voting experience. Could you please clarify if you're asking about registration, candidates, or polling day procedures?";
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-8 right-8 w-16 h-16 gradient-tn rounded-full shadow-glow flex items-center justify-center text-white z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-96 h-[600px] max-h-[70vh] glass rounded-[32px] shadow-premium z-50 flex flex-col overflow-hidden border-white/20"
          >
            {/* Header */}
            <div className="p-6 bg-brand-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-black tracking-tight leading-none">ELEA AI</h3>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Election Expert</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Assistant" className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-white/10' : 'bg-brand-primary/10 text-brand-primary'}`}>
                      {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-white text-black' : 'bg-white/5 border border-white/10'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about ID, timing, or process..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  aria-label="Send message"
                  className="absolute right-2 top-2 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
