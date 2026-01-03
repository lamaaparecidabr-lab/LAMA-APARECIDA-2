
import { GoogleGenAI, Type } from "@google/genai";

/* Always use the direct process.env.API_KEY for initialization as per guidelines */
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return null;
  }
};
