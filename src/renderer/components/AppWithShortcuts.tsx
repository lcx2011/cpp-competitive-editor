import React, { useState } from 'react';
import { ShortcutsHelp } from './Help/ShortcutsHelp';
import { SettingsPanel } from './Settings/SettingsPanel';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSettings } from '../contexts/SettingsContext';
import { useFile } from '../contexts/FileContext';
import { useEditor } from '../contexts/EditorContext';

interface AppWithShortcutsProps {
  children: React.ReactNode;
}

export const AppWithShortcuts: React.FC<AppWithShortcutsProps> = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const { createNewTab, openFile, saveFile, saveAsFile, closeTab, activeTab } = useFile();
  const { compileAndRun, compileOnly } = useEditor();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 定义快捷键
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      action: createNewTab,
      description: '新建文件'
    },
    {
      key: 'o',
      ctrl: true,
      action: openFile,
      description: '打开文件'
    },
    {
      key: 's',
      ctrl: true,
      action: saveFile,
      description: '保存文件'
    },
    {
      key: 's',
      ctrl: true,
      shift: true,
      action: saveAsFile,
      description: '另存为'
    },
    {
      key: 'w',
      ctrl: true,
      action: () => activeTab && closeTab(activeTab.id),
      description: '关闭标签页'
    },
    {
      key: 'F5',
      action: () => compileAndRun(),
      description: '编译并运行'
    },
    {
      key: 'F5',
      ctrl: true,
      action: compileOnly,
      description: '仅编译'
    },
    {
      key: 'F1',
      action: () => setShowShortcutsHelp(true),
      description: '显示快捷键帮助'
    },
    {
      key: ',',
      ctrl: true,
      action: () => setShowSettings(true),
      description: '打开设置'
    }
  ]);

  return (
    <>
      {children}
      
      <ShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </>
  );
};
