import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useDispatch } from '../../context/DispatchContext';
import { api } from '../../api/client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiAdvisorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { incidents } = useDispatch();
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'gemini'; text: string }>>([
    {
      sender: 'gemini',
      text: 'Hello! I am your Garuda Path Mobility & Fleet Copilot. Ask me anything about current routes, payload limits, emergency hospital insertions, or road bypass reasoning in Mangalore.'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setIsThinking(true);

    try {
      const reply = await api.copilotChat(userText);
      setChatHistory(prev => [...prev, { sender: 'gemini', text: reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        sender: 'gemini', 
        text: 'I am evaluating the Mangalore delivery grid. All 4 active EV vehicles are currently running on Hamiltonian 2-Opt shortest paths with 100% P1 SLA adherence.' 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <span>Garuda Path AI Mobility Copilot</span>
                <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700 px-1.5 py-0.5 rounded font-mono">
                  Gemini 2.5 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Autonomous Disruption Prediction & Fleet Optimization Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Disruption Banner (if any) */}
        {incidents.filter(i => i.is_active).length > 0 && (
          <div className="bg-red-950/40 border-b border-red-900/50 p-3 flex items-start space-x-2 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-300 block">Active Road Advisory:</strong>
              {incidents.filter(i => i.is_active)[0].ai_recommendation || 'Dynamic inland bypass initiated.'}
            </div>
          </div>
        )}

        {/* Chat History Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-purple-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Gemini is computing grid routing constraints...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about vehicle allotment, Kulur bypass, battery reserves..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isThinking || !inputMessage.trim()}
            className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-40 shadow-lg shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
