
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const PROMPT = `You are an expert beekeeper specializing in pest detection. Your task is to analyze an image of a hive inspection board (lange) to identify and count Varroa destructor mites.

Instructions:
1. Carefully examine the entire image for small, reddish-brown, oval-shaped Varroa mites.
2. Count every mite you can clearly identify.
3. Respond ONLY with a valid JSON object that adheres to the provided schema.
4. If the image is unclear, not of an inspection board, or no mites are visible, set 'mite_count' to 0 and explain the reason in the 'observations' field.

Do not include any text, markdown formatting, or explanations outside of the JSON object.`;


export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { text: PROMPT },
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Data,
          },
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mite_count: {
            type: Type.INTEGER,
            description: "The total number of Varroa mites counted in the image.",
          },
          observations: {
            type: Type.STRING,
            description: "A brief summary of the findings, including infestation level or any issues with the image.",
          },
        },
        required: ["mite_count", "observations"],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
};
