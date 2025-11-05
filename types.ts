export interface Mite {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

export interface AnalysisResult {
  mite_count: number;
  observations: string;
  mites: Mite[];
}