import React, { useRef, useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface SimpleCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SimpleCodeEditor: React.FC<SimpleCodeEditorProps> = ({ value, onChange }) => {
  const { settings } = useSettings();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  // 更新行号
  useEffect(() => {
    const lines = value.split('\n');
    const numbers = lines.map((_, index) => (index + 1).toString());
    setLineNumbers(numbers);
  }, [value]);

  // 处理Tab键缩进
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const tabString = ' '.repeat(settings.tabSize);
      const newValue = value.substring(0, start) + tabString + value.substring(end);
      onChange(newValue);

      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + settings.tabSize;
      }, 0);
    }
  };

  // 自动匹配括号
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    // 检查是否输入了开括号
    const lastChar = newValue[cursorPos - 1];
    if (lastChar === '(' || lastChar === '{' || lastChar === '[') {
      const closeChar = lastChar === '(' ? ')' : lastChar === '{' ? '}' : ']';
      const valueWithClose = newValue.substring(0, cursorPos) + closeChar + newValue.substring(cursorPos);
      onChange(valueWithClose);
      
      // 设置光标位置在括号中间
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPos;
        }
      }, 0);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: settings.theme === 'dark' ? '#1e1e1e' : '#ffffff',
      fontFamily: settings.fontFamily,
      fontSize: `${settings.fontSize}px`
    }}>
      {/* 行号区域 */}
      <div style={{
        width: '50px',
        background: '#252526',
        borderRight: '1px solid #3e3e42',
        padding: '12px 8px',
        textAlign: 'right',
        color: '#858585',
        fontSize: '13px',
        lineHeight: '1.4',
        userSelect: 'none',
        overflow: 'hidden'
      }}>
        {lineNumbers.map((num, index) => (
          <div key={index} style={{ height: '19.6px' }}>
            {num}
          </div>
        ))}
      </div>
      
      {/* 编辑器区域 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '100%',
            background: '#1e1e1e',
            color: '#d4d4d4',
            border: 'none',
            outline: 'none',
            padding: '12px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: '1.4',
            resize: 'none',
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            tabSize: 4
          }}
          placeholder="在此编写C++代码..."
          spellCheck={false}
        />
        
        {/* 简单的语法高亮覆盖层 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px',
          pointerEvents: 'none',
          color: 'transparent',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: '1.4',
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          overflow: 'hidden'
        }}>
          {/* 这里可以添加简单的语法高亮 */}
          {value.split('\n').map((line, index) => (
            <div key={index} style={{ height: '19.6px' }}>
              {highlightSyntax(line)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 简单的C++语法高亮函数
const highlightSyntax = (line: string) => {
  // C++关键字
  const keywords = [
    'int', 'char', 'float', 'double', 'bool', 'void', 'string',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
    'return', 'break', 'continue', 'class', 'struct', 'public', 'private',
    'protected', 'namespace', 'using', 'include', 'define', 'const',
    'static', 'virtual', 'override', 'auto', 'long', 'short', 'unsigned'
  ];
  
  let highlightedLine = line;
  
  // 高亮关键字
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlightedLine = highlightedLine.replace(regex, 
      `<span style="color: #569CD6">${keyword}</span>`
    );
  });
  
  // 高亮字符串
  highlightedLine = highlightedLine.replace(/"[^"]*"/g, 
    '<span style="color: #CE9178">$&</span>'
  );
  
  // 高亮注释
  highlightedLine = highlightedLine.replace(/\/\/.*$/g, 
    '<span style="color: #6A9955">$&</span>'
  );
  
  // 高亮数字
  highlightedLine = highlightedLine.replace(/\b\d+\b/g, 
    '<span style="color: #B5CEA8">$&</span>'
  );
  
  return <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
};

export default SimpleCodeEditor;
