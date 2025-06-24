import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import './OutputPanel.css';

export const OutputPanel: React.FC = () => {
  const { compileResult, isCompiling, compileAndRun, compileOnly, clearOutput } = useEditor();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'input'>('output');

  const handleRun = () => {
    compileAndRun(input);
  };

  const handleCompile = () => {
    compileOnly();
  };

  const handleClear = () => {
    clearOutput();
    if (activeTab === 'input') {
      setInput('');
    }
  };

  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-tabs">
          <button
            className={`output-tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            输出
          </button>
          <button
            className={`output-tab ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            输入
          </button>
        </div>
        
        <div className="output-actions">
          <button
            className="btn btn-small btn-run"
            onClick={handleRun}
            disabled={isCompiling}
            title="编译并运行 (F5)"
          >
            {isCompiling ? '运行中...' : '▶ 运行'}
          </button>
          <button
            className="btn btn-small btn-compile"
            onClick={handleCompile}
            disabled={isCompiling}
            title="仅编译 (Ctrl+F5)"
          >
            🔧 编译
          </button>
          <button
            className="btn btn-small btn-secondary"
            onClick={handleClear}
            title="清空"
          >
            清空
          </button>
        </div>
      </div>
      
      <div className="output-content">
        {activeTab === 'output' ? (
          <div className="output-result">
            {isCompiling ? (
              <div className="output-loading">
                <div className="spinner"></div>
                正在编译运行...
              </div>
            ) : compileResult ? (
              <div className={`output-text ${compileResult.success ? 'success' : 'error'}`}>
                {compileResult.success ? (
                  <>
                    {compileResult.output && (
                      <div className="output-section">
                        <div className="output-label">程序输出:</div>
                        <pre className="output-pre">{compileResult.output}</pre>
                      </div>
                    )}
                    {compileResult.executionTime !== undefined && (
                      <div className="output-section">
                        <div className="output-label">执行时间: {compileResult.executionTime}ms</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="output-section">
                    <div className="output-label error">编译错误:</div>
                    <pre className="output-pre error">{compileResult.error}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="output-placeholder">
                点击"运行"或"编译"按钮查看结果
              </div>
            )}
          </div>
        ) : (
          <div className="input-area">
            <div className="input-header">
              <label className="input-label">程序输入:</label>
              <span className="input-hint">在此输入程序运行时需要的数据</span>
            </div>
            <textarea
              className="input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入测试数据..."
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
