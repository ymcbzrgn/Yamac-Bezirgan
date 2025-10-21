/**
 * Desktop Component
 * Main desktop view with draggable icons and windows
 */

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  useVFSActions,
  useVFSNodesByParent,
  useWindows,
  useWindowActions,
  useFocusedWindow,
  useStore,
} from '@os/store';
import type { VFSNode } from '@os/types';
import Window from './Window';
import Taskbar from './Taskbar';
import DesktopIcon from './DesktopIcon';
import './Desktop.css';

export default function Desktop() {
  const { loadVFS } = useVFSActions();
  const desktopNodes = useVFSNodesByParent('root');
  const windows = useWindows();
  const focusedWindow = useFocusedWindow();
  const {
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowBounds,
  } = useWindowActions();

  // Desktop icon state
  const layout = useStore((state) => state.layout);
  const selectedIconIds = useStore((state) => state.selectedIconIds);
  const tempDragPosition = useStore((state) => state.tempDragPosition);
  const {
    initializeIconPosition,
    updateTempDragPosition,
    snapToGrid,
    selectIcon,
    clearSelection,
  } = useStore((state) => ({
    initializeIconPosition: state.initializeIconPosition,
    updateTempDragPosition: state.updateTempDragPosition,
    snapToGrid: state.snapToGrid,
    selectIcon: state.selectIcon,
    clearSelection: state.clearSelection,
  }));

  // Load VFS on mount
  useEffect(() => {
    loadVFS();
  }, [loadVFS]);

  // Initialize icon positions for desktop nodes
  useEffect(() => {
    desktopNodes.forEach((node) => {
      if (!layout[node.id]) {
        initializeIconPosition(node.id, node.type);
      }
    });
  }, [desktopNodes, layout, initializeIconPosition]);

  // Icon drag handlers
  const handleIconDragStart = (nodeId: string) => {
    // Optional: visual feedback
  };

  const handleIconDragMove = (nodeId: string, x: number, y: number) => {
    updateTempDragPosition(nodeId, x, y);
  };

  const handleIconDragEnd = (nodeId: string) => {
    snapToGrid(nodeId);
  };

  // Open window for icon
  const handleIconDoubleClick = (node: VFSNode) => {
    // External links: Open directly in new tab
    if (node.type === 'link' && node.targetUrl) {
      const url = node.targetUrl;
      // Check if external URL (starts with http/https)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    const windowWidth = 600;
    const windowHeight = 400;
    const x = (window.innerWidth - windowWidth) / 2;
    const y = (window.innerHeight - 48 - windowHeight) / 2;

    // Determine app ID
    let appId = 'placeholder';
    let meta: Record<string, any> = {};

    if (node.type === 'file' && node.mimeType === 'application/pdf') {
      appId = 'pdf-viewer';
    } else if (node.type === 'link') {
      // Internal links (same-origin) → Browser app
      appId = 'browser';
      meta.url = node.targetUrl;
    } else if (node.type === 'app') {
      appId = node.appId || 'placeholder';
    } else if (node.mimeType === 'application/x-legacy-site') {
      // Legacy site easter egg
      appId = 'browser';
      meta.url = node.targetUrl || '/legacy/index.html';
    }

    openWindow({
      id: uuidv4(),
      appId,
      nodeId: node.id,
      title: node.name,
      icon: node.icon || (node.type === 'folder' ? '📁' : '📄'),
      bounds: { x, y, width: windowWidth, height: windowHeight },
      state: 'normal',
      createdAt: Date.now(),
      meta,
    });
  };

  // Click desktop to clear selection
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  // Get icon position (temp drag position or layout position)
  const getIconPosition = (nodeId: string) => {
    if (tempDragPosition && tempDragPosition.nodeId === nodeId) {
      return { x: tempDragPosition.x, y: tempDragPosition.y };
    }
    return layout[nodeId] || { x: 0, y: 0 };
  };

  return (
    <div className="desktop-container" onClick={handleDesktopClick}>
      {/* Wallpaper */}
      <div className="desktop-wallpaper" />

      {/* Icon Grid */}
      <div className="desktop-icons">
        {desktopNodes.map((node) => (
          <DesktopIcon
            key={node.id}
            node={node}
            position={getIconPosition(node.id)}
            isSelected={selectedIconIds.includes(node.id)}
            onDragStart={handleIconDragStart}
            onDragMove={handleIconDragMove}
            onDragEnd={handleIconDragEnd}
            onDoubleClick={handleIconDoubleClick}
            onSelect={selectIcon}
          />
        ))}
      </div>

      {/* Windows Container */}
      <div className="windows-container">
        {windows.map((window) => (
          <Window
            key={window.id}
            window={window}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onRestore={restoreWindow}
            onUpdateBounds={updateWindowBounds}
            isFocused={focusedWindow?.id === window.id}
          />
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
