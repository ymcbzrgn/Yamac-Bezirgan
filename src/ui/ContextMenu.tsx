/**
 * ContextMenu Component
 * Portal-based context menu with click-outside and escape key handling
 */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ContextMenu.css';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  shortcut?: string;
  submenu?: MenuItem[];
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Add slight delay to prevent immediate close from the triggering click
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Adjust position if menu goes off-screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const adjustedX = x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 10 : x;
      const adjustedY = y + rect.height > window.innerHeight ? window.innerHeight - rect.height - 10 : y;

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [x, y]);

  // Handle submenu hover
  const handleItemMouseEnter = (item: MenuItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.submenu) {
      setHoveredItemId(item.id);
      const rect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.right - 4, // Slight overlap
        y: rect.top,
      });
    } else {
      setHoveredItemId(null);
      setSubmenuPosition(null);
    }
  };

  const handleItemMouseLeave = () => {
    // Delay closing to allow moving to submenu
    setTimeout(() => {
      setHoveredItemId(null);
      setSubmenuPosition(null);
    }, 200);
  };

  return createPortal(
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) =>
        item.divider ? (
          <div key={item.id} className="context-menu__divider" />
        ) : (
          <button
            key={item.id}
            className={`context-menu__item ${item.submenu ? 'context-menu__item--has-submenu' : ''}`}
            disabled={item.disabled}
            onMouseEnter={(e) => handleItemMouseEnter(item, e)}
            onMouseLeave={handleItemMouseLeave}
            onClick={() => {
              if (!item.disabled && !item.submenu) {
                item.onClick();
                onClose();
              }
            }}
          >
            {item.icon && <span className="context-menu__icon">{item.icon}</span>}
            <span className="context-menu__label">{item.label}</span>
            {item.shortcut && <span className="context-menu__shortcut">{item.shortcut}</span>}
            {item.submenu && <span className="context-menu__submenu-arrow">›</span>}
          </button>
        )
      )}

      {/* Render submenu if hovered */}
      {hoveredItemId && submenuPosition && (() => {
        const hoveredItem = items.find(item => item.id === hoveredItemId);
        if (hoveredItem?.submenu) {
          return (
            <ContextMenu
              x={submenuPosition.x}
              y={submenuPosition.y}
              items={hoveredItem.submenu}
              onClose={onClose}
            />
          );
        }
        return null;
      })()}
    </div>,
    document.body
  );
}
