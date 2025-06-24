export interface ElectronAPI {
  openFileDialog: () => Promise<{
    canceled: boolean;
    filePaths: string[];
  }>;
  saveFileDialog: () => Promise<{
    canceled: boolean;
    filePath?: string;
  }>;
  compileAndRun: (code: string, input?: string) => Promise<{
    success: boolean;
    output: string;
    error: string;
    executionTime?: number;
  }>;
  compileOnly: (code: string) => Promise<{
    success: boolean;
    output: string;
    error: string;
  }>;
  onMenuEvent: (callback: (event: string) => void) => void;
  removeAllListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
