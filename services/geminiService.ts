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

export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  const base64Data = await fileToBase64(imageFile);

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Data,
      mimeType: imageFile.type,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server-side analysis failed with status code ${response.status}.`);
  }

  const result = await response.json();
  return result as AnalysisResult;
};

export const improveAnalysis = async (
  imageFile: File,
  initialResult: AnalysisResult,
  finalMites: Mite[]
): Promise<string> => {
  const base64Data = await fileToBase64(imageFile);

  const response = await fetch("/api/improve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Data,
      mimeType: imageFile.type,
      initialResult,
      finalMites,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server-side improvement request failed with status code ${response.status}.`);
  }

  const result = await response.json();
  return result.text;
};
