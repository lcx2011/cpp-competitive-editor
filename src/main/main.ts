import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createMenu } from './menu';
import { CompilerService } from './compiler';

class Application {
  private mainWindow: BrowserWindow | null = null;
  private compilerService: CompilerService;

  constructor() {
    this.compilerService = new CompilerService();
    this.setupApp();
    this.setupIPC();
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupMenu();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: path.join(__dirname, '../../assets/icon.png'),
      show: false
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });
  }

  private setupMenu(): void {
    const menu = createMenu(this.mainWindow!);
    Menu.setApplicationMenu(menu);
  }

  private setupIPC(): void {
    // File operations
    ipcMain.handle('open-file-dialog', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        properties: ['openFile'],
        filters: [
          { name: 'C++ Files', extensions: ['cpp', 'cc', 'cxx', 'c++'] },
          { name: 'C Files', extensions: ['c'] },
          { name: 'Header Files', extensions: ['h', 'hpp', 'hxx'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      return result;
    });

    ipcMain.handle('save-file-dialog', async () => {
      const result = await dialog.showSaveDialog(this.mainWindow!, {
        filters: [
          { name: 'C++ Files', extensions: ['cpp'] },
          { name: 'C Files', extensions: ['c'] },
          { name: 'Header Files', extensions: ['h', 'hpp'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      return result;
    });

    // File operations
    ipcMain.handle('read-file', async (event, filePath: string) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return { success: true, content };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
      try {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    // Compiler operations
    ipcMain.handle('compile-and-run', async (event, code: string, input?: string) => {
      return await this.compilerService.compileAndRun(code, input);
    });

    ipcMain.handle('compile-only', async (event, code: string) => {
      return await this.compilerService.compile(code);
    });
  }
}

new Application();
