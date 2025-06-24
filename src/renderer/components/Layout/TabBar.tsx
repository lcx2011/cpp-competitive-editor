import React from 'react';
import { useFile } from '../../contexts/FileContext';
import './TabBar.css';

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, createNewTab } = useFile();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleNewTab = () => {
    createNewTab();
  };

  return (
    <div className="tab-bar">
      <div className="tab-list">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-name">
              {tab.name}
              {tab.isDirty && <span className="tab-dirty">●</span>}
            </span>
            <button
              className="tab-close"
              onClick={(e) => handleTabClose(e, tab.id)}
              title="关闭"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="tab-actions">
        <button
          className="tab-new-btn"
          onClick={handleNewTab}
          title="新建文件 (Ctrl+N)"
        >
          +
        </button>
      </div>
    </div>
  );
};
