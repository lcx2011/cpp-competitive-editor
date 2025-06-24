import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CompileResult {
  success: boolean;
  output: string;
  error: string;
  executionTime?: number;
}

interface EditorContextType {
  code: string;
  setCode: (code: string) => void;
  isCompiling: boolean;
  compileResult: CompileResult | null;
  compileAndRun: (input?: string) => Promise<void>;
  compileOnly: () => Promise<void>;
  clearOutput: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);

  const compileAndRun = useCallback(async (input?: string) => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }

    setIsCompiling(true);
    setCompileResult(null);

    try {
      const result = await window.electronAPI.compileAndRun(code, input);
      setCompileResult(result);
    } catch (error) {
      setCompileResult({
        success: false,
        output: '',
        error: `编译运行失败: ${error}`
      });
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  const compileOnly = useCallback(async () => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }

    setIsCompiling(true);
    setCompileResult(null);

    try {
      const result = await window.electronAPI.compileOnly(code);
      setCompileResult(result);
    } catch (error) {
      setCompileResult({
        success: false,
        output: '',
        error: `编译失败: ${error}`
      });
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  const clearOutput = useCallback(() => {
    setCompileResult(null);
  }, []);

  const value: EditorContextType = {
    code,
    setCode,
    isCompiling,
    compileResult,
    compileAndRun,
    compileOnly,
    clearOutput
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
