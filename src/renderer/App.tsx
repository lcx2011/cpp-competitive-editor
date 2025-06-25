import React, { useState, useEffect } from 'react';
import { FileProvider } from './contexts/FileContext';
import { EditorProvider } from './contexts/EditorContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppWithShortcuts } from './components/AppWithShortcuts';
import { Layout } from './components/Layout/Layout';

console.log('App.tsx loaded successfully');

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
          <AppWithShortcuts>
            <Layout />
          </AppWithShortcuts>
        </EditorProvider>
      </FileProvider>
    </SettingsProvider>
  );
};

export default App;
