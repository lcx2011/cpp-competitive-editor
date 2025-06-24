import React from 'react';
import { useFile } from '../../contexts/FileContext';
import { useEditor } from '../../contexts/EditorContext';
import './StatusBar.css';

export const StatusBar: React.FC = () => {
  const { activeTab } = useFile();
  const { isCompiling, compileResult } = useEditor();

  const getStatusText = () => {
    if (isCompiling) {
      return '正在编译...';
    }
    
    if (compileResult) {
      if (compileResult.success) {
        if (compileResult.executionTime !== undefined) {
          return `运行成功 (${compileResult.executionTime}ms)`;
        }
        return '编译成功';
      } else {
        return '编译失败';
      }
    }
    
    return '就绪';
  };

  const getStatusClass = () => {
    if (isCompiling) {
      return 'status-compiling';
    }
    
    if (compileResult) {
      return compileResult.success ? 'status-success' : 'status-error';
    }
    
    return 'status-ready';
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <div className={`status-indicator ${getStatusClass()}`}>
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        {activeTab && (
          <div className="status-file">
            <span className="status-filename">{activeTab.name}</span>
            {activeTab.isDirty && (
              <span className="status-modified">● 未保存</span>
            )}
          </div>
        )}
      </div>
      
      <div className="status-right">
        <div className="status-info">
          <span className="status-language">C++</span>
          <span className="status-encoding">UTF-8</span>
          <span className="status-eol">CRLF</span>
        </div>
      </div>
    </div>
  );
};
