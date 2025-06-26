import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CompileResult {
  success: boolean;
  output: string;
  error: string;
  executionTime?: number;
}

export interface TestCase {
  id: number;
  name: string;
  input: string;
  expectedOutput: string;
  active: boolean;
}

interface TestResult {
  testCase: TestCase;
  actualOutput: string;
  passed: boolean;
  executionTime?: number;
  error?: string;
}

interface EditorContextType {
  code: string;
  setCode: (code: string) => void;
  isCompiling: boolean;
  compileResult: CompileResult | null;
  compileAndRun: (input?: string, testCases?: TestCase[]) => Promise<void>;
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

  const compileAndRun = useCallback(async (input?: string, testCases?: TestCase[]) => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }

    setIsCompiling(true);
    setCompileResult(null);

    try {
      // 首先运行主要输入
      const mainResult = await window.electronAPI.compileAndRun(code, input);

      if (!mainResult.success) {
        setCompileResult(mainResult);
        return;
      }

      // 如果没有测试用例，直接返回主要结果
      if (!testCases || testCases.length === 0) {
        setCompileResult(mainResult);
        return;
      }

      // 构建包含测试结果的输出
      let output = '编译成功!\n\n';

      // 显示主要运行结果
      if (input && input.trim()) {
        output += '=== 主要运行结果 ===\n';
        output += `输入: ${input.trim()}\n`;
        output += `输出: ${mainResult.output || '(无输出)'}\n`;
        if (mainResult.executionTime !== undefined) {
          output += `执行时间: ${mainResult.executionTime}ms\n`;
        }
      } else {
        output += '程序输出:\n' + (mainResult.output || '(无输出)');
        if (mainResult.executionTime !== undefined) {
          output += `\n\n执行时间: ${mainResult.executionTime}ms`;
        }
      }

      // 运行所有测试用例
      output += '\n\n' + '='.repeat(50) + '\n';
      output += '=== 测试用例运行结果 ===\n';
      output += '='.repeat(50) + '\n\n';

      const testResults: TestResult[] = [];
      let passedCount = 0;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        // 更新进度
        setCompileResult({
          success: true,
          output: output + `正在运行测试用例 ${i + 1}/${testCases.length}: ${testCase.name}...`,
          error: ''
        });

        try {
          const testResult = await window.electronAPI.compileAndRun(code, testCase.input);

          if (testResult.success) {
            const actualOutput = testResult.output?.trim() || '';
            const expectedOutput = testCase.expectedOutput.trim();
            const passed = actualOutput === expectedOutput;

            if (passed) passedCount++;

            testResults.push({
              testCase,
              actualOutput,
              passed,
              executionTime: testResult.executionTime
            });
          } else {
            testResults.push({
              testCase,
              actualOutput: '',
              passed: false,
              error: testResult.error
            });
          }
        } catch (error) {
          testResults.push({
            testCase,
            actualOutput: '',
            passed: false,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      // 显示测试结果摘要
      output += `测试结果摘要: ${passedCount}/${testCases.length} 通过\n\n`;

      // 显示每个测试用例的详细结果
      testResults.forEach((result, index) => {
        const status = result.passed ? '✅ 通过' : '❌ 失败';
        output += `测试用例 ${index + 1}: ${result.testCase.name} - ${status}\n`;
        output += `输入: ${result.testCase.input.trim() || '(无输入)'}\n`;
        output += `期望输出: ${result.testCase.expectedOutput.trim() || '(无输出)'}\n`;
        output += `实际输出: ${result.actualOutput || '(无输出)'}\n`;

        if (result.executionTime !== undefined) {
          output += `执行时间: ${result.executionTime}ms\n`;
        }

        if (result.error) {
          output += `错误: ${result.error}\n`;
        }

        if (!result.passed && !result.error) {
          output += `差异: 输出不匹配\n`;
        }

        output += '\n' + '-'.repeat(40) + '\n\n';
      });

      // 最终摘要
      if (passedCount === testCases.length) {
        output += '🎉 所有测试用例都通过了！';
      } else {
        output += `⚠️  ${testCases.length - passedCount} 个测试用例失败`;
      }

      setCompileResult({
        success: true,
        output,
        error: '',
        executionTime: mainResult.executionTime
      });

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
