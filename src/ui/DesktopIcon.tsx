/**
 * DesktopIcon - Draggable icon on desktop grid
 * Ubuntu×XP Desktop Portfolio
 */

import { useState, useEffect, useRef } from 'react';
import type { VFSNode } from '@os/types';
import './DesktopIcon.css';

interface DesktopIconProps {
  node: VFSNode;
  position: { x: number; y: number };
  isSelected?: boolean;
  onDragStart: (nodeId: string) => void;
  onDragMove: (nodeId: string, x: number, y: number) => void;
  onDragEnd: (nodeId: string) => void;
  onDoubleClick: (node: VFSNode) => void;
  onSelect: (nodeId: string, multi: boolean) => void;
}

export default function DesktopIcon({
  node,
  position,
  isSelected = false,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDoubleClick,
  onSelect,
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);

  // Handle mouse down - start drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection during drag
    e.preventDefault();

    // Check for multi-select (Ctrl/Cmd key)
    const isMulti = e.ctrlKey || e.metaKey;
    onSelect(node.id, isMulti);

    // Calculate drag offset
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    setIsDragging(true);
    onDragStart(node.id);
  };

  // Handle double-click - open window
  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    if (timeSinceLastClick < 300) {
      // Double-click detected
      onDoubleClick(node);
      setLastClickTime(0); // Reset to prevent triple-click
    } else {
      // Single click
      setLastClickTime(now);
    }
  };

  // Mouse move effect
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onDragMove(node.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(node.id);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node.id, onDragMove, onDragEnd]);

  // Get icon emoji/character
  const getIconDisplay = () => {
    // Icon string → emoji mapping
    const iconMap: Record<string, string> = {
      'desktop': '🖥️',
      'folder-home': '🏠',
      'folder-code': '💻',
      'folder-games': '🎮',
      'file-pdf': '📄',
      'link-linkedin': '💼',
      'link-github': '🐙',
      'trash-empty': '🗑️',
      'trash-full': '🗑️',
    };

    if (node.icon && iconMap[node.icon]) {
      return iconMap[node.icon];
    }
    if (node.icon) return node.icon; // If already emoji
    if (node.type === 'folder') return '📁';
    if (node.type === 'file' && node.mimeType === 'application/pdf') return '📄';
    if (node.type === 'link') return '🔗';
    if (node.type === 'app') return '⚙️';
    return '📄';
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isSelected ? 'desktop-icon--selected' : ''} ${isDragging ? 'desktop-icon--dragging' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      tabIndex={0}
    >
      <div className="desktop-icon__image">
        {getIconDisplay()}
      </div>
      <div className="desktop-icon__label">
        {node.name}
      </div>
    </div>
  );
}
