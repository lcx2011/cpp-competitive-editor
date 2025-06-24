import React, { createContext, useContext, useState, useCallback } from 'react';
import * as fs from 'fs';

interface FileTab {
  id: string;
  name: string;
  path?: string;
  content: string;
  isDirty: boolean;
}

interface FileContextType {
  tabs: FileTab[];
  activeTabId: string | null;
  activeTab: FileTab | null;
  createNewTab: () => void;
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveAsFile: () => Promise<void>;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: React.ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [tabs, setTabs] = useState<FileTab[]>([
    {
      id: 'default',
      name: 'main.cpp',
      content: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      isDirty: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('default');

  const activeTab = tabs.find(tab => tab.id === activeTabId) || null;

  const createNewTab = useCallback(() => {
    const newTab: FileTab = {
      id: `tab-${Date.now()}`,
      name: 'untitled.cpp',
      content: `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}`,
      isDirty: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const openFile = useCallback(async () => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }

    try {
      const result = await window.electronAPI.openFileDialog();
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileName = filePath.split(/[\\/]/).pop() || 'untitled.cpp';
        
        // Check if file is already open
        const existingTab = tabs.find(tab => tab.path === filePath);
        if (existingTab) {
          setActiveTabId(existingTab.id);
          return;
        }

        // Read file content (in a real app, this would be done in the main process)
        const content = await new Promise<string>((resolve, reject) => {
          // This is a placeholder - in reality, file reading should be done via IPC
          resolve(`// File: ${fileName}
#include <iostream>
using namespace std;

int main() {
    
    return 0;
}`);
        });

        const newTab: FileTab = {
          id: `tab-${Date.now()}`,
          name: fileName,
          path: filePath,
          content,
          isDirty: false
        };

        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  }, [tabs]);

  const saveFile = useCallback(async () => {
    if (!activeTab) return;

    if (activeTab.path) {
      // Save existing file
      // In a real app, this would be done via IPC to the main process
      console.log('Saving file:', activeTab.path);
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id ? { ...tab, isDirty: false } : tab
      ));
    } else {
      // Save as new file
      await saveAsFile();
    }
  }, [activeTab]);

  const saveAsFile = useCallback(async () => {
    if (!window.electronAPI || !activeTab) {
      return;
    }

    try {
      const result = await window.electronAPI.saveFileDialog();
      if (!result.canceled && result.filePath) {
        const fileName = result.filePath.split(/[\\/]/).pop() || 'untitled.cpp';
        
        setTabs(prev => prev.map(tab => 
          tab.id === activeTab.id 
            ? { ...tab, name: fileName, path: result.filePath, isDirty: false }
            : tab
        ));
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, [activeTab]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If closing active tab, switch to another tab
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          setActiveTabId(newTabs[newTabs.length - 1].id);
        } else {
          setActiveTabId('');
        }
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isDirty: tab.content !== content }
        : tab
    ));
  }, []);

  const value: FileContextType = {
    tabs,
    activeTabId,
    activeTab,
    createNewTab,
    openFile,
    saveFile,
    saveAsFile,
    closeTab,
    setActiveTab,
    updateTabContent
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
