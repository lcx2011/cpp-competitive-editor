import React from 'react';
import { useFile } from '../../contexts/FileContext';
import { cppTemplates } from '../../data/templates';
import './WelcomeScreen.css';

export const WelcomeScreen: React.FC = () => {
  const { createNewTab, openFile, updateTabContent, activeTab } = useFile();

  const handleCreateFromTemplate = (templateId: string) => {
    const template = cppTemplates.find(t => t.id === templateId);
    if (template) {
      createNewTab();
      // Wait for the tab to be created, then update its content
      setTimeout(() => {
        const tabs = document.querySelectorAll('.tab');
        const lastTab = tabs[tabs.length - 1] as HTMLElement;
        if (lastTab) {
          lastTab.click();
          setTimeout(() => {
            if (activeTab) {
              updateTabContent(activeTab.id, template.code);
            }
          }, 100);
        }
      }, 100);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="welcome-logo">
            <div className="logo-icon">⚡</div>
            <h1>C++ 竞赛编辑器</h1>
          </div>
          <p className="welcome-subtitle">专为信息竞赛设计的高效代码编辑器</p>
        </div>

        <div className="welcome-sections">
          <div className="welcome-section">
            <h3>🚀 快速开始</h3>
            <div className="welcome-actions">
              <button className="welcome-btn primary" onClick={createNewTab}>
                <span className="btn-icon">📄</span>
                新建文件
              </button>
              <button className="welcome-btn" onClick={openFile}>
                <span className="btn-icon">📁</span>
                打开文件
              </button>
            </div>
          </div>

          <div className="welcome-section">
            <h3>📋 代码模板</h3>
            <div className="template-grid">
              {cppTemplates.slice(0, 4).map(template => (
                <button
                  key={template.id}
                  className="template-card"
                  onClick={() => handleCreateFromTemplate(template.id)}
                >
                  <div className="template-card-name">{template.name}</div>
                  <div className="template-card-desc">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="welcome-section">
            <h3>⚡ 功能特性</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <strong>专为竞赛设计</strong>
                  <span>内置竞赛常用模板和工具</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>快速编译运行</strong>
                  <span>一键编译运行，实时查看结果</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💻</div>
                <div className="feature-text">
                  <strong>专业编辑器</strong>
                  <span>基于Monaco Editor的强大编辑体验</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔧</div>
                <div className="feature-text">
                  <strong>智能提示</strong>
                  <span>代码补全和语法高亮</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <div className="welcome-tips">
            <h4>💡 快捷键提示</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <kbd>Ctrl+N</kbd> 新建文件
              </div>
              <div className="tip-item">
                <kbd>Ctrl+O</kbd> 打开文件
              </div>
              <div className="tip-item">
                <kbd>F5</kbd> 编译运行
              </div>
              <div className="tip-item">
                <kbd>Ctrl+S</kbd> 保存文件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
