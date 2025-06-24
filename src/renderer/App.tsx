import React, { useState, useEffect } from 'react';
import { FileProvider } from './contexts/FileContext';
import { EditorProvider } from './contexts/EditorContext';
import { SettingsProvider } from './contexts/SettingsContext';
import SimpleCodeEditor from './components/Editor/SimpleCodeEditor';
import { ShortcutsHelp } from './components/Help/ShortcutsHelp';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { useKeyboardShortcuts, SHORTCUTS } from './hooks/useKeyboardShortcuts';
import { useSettings } from './contexts/SettingsContext';
import { useFile } from './contexts/FileContext';
import { useEditor } from './contexts/EditorContext';

console.log('App.tsx loaded successfully');

// 文件标签页接口
interface FileTab {
  id: string;
  name: string;
  content: string;
  isDirty: boolean;
}

// 简化的布局组件
const SimpleLayout: React.FC = () => {
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
  const [activeTabId, setActiveTabId] = useState('default');
  const [output, setOutput] = useState('点击"运行"按钮查看程序输出');
  const [isCompiling, setIsCompiling] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const code = activeTab?.content || '';

  const updateTabContent = (content: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId
        ? { ...tab, content, isDirty: tab.content !== content }
        : tab
    ));
  };

  const createNewTab = () => {
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
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // 至少保留一个标签页

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (tabId === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  };

  const handleRun = async () => {
    if (!window.electronAPI) {
      setOutput('错误: Electron API 不可用');
      return;
    }

    setIsCompiling(true);
    setOutput('正在编译运行...');

    try {
      const result = await window.electronAPI.compileAndRun(code);
      if (result.success) {
        let outputText = '编译成功!\n\n';
        if (result.output) {
          outputText += '程序输出:\n' + result.output;
        }
        if (result.executionTime !== undefined) {
          outputText += `\n\n执行时间: ${result.executionTime}ms`;
        }
        setOutput(outputText);
      } else {
        setOutput('编译错误:\n' + result.error);
      }
    } catch (error) {
      setOutput('运行失败: ' + error);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCompile = async () => {
    if (!window.electronAPI) {
      setOutput('错误: Electron API 不可用');
      return;
    }

    setIsCompiling(true);
    setOutput('正在编译...');

    try {
      const result = await window.electronAPI.compileOnly(code);
      if (result.success) {
        setOutput('编译成功! 没有错误。');
      } else {
        setOutput('编译错误:\n' + result.error);
      }
    } catch (error) {
      setOutput('编译失败: ' + error);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1e1e1e',
      color: '#cccccc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 标签栏 */}
      <div style={{
        height: '35px',
        background: '#2d2d30',
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* 标签页列表 */}
        <div style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                height: '35px',
                background: tab.id === activeTabId ? '#1e1e1e' : '#2d2d30',
                borderRight: '1px solid #3e3e42',
                borderBottom: tab.id === activeTabId ? '2px solid #007acc' : 'none',
                cursor: 'pointer',
                minWidth: '120px',
                fontSize: '13px'
              }}
            >
              <span style={{ flex: 1 }}>
                {tab.name}
                {tab.isDirty && <span style={{ color: '#f48771', marginLeft: '4px' }}>●</span>}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#cccccc',
                    fontSize: '16px',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    marginLeft: '8px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 新建标签页按钮 */}
        <button
          onClick={createNewTab}
          style={{
            background: 'none',
            border: 'none',
            color: '#cccccc',
            fontSize: '18px',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            borderRadius: '3px',
            margin: '0 8px'
          }}
        >
          +
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRun}
            disabled={isCompiling}
            style={{
              background: isCompiling ? '#666' : '#16825d',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '3px',
              cursor: isCompiling ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            {isCompiling ? '运行中...' : '▶ 运行'}
          </button>
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            style={{
              background: isCompiling ? '#666' : '#0078d4',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '3px',
              cursor: isCompiling ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            🔧 编译
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 编辑器区域 */}
        <div style={{
          flex: 1,
          background: '#1e1e1e'
        }}>
          <SimpleCodeEditor
            value={code}
            onChange={updateTabContent}
          />
        </div>

        {/* 输出区域 */}
        <div style={{
          height: '200px',
          background: '#252526',
          borderTop: '1px solid #3e3e42',
          padding: '12px'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>输出</div>
          <div style={{
            background: '#1e1e1e',
            border: '1px solid #3e3e42',
            borderRadius: '3px',
            padding: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            height: '150px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {output}
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div style={{
        height: '22px',
        background: '#007acc',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '12px'
      }}>
        就绪 | C++ | UTF-8
      </div>
    </div>
  );
};

// 主应用组件，包含快捷键处理
const MainApp: React.FC = () => {
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
      <SimpleLayout />

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

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('App initializing...');
    // 简单的初始化
    const timer = setTimeout(() => {
      console.log('App ready!');
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#1e1e1e',
        color: '#cccccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>C++ 竞赛编辑器</h1>
        <p>正在初始化...</p>
        <div style={{
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007acc',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <FileProvider>
        <EditorProvider>
          <MainApp />
        </EditorProvider>
      </FileProvider>
    </SettingsProvider>
  );
};

export default App;
