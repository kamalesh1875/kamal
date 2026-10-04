'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  BookOpen,
  Database,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface GoatHealthChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    content:
      `Hello! I am your **Goat Health AI Assistant**, grounded in live herd telemetry, true cost accounting, and authoritative veterinary guidelines (TANUVAS, ICAR-CIRG, FAO).\n\nHow can I assist your livestock management today?`,
    timestamp: new Date().toISOString(),
    groundingSources: [
      { type: 'DATABASE', reference: 'MSK Farm Data Store' },
      { type: 'VETERINARY_LITERATURE', reference: 'TANUVAS & ICAR-CIRG Small Ruminant Guidelines' }
    ]
  }
];

const PROMPT_SUGGESTIONS = [
  'Show high-risk goats today',
  'Why was G-00253 flagged?',
  'Which goats reduced feeding?',
  'Show goats with abnormal feces',
  'What changed in Pen Alpha?',
  'Generate today\'s health report'
];

export const GoatHealthChatModal: React.FC<GoatHealthChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-health/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content })
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, data.response]);
      } else {
        throw new Error(data.error || 'Failed to process query');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to process query. Please check network connection.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[650px] max-h-[92vh] overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#11291F] via-[#1B4332] to-[#0E221A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Goat Health AI Assistant</span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  Grounded RAG
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Connected to real herd database & TANUVAS / ICAR-CIRG literature
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Suggestion Pills */}
        <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex gap-2 overflow-x-auto scrollbar-none text-xs">
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-900 whitespace-nowrap shadow-2xs active:scale-95 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="h-8 w-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-emerald-300" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#1B4332] text-white rounded-tr-xs'
                    : 'bg-slate-100/90 text-slate-900 rounded-tl-xs border border-slate-200/80 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {/* Grounding Sources Badges */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] space-y-1 text-slate-600">
                    <span className="font-bold uppercase tracking-wider block text-slate-400">
                      Grounded Sources:
                    </span>
                    {msg.groundingSources.map((g, i) => (
                      <div key={i} className="flex items-center gap-1 text-slate-700">
                        {g.type === 'DATABASE' ? (
                          <Database className="h-3 w-3 text-emerald-700 shrink-0" />
                        ) : (
                          <BookOpen className="h-3 w-3 text-indigo-700 shrink-0" />
                        )}
                        <span className="font-mono">{g.reference}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs">
              <div className="h-8 w-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-emerald-300 animate-spin" />
              </div>
              <span>Querying herd data & retrieving veterinary evidence...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about goat health, nutrition, diseases, or pen status..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:bg-white focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-2xl bg-[#1B4332] hover:bg-[#133024] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
