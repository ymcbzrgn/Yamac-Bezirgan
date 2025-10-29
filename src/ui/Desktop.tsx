/**
 * DESKTOP-ONLY Component
 *
 * Main desktop view with draggable icons and windows.
 * This component is never rendered on mobile (<768px) - see MobileOS instead.
 *
 * Features:
 * - Draggable desktop icons
 * - Window management (drag, resize, minimize, maximize, z-index)
 * - Taskbar with window list
 * - Right-click context menus
 */

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  useVFSActions,
  useVFSNodesByParent,
  useVFSNodes,
  useWindows,
  useWindowActions,
  useFocusedWindow,
  useStore,
  useContextMenu,
  useDesktopActions,
} from '@os/store';
import type { VFSNode } from '@os/types';
import { getUniqueFolderName, getUniqueTextFileName } from '@os/utils/naming';
import Window from './Window';
import Taskbar from './Taskbar';
import DesktopIcon from './DesktopIcon';
import ContextMenu, { type MenuItem } from './ContextMenu';
import './Desktop.css';

export default function Desktop() {
  const { loadVFS, createNode } = useVFSActions();
  const desktopNodes = useVFSNodesByParent('root');
  const allNodes = useVFSNodes();
  const windows = useWindows();
  const focusedWindow = useFocusedWindow();
  const contextMenu = useContextMenu();
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
    showContextMenu,
    hideContextMenu,
  } = useDesktopActions();
  const { moveNode } = useVFSActions();

  // Load VFS on mount
  useEffect(() => {
    loadVFS();
  }, [loadVFS]);

  // Listen for postMessage from iframe (e.g., legacy site opening new windows)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OPEN_WINDOW') {
        const { appId, url, title } = event.data;
        openWindow({
          id: uuidv4(),
          appId: appId || 'browser',
          title: title || 'Browser',
          icon: '🌐',
          bounds: {
            x: (window.innerWidth - 900) / 2,
            y: (window.innerHeight - 700) / 2,
            width: 900,
            height: 700,
          },
          state: 'normal',
          createdAt: Date.now(),
          meta: { url },
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [openWindow]);

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

    // IMPORTANT: Check special folders BEFORE generic folder check!
    if (node.id === 'projects') {
      // Projects folder → GitHub Projects viewer (not file-explorer!)
      appId = 'github-projects';
    } else if (node.type === 'folder') {
      // Other folders → File Explorer
      appId = 'file-explorer';
    } else if (node.type === 'file' && node.mimeType === 'application/pdf') {
      appId = 'pdf-viewer';
      meta.fileUrl = node.targetUrl || '';
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

  // Desktop context menu
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      showContextMenu(null, e.clientX, e.clientY);
    }
  };

  // Desktop drop handlers (for moving items back to desktop from folders)
  const handleDesktopDragOver = (e: React.DragEvent) => {
    // Only handle if dropping on empty space (not on an icon)
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;

    if (e.dataTransfer.types.includes('application/vnd.desktop-node')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDesktopDrop = async (e: React.DragEvent) => {
    // Only handle if dropping on empty space (not on an icon)
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;

    e.preventDefault();

    const draggedNodeId = e.dataTransfer.getData('application/vnd.desktop-node');
    if (!draggedNodeId) return;

    const draggedNode = allNodes[draggedNodeId];
    if (!draggedNode) return;

    // If node is not already on desktop root, move it there
    if (draggedNode.parentId !== 'root') {
      try {
        await moveNode(draggedNodeId, 'root');
        // Initialize desktop position for the moved node
        initializeIconPosition(draggedNodeId, draggedNode.type as any);
      } catch (error) {
        console.error('Failed to move node to desktop:', error);
        alert('Failed to move item to desktop');
      }
    }
  };

  // Context menu handlers
  const handleNewFolder = async () => {
    const name = getUniqueFolderName('root', allNodes);
    const newFolder: VFSNode = {
      id: uuidv4(),
      type: 'folder',
      name,
      parentId: 'root',
      icon: '📁',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    await createNode(newFolder);
    hideContextMenu();
  };

  const handleNewTextFile = async () => {
    const name = getUniqueTextFileName('root', allNodes);
    const newFile: VFSNode = {
      id: uuidv4(),
      type: 'file',
      name,
      parentId: 'root',
      icon: '📄',
      mimeType: 'text/plain',
      size: 0,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    await createNode(newFile);
    hideContextMenu();
  };

  // Build context menu items
  const getDesktopMenuItems = (): MenuItem[] => {
    return [
      {
        id: 'new-folder',
        label: 'New Folder',
        icon: '📁',
        onClick: handleNewFolder,
      },
      {
        id: 'new-text',
        label: 'New Text File',
        icon: '📄',
        onClick: handleNewTextFile,
      },
    ];
  };

  // Get icon position (temp drag position or layout position)
  const getIconPosition = (nodeId: string) => {
    if (tempDragPosition && tempDragPosition.nodeId === nodeId) {
      return { x: tempDragPosition.x, y: tempDragPosition.y };
    }
    return layout[nodeId] || { x: 0, y: 0 };
  };

  return (
    <div
      className="desktop-container"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      onDragOver={handleDesktopDragOver}
      onDrop={handleDesktopDrop}
    >
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

      {/* Context Menu */}
      {contextMenu && contextMenu.targetNodeId === null && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getDesktopMenuItems()}
          onClose={hideContextMenu}
        />
      )}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
