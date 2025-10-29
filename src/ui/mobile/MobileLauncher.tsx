/**
 * Mobile Launcher Component
 * iOS/Android style app launcher with:
 * - Search bar at top
 * - App grid (3 columns, scrollable)
 * - Dock at bottom (4 fixed apps)
 * - Framer Motion animations
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVFSNodes } from '../../os/store';
import { getIconDisplay } from '../../os/utils/iconMap';
import type { VFSNode } from '../../os/types';
import StatusBar from './StatusBar';
import './MobileLauncher.css';

interface MobileLauncherProps {
  onAppOpen: (node: VFSNode) => void;
}

export default function MobileLauncher({ onAppOpen }: MobileLauncherProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const vfsNodesRecord = useVFSNodes();
  const vfsNodes = Object.values(vfsNodesRecord);

  // Get root nodes (desktop items)
  const rootNodes = useMemo(() => {
    return vfsNodes.filter(
      (node) => node.parentId === 'root' && !node.hidden && node.id !== 'root'
    );
  }, [vfsNodes]);

  // Filter nodes by search query
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return rootNodes;

    const query = searchQuery.toLowerCase();
    return rootNodes.filter((node) =>
      node.name.toLowerCase().includes(query)
    );
  }, [rootNodes, searchQuery]);

  // Dock apps (first 4 apps or specific IDs)
  const dockApps = useMemo(() => {
    // Prioritize: Home, Terminal, Settings, Projects
    const priorityIds = ['home', 'terminal-app', 'settings-app', 'projects'];
    const dockItems: VFSNode[] = [];

    priorityIds.forEach((id) => {
      const node = rootNodes.find((n) => n.id === id);
      if (node) dockItems.push(node);
    });

    // Fill remaining slots with other apps
    const remaining = rootNodes
      .filter((n) => !priorityIds.includes(n.id))
      .slice(0, 4 - dockItems.length);

    return [...dockItems, ...remaining].slice(0, 4);
  }, [rootNodes]);

  // Grid apps (all except dock apps)
  const gridApps = useMemo(() => {
    const dockIds = dockApps.map((app) => app.id);
    return filteredNodes.filter((node) => !dockIds.includes(node.id));
  }, [filteredNodes, dockApps]);

  const handleAppClick = (node: VFSNode) => {
    console.log('[MobileLauncher] 🖱️ App clicked', {
      nodeName: node.name,
      nodeId: node.id,
      nodeType: node.type,
      timestamp: new Date().toISOString(),
    });
    onAppOpen(node);
    console.log('[MobileLauncher] ✅ onAppOpen callback called');
  };

  return (
    <motion.div
      className="mobile-launcher"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <StatusBar />

      {/* Search Bar */}
      <div className="mobile-launcher__search">
        <input
          type="text"
          placeholder="Search Apps"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mobile-launcher__search-input"
        />
      </div>

      {/* App Grid */}
      <div className="mobile-launcher__grid">
        {gridApps.map((node, index) => (
          <motion.button
            key={node.id}
            className="mobile-launcher__app"
            onClick={() => handleAppClick(node)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.03,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="mobile-launcher__app-icon">
              {getIconDisplay(node.icon)}
            </div>
            <div className="mobile-launcher__app-name">{node.name}</div>
          </motion.button>
        ))}

        {/* Empty state */}
        {gridApps.length === 0 && (
          <div className="mobile-launcher__empty">
            <p>No apps found</p>
          </div>
        )}
      </div>

      {/* Dock */}
      <div className="mobile-launcher__dock">
        {dockApps.map((node) => (
          <motion.button
            key={node.id}
            className="mobile-launcher__dock-app"
            onClick={() => handleAppClick(node)}
            whileTap={{ scale: 0.9 }}
          >
            <div className="mobile-launcher__dock-icon">
              {getIconDisplay(node.icon)}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
