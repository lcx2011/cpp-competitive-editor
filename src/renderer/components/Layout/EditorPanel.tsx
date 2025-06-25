import React, { useEffect, useState } from 'react';
import SimpleCodeEditor from '../Editor/SimpleCodeEditor';
import { useFile } from '../../contexts/FileContext';
import { useEditor } from '../../contexts/EditorContext';
import { TemplateSelector } from '../Templates/TemplateSelector';
import { WelcomeScreen } from '../Welcome/WelcomeScreen';
import { CodeTemplate } from '../../data/templates';
import './EditorPanel.css';

export const EditorPanel: React.FC = () => {
  const { activeTab, updateTabContent, createNewTab, openFile } = useFile();
  const { setCode, compileAndRun, compileOnly, isCompiling } = useEditor();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleEditorChange = (value: string) => {
    if (activeTab) {
      updateTabContent(activeTab.id, value);
      setCode(value);
    }
  };

  // Sync editor code with active tab
  useEffect(() => {
    if (activeTab) {
      setCode(activeTab.content);
    }
  }, [activeTab, setCode]);

  const handleTemplateSelect = (template: CodeTemplate) => {
    if (activeTab) {
      updateTabContent(activeTab.id, template.code);
    }
  };

  if (!activeTab) {
    return (
      <div className="editor-panel">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <div className="editor-info">
          <span className="editor-filename">{activeTab.name}</span>
          {activeTab.path && (
            <span className="editor-filepath">{activeTab.path}</span>
          )}
        </div>
        
        <div className="editor-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowTemplateSelector(true)}
            title="选择代码模板"
          >
            📋 模板
          </button>
        </div>
      </div>
      
      <div className="editor-container">
        <SimpleCodeEditor
          value={activeTab.content}
          onChange={handleEditorChange}
        />
      </div>

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};
