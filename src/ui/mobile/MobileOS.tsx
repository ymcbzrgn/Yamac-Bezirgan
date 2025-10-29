/**
 * Mobile OS Main Component
 * Orchestrates mobile UI experience:
 * - App Launcher (home screen)
 * - Fullscreen Apps (with MobileAppShell)
 * - App Switcher (multitasking)
 * - State management for mobile navigation
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useVFSActions, useVFSNodes } from '../../os/store';
import type { VFSNode } from '../../os/types';
import type { MobileOpenAppDetail } from '../../os/hooks/useAppOpener';
import MobileLauncher from './MobileLauncher';
import MobileAppShell from './MobileAppShell';
import MobileAppSwitcher from './MobileAppSwitcher';
import AppLoader from '../../apps/appLoader';
import './MobileOS.css';

type MobileView = 'launcher' | 'app' | 'switcher';

interface OpenApp {
  id: string;
  node: VFSNode;
  windowId: string;
  appId: string;
}

export default function MobileOS() {
  const [currentView, setCurrentView] = useState<MobileView>('launcher');
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const { loadVFS } = useVFSActions();
  const vfsNodes = useVFSNodes();

  // Load VFS on mount (same as Desktop.tsx for feature parity)
  useEffect(() => {
    loadVFS();
  }, [loadVFS]);

  // Get active app
  const activeApp = openApps.find((app) => app.id === activeAppId);

  // Open app from launcher
  const handleAppOpen = useCallback((node: VFSNode) => {
    // Check if app already open
    const existingApp = openApps.find((app) => app.node.id === node.id);
    if (existingApp) {
      // Focus existing app
      setActiveAppId(existingApp.id);
      setCurrentView('app');
      return;
    }

    // External links: Open directly in new tab
    if (node.type === 'link' && node.targetUrl) {
      const url = node.targetUrl;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    // Create new app instance
    const windowId = `mobile-${node.id}-${Date.now()}`;

    // Determine app ID (same logic as Desktop.tsx for feature parity)
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
    } else if (node.type === 'file' && node.mimeType === 'text/plain') {
      appId = 'text-viewer';
    } else if (node.type === 'file' && node.mimeType === 'text/markdown') {
      appId = 'markdown-viewer';
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

    // Add to open apps
    const newApp: OpenApp = {
      id: windowId,
      node,
      windowId,
      appId, // Store calculated appId
    };

    setOpenApps([...openApps, newApp]);
    setActiveAppId(windowId);
    setCurrentView('app');
  }, [openApps, setOpenApps, setActiveAppId, setCurrentView]);

  // Close app
  const handleAppClose = (appId: string) => {
    setOpenApps(openApps.filter((a) => a.id !== appId));

    // If closing active app, return to launcher
    if (appId === activeAppId) {
      setActiveAppId(null);
      setCurrentView('launcher');
    }
  };

  // Focus app (from switcher)
  const handleAppFocus = (appId: string) => {
    setActiveAppId(appId);
    setCurrentView('app');
  };

  // Close all apps
  const handleCloseAll = () => {
    setOpenApps([]);
    setActiveAppId(null);
    setCurrentView('launcher');
  };

  // Show app switcher (swipe up from bottom)
  const handleShowSwitcher = () => {
    setCurrentView('switcher');
  };

  // Dismiss app switcher
  const handleDismissSwitcher = () => {
    setCurrentView(activeAppId ? 'app' : 'launcher');
  };

  // Handle app shell close (back to launcher)
  const handleAppShellClose = () => {
    setCurrentView('launcher');
  };

  // Listen for mobile:openApp events (from FileExplorer, etc.)
  useEffect(() => {
    const handleMobileOpenApp = (event: Event) => {
      const customEvent = event as CustomEvent<MobileOpenAppDetail>;
      const { nodeId } = customEvent.detail;

      // Get node from VFS
      const node = nodeId ? vfsNodes[nodeId] : null;
      if (!node) {
        console.error('[MobileOS] Cannot open app: node not found', nodeId);
        return;
      }

      // Use existing handleAppOpen logic
      handleAppOpen(node);
    };

    window.addEventListener('mobile:openApp', handleMobileOpenApp);
    return () => {
      window.removeEventListener('mobile:openApp', handleMobileOpenApp);
    };
  }, [vfsNodes, handleAppOpen]);

  return (
    <div className="mobile-os">
      <AnimatePresence mode="wait">
        {/* Launcher */}
        {currentView === 'launcher' && (
          <MobileLauncher
            key="launcher"
            onAppOpen={handleAppOpen}
          />
        )}

        {/* Active App */}
        {currentView === 'app' && activeApp && (
          <MobileAppShell
            key={`app-${activeApp.id}`}
            onClose={handleAppShellClose}
            appTitle={activeApp.node.name}
          >
            <AppLoader
              appId={activeApp.appId}
              windowId={activeApp.windowId}
              nodeId={activeApp.node.id}
              {...(activeApp.appId === 'pdf-viewer'
                ? { fileUrl: activeApp.node.targetUrl || '' }
                : {})}
            />
          </MobileAppShell>
        )}

        {/* App Switcher */}
        {currentView === 'switcher' && (
          <MobileAppSwitcher
            key="switcher"
            openApps={openApps}
            onAppFocus={handleAppFocus}
            onAppClose={handleAppClose}
            onCloseAll={handleCloseAll}
            onDismiss={handleDismissSwitcher}
          />
        )}
      </AnimatePresence>

      {/* Swipe-up gesture trigger (invisible) */}
      {currentView !== 'switcher' && (
        <div
          className="mobile-os__switcher-trigger"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (touch.clientY > window.innerHeight - 20) {
              // Swipe started from bottom edge
              handleShowSwitcher();
            }
          }}
        />
      )}
    </div>
  );
}
