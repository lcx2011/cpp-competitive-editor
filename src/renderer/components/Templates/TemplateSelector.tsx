import React, { useState } from 'react';
import { cppTemplates, CodeTemplate } from '../../data/templates';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CodeTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);

  if (!isOpen) return null;

  const handleTemplateClick = (template: CodeTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <div className="template-overlay">
      <div className="template-modal">
        <div className="template-header">
          <h3>选择代码模板</h3>
          <button className="template-close" onClick={onClose}>×</button>
        </div>
        
        <div className="template-content">
          <div className="template-list">
            {cppTemplates.map(template => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="template-name">{template.name}</div>
                <div className="template-description">{template.description}</div>
              </div>
            ))}
          </div>
          
          <div className="template-preview">
            {selectedTemplate ? (
              <>
                <div className="template-preview-header">
                  <h4>{selectedTemplate.name}</h4>
                  <p>{selectedTemplate.description}</p>
                </div>
                <pre className="template-code">{selectedTemplate.code}</pre>
              </>
            ) : (
              <div className="template-preview-empty">
                选择一个模板查看预览
              </div>
            )}
          </div>
        </div>
        
        <div className="template-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button 
            className="btn" 
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
          >
            使用模板
          </button>
        </div>
      </div>
    </div>
  );
};
