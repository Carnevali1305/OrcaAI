import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIConstructionAdvice = async (query: string, context?: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Você é um Engenheiro Civil Sênior e Especialista em Orçamentos de Obras trabalhando para o OrçaAI.
    Seu objetivo é ajudar engenheiros e orçamentistas a criar orçamentos precisos, analisar composições de custos e sugerir melhorias.
    Seja técnico, direto e use terminologia adequada (SINAPI, TCPO, BDI, Curva ABC).
    Sempre responda em Português do Brasil.
    
    Contexto atual do projeto: ${context || 'Nenhum contexto específico fornecido.'}`;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar uma resposta no momento.";
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Desculpe, ocorreu um erro ao processar sua solicitação técnica. Verifique sua conexão ou tente novamente.";
  }
};

export const analyzePlanImage = async (base64Image: string, prompt: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash'; // Capable of vision
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image
                        }
                    },
                    {
                        text: `Atue como um especialista em Levantamento de Quantitativos (QTO). Analise esta planta baixa/detalhe técnico. ${prompt}`
                    }
                ]
            }
        });
        return response.text || "Não consegui analisar a imagem.";
    } catch (error) {
        console.error("Erro vision:", error);
        return "Erro ao analisar a planta.";
    }
}
