import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, Bot, User as UserIcon, Loader2, Upload, Trash2 } from 'lucide-react';
import { getAIConstructionAdvice, analyzePlanImage } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  image?: string;
  timestamp: Date;
}

const AIConsultantPage: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'vision'>('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Olá! Sou seu Consultor Técnico OrçaAI. Posso ajudar com dúvidas sobre composições (SINAPI/TCPO), analisar custos ou, no modo Visual, ler plantas baixas e estimar quantitativos. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';

      if (mode === 'vision' && selectedImage) {
        // Remove header data from base64 if present for the API logic
        const base64Data = selectedImage.split(',')[1]; 
        responseText = await analyzePlanImage(base64Data, input || "Analise esta planta e liste os elementos construtivos visíveis.");
      } else {
        responseText = await getAIConstructionAdvice(input);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Desculpe, tive um problema ao processar sua solicitação. Tente novamente.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      if (mode === 'vision') {
        setSelectedImage(null); // Clear image after processing
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Consultor Técnico IA
          </h1>
          <p className="text-sm text-slate-500">Powered by Gemini 2.5</p>
        </div>
        
        {/* Mode Toggler */}
        <div className="bg-slate-100 p-1 rounded-lg flex">
          <button
            onClick={() => setMode('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Chat Técnico
          </button>
          <button
            onClick={() => setMode('vision')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'vision' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ImageIcon className="w-4 h-4" />
            QTO Assistido
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl p-4 shadow-sm whitespace-pre-line ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-indigo-600 text-white'}`}>
                {msg.image && (
                  <img src={msg.image} alt="Upload do usuário" className="max-w-full h-auto rounded-lg mb-3 border border-white/20" />
                )}
                {msg.content}
              </div>
              <span className="text-xs text-slate-400 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-200">
        {mode === 'vision' && (
          <div className="mb-4">
            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition"
              >
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-600">Clique para enviar Planta Baixa (PDF/JPG)</p>
                <p className="text-xs text-slate-400">A IA irá identificar paredes, portas e janelas.</p>
              </div>
            ) : (
              <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group">
                <img src={selectedImage} alt="Preview" className="h-32 w-auto object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
            />
          </div>
        )}

        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            placeholder={mode === 'chat' ? "Digite sua dúvida técnica..." : "O que devo analisar nesta planta?"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!input && !selectedImage)}
            className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultantPage;