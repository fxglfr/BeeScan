export interface Mite {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

export interface AnalysisResult {
  mite_count: number;
  observations: string;
  mites: Mite[];
  optimal_threshold: number; // The AI's suggested threshold value (0-255)
  optimal_saturation: number; // The AI's suggested saturation value (0-200)
  optimal_temperature: number; // The AI's suggested temperature value (-100 to 100)
  optimal_tint: number; // The AI's suggested tint value (-100 to 100)
  optimal_zoom: number; // The AI's suggested zoom level (1-5)
  optimal_center: { x: number; y: number }; // The AI's suggested focus center (0-100)
}
