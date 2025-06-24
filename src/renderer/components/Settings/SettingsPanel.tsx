import React, { useState } from 'react';
import './SettingsPanel.css';

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  theme: 'dark' | 'light';
  compilerPath: string;
  compilerFlags: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings);

  if (!isOpen) return null;

  const handleChange = (key: keyof EditorSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
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
    setLocalSettings(defaultSettings);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h3>编辑器设置</h3>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h4>编辑器外观</h4>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">字体大小:</label>
                <input
                  type="number"
                  className="setting-input"
                  value={localSettings.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  min="10"
                  max="24"
                />
                <span className="setting-unit">px</span>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">字体族:</label>
                <select
                  className="setting-select"
                  value={localSettings.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                >
                  <option value='Consolas, "Courier New", monospace'>Consolas</option>
                  <option value='"Fira Code", monospace'>Fira Code</option>
                  <option value='"Source Code Pro", monospace'>Source Code Pro</option>
                  <option value='"JetBrains Mono", monospace'>JetBrains Mono</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">主题:</label>
                <select
                  className="setting-select"
                  value={localSettings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option value="dark">深色主题</option>
                  <option value="light">浅色主题</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>编辑器行为</h4>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">Tab大小:</label>
                <input
                  type="number"
                  className="setting-input"
                  value={localSettings.tabSize}
                  onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
                  min="2"
                  max="8"
                />
                <span className="setting-unit">空格</span>
              </div>
              
              <div className="setting-item">
                <label className="setting-checkbox-label">
                  <input
                    type="checkbox"
                    className="setting-checkbox"
                    checked={localSettings.wordWrap}
                    onChange={(e) => handleChange('wordWrap', e.target.checked)}
                  />
                  自动换行
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-checkbox-label">
                  <input
                    type="checkbox"
                    className="setting-checkbox"
                    checked={localSettings.lineNumbers}
                    onChange={(e) => handleChange('lineNumbers', e.target.checked)}
                  />
                  显示行号
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-checkbox-label">
                  <input
                    type="checkbox"
                    className="setting-checkbox"
                    checked={localSettings.autoSave}
                    onChange={(e) => handleChange('autoSave', e.target.checked)}
                  />
                  自动保存
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>编译器设置</h4>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">编译器路径:</label>
                <input
                  type="text"
                  className="setting-input-wide"
                  value={localSettings.compilerPath}
                  onChange={(e) => handleChange('compilerPath', e.target.value)}
                  placeholder="g++"
                />
              </div>
              
              <div className="setting-item">
                <label className="setting-label">编译参数:</label>
                <input
                  type="text"
                  className="setting-input-wide"
                  value={localSettings.compilerFlags}
                  onChange={(e) => handleChange('compilerFlags', e.target.value)}
                  placeholder="-std=c++17 -O2 -Wall -Wextra"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="btn btn-secondary" onClick={handleReset}>
            重置默认
          </button>
          <div className="settings-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button className="btn" onClick={handleSave}>
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
