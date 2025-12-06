import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_NAME } from "../constants";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateEditedImage = async (
  imageFile: File, 
  prompt: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    // Check for candidates and parts
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const candidate = candidates[0];

    // Check if content exists (it might be missing if safety filters triggered)
    if (!candidate.content) {
      const finishReason = (candidate as any).finishReason;
      if (finishReason) {
        throw new Error(`Generation failed. Finish reason: ${finishReason} (Likely safety filter blocked the request)`);
      }
      throw new Error("Gemini returned a candidate but no content.");
    }

    const parts = candidate.content.parts;
    
    if (!parts || parts.length === 0) {
      throw new Error("Gemini returned content but no parts.");
    }

    let imageUrl = '';

    // Iterate parts to find the image
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break; // Found the image, stop searching
      }
    }

    if (!imageUrl) {
      // Sometimes the model might refuse and return text explaining why
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }
      throw new Error("No image data found in response.");
    }

    return imageUrl;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};