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
1.  **Determine Optimal Lens and Filter Parameters:** First, analyze the image's content and histogram. Determine the single best binary threshold value (0-255), optimal saturation (0-200), optimal temperature (-100 to 100), and optimal tint (-100 to 100). Additionally, determine the optimal 'Lens' settings: a zoom level (1.0 to 5.0) and a focus center (x, y percentages) that would best highlight the most critical area for mite detection. These values are critical for the next step.
2.  **Conceptual Lens and Filtering:** Apply your determined lens (zoom/center) and color filters conceptually. Focus your analysis as if you are looking through this magnified and color-corrected lens. Within this view, filter out irrelevant noise and debris. Differentiate between bee parts, wax cappings, pollen, and actual mites.
3.  **Size and Shape Consistency Check:** Before confirming an object as a mite, evaluate its size. It must be large enough to be a mite and not just a speck of dust. It should have a distinct, solid oval shape. Discard candidates that are too small or have irregular, non-mite-like forms.
4.  **Detailed Identification & Counting:** Within the filtered areas of interest, carefully identify each individual mite. For each mite you confirm, determine its coordinates as a percentage from the top and left edges of the image.
5.  **Border Artifact Rejection:** Critically examine any potential mites located at the very edge of the image. Objects touching or cut off by the image border are highly likely to be shadows or artifacts. Exclude these unless you can identify them with very high confidence.
6.  **Verification:** Double-check your count. The final 'mite_count' must precisely equal the length of the 'mites' array.
7.  **JSON Output:** Respond ONLY with a valid JSON object that adheres to the provided schema. You MUST include the 'optimal_threshold', 'optimal_saturation', 'optimal_temperature', 'optimal_tint', 'optimal_zoom', and 'optimal_center' values you determined in step 1.
8.  **Edge Cases:** If the image is unclear, not of an inspection board, or no mites are visible, set 'mite_count' to 0, 'mites' to an empty array, provide suitable default values for all parameters (e.g., threshold: 128, saturation: 100, temperature: 0, tint: 0, zoom: 1.0, center: {x: 50, y: 50}), and explain the reason in the 'observations' field.

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
          },
          optimal_threshold: {
            type: Type.INTEGER,
            description: "The optimal binary threshold value (0-255) determined by the AI to best isolate mites.",
          },
          optimal_saturation: {
            type: Type.INTEGER,
            description: "The optimal saturation level (0-200) determined by the AI to best highlight mites.",
          },
          optimal_temperature: {
            type: Type.INTEGER,
            description: "The optimal color temperature (-100 to 100) determined by the AI to best highlight mites.",
          },
          optimal_tint: {
            type: Type.INTEGER,
            description: "The optimal tint (-100 to 100) determined by the AI to best highlight mites.",
          },
          optimal_zoom: {
            type: Type.NUMBER,
            description: "The optimal zoom level (1.0 to 5.0) to focus on the most critical area.",
          },
          optimal_center: {
            type: Type.OBJECT,
            description: "The (x, y) center coordinates of the focus area as percentages (0-100).",
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER }
            },
            required: ["x", "y"]
          }
        },
        required: ["mite_count", "observations", "mites", "optimal_threshold", "optimal_saturation", "optimal_temperature", "optimal_tint", "optimal_zoom", "optimal_center"],
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
     // Ensure optimal_threshold exists
    if (typeof result.optimal_threshold !== 'number') {
      result.optimal_threshold = 145; // Default value if AI fails to provide one
    }
    // Ensure optimal_saturation exists
    if (typeof result.optimal_saturation !== 'number') {
      result.optimal_saturation = 100; // Default value if AI fails to provide one
    }
    // Ensure optimal_temperature exists
    if (typeof result.optimal_temperature !== 'number') {
      result.optimal_temperature = 0; // Default value if AI fails to provide one
    }
    // Ensure optimal_tint exists
    if (typeof result.optimal_tint !== 'number') {
      result.optimal_tint = 0; // Default value if AI fails to provide one
    }
    // Ensure optimal_zoom exists
    if (typeof result.optimal_zoom !== 'number') {
      result.optimal_zoom = 1.0;
    }
    // Ensure optimal_center exists
    if (!result.optimal_center || typeof result.optimal_center.x !== 'number' || typeof result.optimal_center.y !== 'number') {
      result.optimal_center = { x: 50, y: 50 };
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
