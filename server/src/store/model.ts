export enum AnalysisStatus {
  IN_PROGRESS = "ANALYSIS_IN_PROGRESS",
  COMPLETE = "ANALYSIS_COMPLETE",
  FAILED = "ANALYSIS_FAILED"
}

export type Feedback = {
  id: number;
  text: string;
  status: string;
  message?: string;
}

export type Highlight = {
  id: number;
  feedbackId: number;
  summary: string;
  quote: string;
}