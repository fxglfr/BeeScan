import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Mite } from '../types';

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

const PROMPT = `You are an expert beekeeper and computer vision analyst specializing in pest detection. Your task is to analyze an image of a hive inspection board (lange) to identify and count Varroa destructor mites using a rigorous, multi-step process.

Instructions:
1.  **Initial Scan & Noise Reduction:** Mentally filter out irrelevant noise and debris. Differentiate between bee parts, wax cappings, pollen, and actual mites. This is like applying a Gaussian filter to reduce visual noise.
2.  **Highlighting Areas of Interest:** Create a "mental mask" by focusing only on small, reddish-brown, oval-shaped objects that match the morphology of Varroa mites. Ignore everything else. This is your primary area of analysis.
3.  **Size and Shape Consistency Check:** Before confirming an object as a mite, evaluate its size. It must be large enough to be a mite and not just a speck of dust or tiny debris. It should have a distinct, solid oval shape. Discard candidates that are too small or have irregular, non-mite-like forms.
4.  **Detailed Identification & Counting:** Within the masked areas of interest, carefully identify each individual mite. For each mite you confirm, determine its coordinates as a percentage from the top and left edges of the image.
5.  **Border Artifact Rejection:** Critically examine any potential mites located at the very edge of the image. Objects touching or cut off by the image border are highly likely to be shadows, debris, or other artifacts. Exclude these from your final count unless you can identify them as a mite with very high confidence.
6.  **Verification:** Double-check your count. The final 'mite_count' must precisely equal the length of the 'mites' array.
7.  **JSON Output:** Respond ONLY with a valid JSON object that adheres to the provided schema.
8.  **Edge Cases:** If the image is unclear, not of an inspection board, or no mites are visible after your filtering process, set 'mite_count' to 0, 'mites' to an empty array, and explain the reason in the 'observations' field.

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
            description: "The total number of Varroa mites counted in the image. Must match the length of the 'mites' array.",
          },
          observations: {
            type: Type.STRING,
            description: "A brief summary of the findings, including infestation level or any issues with the image.",
          },
          mites: {
            type: Type.ARRAY,
            description: "A list of all detected mites with their coordinates.",
            items: {
              type: Type.OBJECT,
              properties: {
                x: {
                  type: Type.NUMBER,
                  description: "The mite's horizontal position as a percentage from the left edge (0-100).",
                },
                y: {
                  type: Type.NUMBER,
                  description: "The mite's vertical position as a percentage from the top edge (0-100).",
                }
              },
              required: ["x", "y"],
            }
          }
        },
        required: ["mite_count", "observations", "mites"],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    // Ensure mites array exists
    if (!result.mites) {
      result.mites = [];
    }
    return result as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
};


export const improveAnalysis = async (
  imageFile: File,
  initialResult: AnalysisResult,
  finalMites: Mite[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(imageFile);

  const FEEDBACK_PROMPT = `
    You are a computer vision model undergoing supervised learning for Varroa mite detection. You will receive feedback on a previous analysis to improve your performance.

    **Context:**
    You previously analyzed an image of a beekeeper's inspection board.

    **Your Initial Findings:**
    You identified ${initialResult.mite_count} mites at the following locations (x, y percentages):
    ${JSON.stringify(initialResult.mites, null, 2)}
    Your observation text was: "${initialResult.observations}"

    **Expert Correction:**
    A human expert has reviewed your work and provided the definitive ground truth. The correct number of mites is ${finalMites.length}, located at:
    ${JSON.stringify(finalMites, null, 2)}

    **Your Task:**
    1.  **Analyze the Discrepancy:** Compare your initial findings with the expert correction.
        *   Identify "false positives": What coordinates did you mark that the expert removed? Analyze the visual characteristics of these incorrect objects.
        *   Identify "false negatives": What coordinates did the expert add that you missed? Analyze the visual characteristics of the mites you failed to detect.
    2.  **Internalize Learning:** Adjust your internal parameters and pattern recognition algorithms based on this analysis. For example, if you misidentified a piece of dark wax as a mite, learn to better differentiate textures. If you missed a partially obscured mite, improve your ability to recognize incomplete shapes.
    3.  **Acknowledge:** Confirm that you have received, processed, and learned from this feedback. Respond with a brief, positive confirmation message. Do not output JSON.
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { text: FEEDBACK_PROMPT },
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Data,
          },
        },
      ],
    },
  });

  return response.text;
};