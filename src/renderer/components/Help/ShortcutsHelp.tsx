import React from 'react';
import { createShortcutKey, SHORTCUTS } from '../../hooks/useKeyboardShortcuts';
import './ShortcutsHelp.css';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: '文件操作',
      shortcuts: [
        { key: createShortcutKey('N', { ctrl: true }), description: '新建文件' },
        { key: createShortcutKey('O', { ctrl: true }), description: '打开文件' },
        { key: createShortcutKey('S', { ctrl: true }), description: '保存文件' },
        { key: createShortcutKey('S', { ctrl: true, shift: true }), description: '另存为' },
        { key: createShortcutKey('W', { ctrl: true }), description: '关闭标签页' }
      ]
    },
    {
      title: '编译运行',
      shortcuts: [
        { key: 'F5', description: '编译并运行' },
        { key: createShortcutKey('F5', { ctrl: true }), description: '仅编译' }
      ]
    },
    {
      title: '编辑操作',
      shortcuts: [
        { key: createShortcutKey('Z', { ctrl: true }), description: '撤销' },
        { key: createShortcutKey('Y', { ctrl: true }), description: '重做' },
        { key: createShortcutKey('C', { ctrl: true }), description: '复制' },
        { key: createShortcutKey('X', { ctrl: true }), description: '剪切' },
        { key: createShortcutKey('V', { ctrl: true }), description: '粘贴' },
        { key: createShortcutKey('A', { ctrl: true }), description: '全选' },
        { key: createShortcutKey('/', { ctrl: true }), description: '切换注释' }
      ]
    },
    {
      title: '查找替换',
      shortcuts: [
        { key: createShortcutKey('F', { ctrl: true }), description: '查找' },
        { key: createShortcutKey('H', { ctrl: true }), description: '替换' }
      ]
    },
    {
      title: '代码编辑',
      shortcuts: [
        { key: 'Tab', description: '增加缩进' },
        { key: createShortcutKey('Tab', { shift: true }), description: '减少缩进' },
        { key: createShortcutKey('D', { ctrl: true }), description: '复制当前行' },
        { key: createShortcutKey('K', { ctrl: true, shift: true }), description: '删除当前行' },
        { key: createShortcutKey('↑', { alt: true }), description: '向上移动行' },
        { key: createShortcutKey('↓', { alt: true }), description: '向下移动行' }
      ]
    },
    {
      title: '视图操作',
      shortcuts: [
        { key: createShortcutKey('=', { ctrl: true }), description: '放大' },
        { key: createShortcutKey('-', { ctrl: true }), description: '缩小' },
        { key: createShortcutKey('0', { ctrl: true }), description: '重置缩放' }
      ]
    }
  ];

  return (
    <div className="shortcuts-overlay">
      <div className="shortcuts-modal">
        <div className="shortcuts-header">
          <h3>快捷键帮助</h3>
          <button className="shortcuts-close" onClick={onClose}>×</button>
        </div>
        
        <div className="shortcuts-content">
          {shortcutGroups.map((group, index) => (
            <div key={index} className="shortcuts-group">
              <h4 className="shortcuts-group-title">{group.title}</h4>
              <div className="shortcuts-list">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div key={shortcutIndex} className="shortcut-item">
                    <kbd className="shortcut-key">{shortcut.key}</kbd>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          <button className="btn" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
