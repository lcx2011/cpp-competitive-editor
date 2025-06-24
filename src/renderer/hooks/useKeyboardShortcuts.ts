import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

// 预定义的快捷键组合
export const createShortcutKey = (
  key: string, 
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
): string => {
  const parts: string[] = [];
  if (modifiers.ctrl) parts.push('Ctrl');
  if (modifiers.shift) parts.push('Shift');
  if (modifiers.alt) parts.push('Alt');
  parts.push(key.toUpperCase());
  return parts.join('+');
};

// 常用快捷键常量
export const SHORTCUTS = {
  NEW_FILE: { key: 'n', ctrl: true },
  OPEN_FILE: { key: 'o', ctrl: true },
  SAVE_FILE: { key: 's', ctrl: true },
  SAVE_AS: { key: 's', ctrl: true, shift: true },
  CLOSE_TAB: { key: 'w', ctrl: true },
  COMPILE_RUN: { key: 'F5' },
  COMPILE_ONLY: { key: 'F5', ctrl: true },
  FIND: { key: 'f', ctrl: true },
  REPLACE: { key: 'h', ctrl: true },
  COMMENT_TOGGLE: { key: '/', ctrl: true },
  DUPLICATE_LINE: { key: 'd', ctrl: true },
  DELETE_LINE: { key: 'k', ctrl: true, shift: true },
  MOVE_LINE_UP: { key: 'ArrowUp', alt: true },
  MOVE_LINE_DOWN: { key: 'ArrowDown', alt: true },
  INDENT: { key: 'Tab' },
  OUTDENT: { key: 'Tab', shift: true },
  SELECT_ALL: { key: 'a', ctrl: true },
  UNDO: { key: 'z', ctrl: true },
  REDO: { key: 'y', ctrl: true },
  COPY: { key: 'c', ctrl: true },
  CUT: { key: 'x', ctrl: true },
  PASTE: { key: 'v', ctrl: true },
  ZOOM_IN: { key: '=', ctrl: true },
  ZOOM_OUT: { key: '-', ctrl: true },
  ZOOM_RESET: { key: '0', ctrl: true }
} as const;
