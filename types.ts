export interface HistoryItem {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  currentCode: string | null;
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE'
}