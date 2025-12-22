
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Strictly follow the @google/genai coding guidelines for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativeBio = async (name: string, niche: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling, short professional bio for a content creator named ${name} who specializes in ${niche}. Make it sound modern, inviting, and professional. Max 30 words.`,
    });
    return response.text || "Passionate creator making waves in the digital space.";
  } catch (error) {
    console.error("Bio generation failed", error);
    return "Creating unique experiences for my amazing community.";
  }
};

export const suggestThankYouMessage = async (donorName: string, amount: number, currency: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, heart-warming thank you message from a creator to a donor named ${donorName} who just donated ${amount} ${currency}. Include one specific appreciative sentence about how this helps the creative process.`,
    });
    return response.text || `Thank you so much, ${donorName}! Your support means the world to me.`;
  } catch (error) {
    console.error("Thank you message failed", error);
    return `Thank you for your generous gift, ${donorName}!`;
  }
};
