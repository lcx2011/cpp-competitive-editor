import React, { createContext, useContext, useState, useEffect } from 'react';
import { EditorSettings } from '../components/Settings/SettingsPanel';

interface SettingsContextType {
  settings: EditorSettings;
  updateSettings: (newSettings: EditorSettings) => void;
  resetSettings: () => void;
}

const defaultSettings: EditorSettings = {
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  tabSize: 4,
  wordWrap: true,
  lineNumbers: true,
  autoSave: false,
  theme: 'dark',
  compilerPath: 'g++',
  compilerFlags: '-std=c++17 -O2 -Wall -Wextra'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);

  // 从localStorage加载设置
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('editorSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // 保存设置到localStorage
  const updateSettings = (newSettings: EditorSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('editorSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem('editorSettings');
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
