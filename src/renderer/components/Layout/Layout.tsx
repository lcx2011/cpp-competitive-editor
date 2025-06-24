import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { EditorPanel } from './EditorPanel';
import { OutputPanel } from './OutputPanel';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';
import './Layout.css';

export const Layout: React.FC = () => {
  return (
    <div className="layout">
      <div className="layout-header">
        <TabBar />
      </div>
      
      <div className="layout-content">
        <Allotment vertical>
          <Allotment.Pane minSize={300}>
            <EditorPanel />
          </Allotment.Pane>
          
          <Allotment.Pane minSize={150} preferredSize={250}>
            <OutputPanel />
          </Allotment.Pane>
        </Allotment>
      </div>
      
      <div className="layout-footer">
        <StatusBar />
      </div>
    </div>
  );
};
