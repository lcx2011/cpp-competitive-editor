import { useEffect } from 'react';
import { useFile } from '../contexts/FileContext';
import { useEditor } from '../contexts/EditorContext';

export const MenuHandler: React.FC = () => {
  const { createNewTab, openFile, saveFile, saveAsFile } = useFile();
  const { compileAndRun, compileOnly } = useEditor();

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleMenuEvent = (event: string) => {
      switch (event) {
        case 'menu-new-file':
          createNewTab();
          break;
        case 'menu-open-file':
          openFile();
          break;
        case 'menu-save-file':
          saveFile();
          break;
        case 'menu-save-as':
          saveAsFile();
          break;
        case 'menu-compile-run':
          compileAndRun();
          break;
        case 'menu-compile-only':
          compileOnly();
          break;
        case 'menu-about':
          // Show about dialog
          alert('C++ 竞赛编辑器 v1.0.0\n专为信息竞赛设计的代码编辑器');
          break;
        default:
          console.log('Unhandled menu event:', event);
      }
    };

    window.electronAPI.onMenuEvent(handleMenuEvent);

    return () => {
      window.electronAPI.removeAllListeners();
    };
  }, [createNewTab, openFile, saveFile, saveAsFile, compileAndRun, compileOnly]);

  return null; // This component doesn't render anything
};
