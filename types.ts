export interface ProcessedImage {
  originalUrl: string;
  originalFile: File;
  resultUrl: string | null;
  prompt: string;
  isLoading: boolean;
  error: string | null;
}

export enum AppState {
  IDLE = 'IDLE',
  EDITING = 'EDITING',
}

export type PresetPrompt = {
  label: string;
  prompt: string;
  icon: string;
};