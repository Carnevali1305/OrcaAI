import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { getAIConstructionAdvice, analyzePlanImage } from '../services/geminiService';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: string;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, contextData }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'vision'>('chat');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && contextData && !response) {
      // Auto-greeting or context awareness
    }
  }, [isOpen, contextData, response]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(''); // Clear previous
    
    const result = await getAIConstructionAdvice(query, contextData);
    
    setResponse(result);
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleVisionAnalyze = async () => {
      if(!selectedImage) return;
      setIsLoading(true);
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzePlanImage(base64Data, query || "Identifique os elementos construtivos e estime materiais.");
      setResponse(result);
      setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-semibold text-lg">OrçaAI Consultant</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
                Chat Técnico
            </button>
            <button 
                onClick={() => setActiveTab('vision')}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'vision' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
                QTO Assistido (Visão)
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'chat' ? (
              <>
                {!response && !isLoading && (
                    <div className="text-center text-slate-400 mt-20">
                    <BrainIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Faça uma pergunta sobre composições, SINAPI, ou peça para analisar o orçamento atual.</p>
                    </div>
                )}
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm font-medium">Analisando dados...</p>
                    </div>
                )}

                {response && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {response}
                    </div>
                )}
              </>
          ) : (
              <div className="flex flex-col items-center">
                  {!selectedImage ? (
                      <label className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                          <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">Clique para enviar Planta Baixa (Imagem)</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                  ) : (
                      <div className="relative w-full mb-4">
                          <img src={selectedImage} alt="Planta" className="w-full h-48 object-cover rounded-xl" />
                          <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                          >
                              <X className="w-4 h-4" />
                          </button>
                      </div>
                  )}

                  {isLoading ? (
                       <div className="mt-8 flex flex-col items-center text-indigo-600">
                       <Loader2 className="w-8 h-8 animate-spin mb-2" />
                       <p className="text-sm font-medium">Lendo planta...</p>
                       </div>
                  ) : response ? (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 w-full text-sm mt-4 whitespace-pre-line">
                        {response}
                    </div>
                  ) : (
                      selectedImage && <p className="text-xs text-slate-500 mt-4">Digite o que deseja extrair da imagem abaixo.</p>
                  )}
              </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={activeTab === 'chat' ? "Ex: Qual o rendimento de pedreiro para alvenaria?" : "Ex: Quantas portas existem nesta planta?"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'chat' ? handleSend() : handleVisionAnalyze())}
            />
            <button
              onClick={activeTab === 'chat' ? handleSend : handleVisionAnalyze}
              disabled={isLoading || (!query && activeTab === 'chat') || (!selectedImage && activeTab === 'vision')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

export default AIModal;