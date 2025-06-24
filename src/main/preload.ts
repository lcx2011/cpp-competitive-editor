import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: () => ipcRenderer.invoke('save-file-dialog'),
  
  // Compiler operations
  compileAndRun: (code: string, input?: string) => 
    ipcRenderer.invoke('compile-and-run', code, input),
  compileOnly: (code: string) => 
    ipcRenderer.invoke('compile-only', code),
  
  // Menu events
  onMenuEvent: (callback: (event: string) => void) => {
    const events = [
      'menu-new-file',
      'menu-open-file', 
      'menu-save-file',
      'menu-save-as',
      'menu-compile-run',
      'menu-compile-only',
      'menu-about'
    ];
    
    events.forEach(event => {
      ipcRenderer.on(event, () => callback(event));
    });
  },
  
  // Remove all listeners
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-file');
    ipcRenderer.removeAllListeners('menu-open-file');
    ipcRenderer.removeAllListeners('menu-save-file');
    ipcRenderer.removeAllListeners('menu-save-as');
    ipcRenderer.removeAllListeners('menu-compile-run');
    ipcRenderer.removeAllListeners('menu-compile-only');
    ipcRenderer.removeAllListeners('menu-about');
  }
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      openFileDialog: () => Promise<any>;
      saveFileDialog: () => Promise<any>;
      compileAndRun: (code: string, input?: string) => Promise<any>;
      compileOnly: (code: string) => Promise<any>;
      onMenuEvent: (callback: (event: string) => void) => void;
      removeAllListeners: () => void;
    };
  }
}
