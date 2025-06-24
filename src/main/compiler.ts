import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface CompileResult {
  success: boolean;
  output: string;
  error: string;
  executionTime?: number;
}

export class CompilerService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'cpp-competitive-editor');
    this.ensureTempDir();
  }

  private ensureTempDir(): void {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async compile(code: string): Promise<CompileResult> {
    const sourceFile = path.join(this.tempDir, 'temp.cpp');
    const executableFile = path.join(this.tempDir, 'temp.exe');

    try {
      // Write source code to file
      fs.writeFileSync(sourceFile, code);

      // Compile with g++ (optimized for competitive programming)
      const compileResult = await this.runCommand('g++', [
        '-std=c++17',
        '-O2',
        '-Wall',
        '-Wextra',
        '-static-libgcc',
        '-static-libstdc++',
        sourceFile,
        '-o',
        executableFile
      ]);

      if (compileResult.code === 0) {
        return {
          success: true,
          output: '编译成功',
          error: ''
        };
      } else {
        return {
          success: false,
          output: '',
          error: compileResult.stderr || compileResult.stdout
        };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: `编译错误: ${error}`
      };
    }
  }

  async compileAndRun(code: string, input?: string): Promise<CompileResult> {
    const compileResult = await this.compile(code);
    
    if (!compileResult.success) {
      return compileResult;
    }

    const executableFile = path.join(this.tempDir, 'temp.exe');

    try {
      const startTime = Date.now();
      const runResult = await this.runCommand(executableFile, [], input);
      const executionTime = Date.now() - startTime;

      return {
        success: runResult.code === 0,
        output: runResult.stdout,
        error: runResult.stderr,
        executionTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: `运行错误: ${error}`
      };
    }
  }

  private runCommand(command: string, args: string[], input?: string): Promise<{
    code: number;
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve) => {
      const process = spawn(command, args);
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

      process.on('close', (code) => {
        resolve({ code: code || 0, stdout, stderr });
      });

      process.on('error', (error) => {
        resolve({ code: -1, stdout, stderr: error.message });
      });

      // Set timeout for execution (10 seconds)
      setTimeout(() => {
        process.kill();
        resolve({ code: -1, stdout, stderr: '程序执行超时' });
      }, 10000);
    });
  }
}
