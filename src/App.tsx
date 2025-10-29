/**
 * Root Application Component
 * Ubuntu×XP Desktop Portfolio with Adaptive Mobile OS
 * Detects device type and renders appropriate UI:
 * - Mobile (< 768px): MobileOS (launcher, fullscreen apps, gestures)
 * - Desktop (>= 768px): Desktop (windows, taskbar, wallpaper)
 */

import { useEffect } from 'react';
import './App.css';
import Desktop from './ui/Desktop';
import MobileOS from './ui/mobile/MobileOS';
import { useIsMobile } from './os/hooks/useDeviceType';
import { useThemeManager } from './os/hooks/useThemeManager';

function App() {
  const isMobile = useIsMobile();

  // Apply theme CSS variables
  useThemeManager();

  // Prevent browser's default right-click context menu globally
  // This allows the OS simulation to handle right-clicks internally (e.g., Minesweeper flags)
  // Works across all browsers: Chrome, Firefox, Safari, Edge, Opera, IE9+
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false; // Extra safety for legacy browsers
    };

    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <div className="app">
      {/* Adaptive UI: Mobile OS or Desktop OS */}
      {isMobile ? <MobileOS /> : <Desktop />}
    </div>
  );
}

export default App;
