
import { GoogleGenAI, Type } from "@google/genai";

/* A chave API é injetada pelo Vite via 'define' no config */
// Fix: Use mandatory named parameter for apiKey and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRouteInsights = async (routeName: string, location: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Forneça 3 dicas de segurança e 1 destaque paisagístico para uma viagem de moto chamada "${routeName}" perto de ${location}. A resposta DEVE estar em Português Brasil. Retorne como JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            scenicHighlight: { type: Type.STRING }
          },
          required: ["safetyTips", "scenicHighlight"]
        }
      }
    });

    // Fix: Access response text via property as per standard
    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia do modelo");
    }

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return {
      safetyTips: ["Mantenha a manutenção em dia", "Use equipamentos de proteção", "Respeite a sinalização local"],
      scenicHighlight: "As belas estradas do cerrado goiano."
    };
  }
};
