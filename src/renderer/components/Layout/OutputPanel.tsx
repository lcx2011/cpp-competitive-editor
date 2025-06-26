import React, { useState } from 'react';
import { useEditor, TestCase } from '../../contexts/EditorContext';
import './OutputPanel.css';

export const OutputPanel: React.FC = () => {
  const { compileResult, isCompiling, compileAndRun, compileOnly, clearOutput } = useEditor();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'input' | 'testcases'>('output');
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, name: '测试用例 1', input: '', expectedOutput: '', active: true }
  ]);
  const [activeTestCase, setActiveTestCase] = useState(1);

  const handleRun = () => {
    const currentInput = activeTab === 'testcases'
      ? testCases.find(tc => tc.id === activeTestCase)?.input || ''
      : input;

    // 如果有测试用例，总是传递所有测试用例进行批量测试
    if (testCases.length > 0 && testCases.some(tc => tc.input.trim() || tc.expectedOutput.trim())) {
      compileAndRun(currentInput, testCases);
    } else {
      compileAndRun(currentInput);
    }
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

  const addTestCase = () => {
    const newId = Math.max(...testCases.map(tc => tc.id)) + 1;
    const newTestCase = {
      id: newId,
      name: `测试用例 ${newId}`,
      input: '',
      expectedOutput: '',
      active: true
    };
    setTestCases([...testCases, newTestCase]);
    setActiveTestCase(newId);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      const newTestCases = testCases.filter(tc => tc.id !== id);
      setTestCases(newTestCases);
      if (activeTestCase === id) {
        setActiveTestCase(newTestCases[0].id);
      }
    }
  };

  const updateTestCase = (id: number, field: 'input' | 'expectedOutput' | 'name', value: string) => {
    setTestCases(testCases.map(tc =>
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
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
          <button
            className={`output-tab ${activeTab === 'testcases' ? 'active' : ''}`}
            onClick={() => setActiveTab('testcases')}
          >
            测试用例
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
        ) : activeTab === 'input' ? (
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
        ) : (
          <div className="testcases-area">
            <div className="testcases-header">
              <div className="testcases-tabs">
                {testCases.map(testCase => (
                  <div
                    key={testCase.id}
                    className={`testcase-tab ${activeTestCase === testCase.id ? 'active' : ''}`}
                    onClick={() => setActiveTestCase(testCase.id)}
                  >
                    <input
                      className="testcase-name-input"
                      value={testCase.name}
                      onChange={(e) => updateTestCase(testCase.id, 'name', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {testCases.length > 1 && (
                      <button
                        className="testcase-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTestCase(testCase.id);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button className="testcase-add" onClick={addTestCase}>+</button>
              </div>
            </div>

            <div className="testcase-content">
              {testCases.filter(tc => tc.id === activeTestCase).map(testCase => (
                <div key={testCase.id} className="testcase-editor">
                  <div className="testcase-section">
                    <label className="testcase-label">输入数据:</label>
                    <textarea
                      className="testcase-textarea"
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                      placeholder="输入测试数据..."
                      spellCheck={false}
                    />
                  </div>
                  <div className="testcase-section">
                    <label className="testcase-label">期望输出:</label>
                    <textarea
                      className="testcase-textarea"
                      value={testCase.expectedOutput}
                      onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                      placeholder="输入期望的输出结果..."
                      spellCheck={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
