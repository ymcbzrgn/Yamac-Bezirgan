/**
 * Mobile App Shell Component
 * Fullscreen app container with:
 * - Status bar at top
 * - Swipe-down-to-close gesture
 * - App content area (scrollable)
 * - Blur backdrop when closing
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import StatusBar from './StatusBar';
import './MobileAppShell.css';

interface MobileAppShellProps {
  children: React.ReactNode;
  onClose: () => void;
  appTitle?: string;
}

export default function MobileAppShell({
  children,
  onClose,
  appTitle,
}: MobileAppShellProps) {
  const [isClosing, setIsClosing] = useState(false);

  // DEBUG: Log MobileAppShell lifecycle
  useState(() => {
    console.log('[MobileAppShell] 🚀 MOUNTING', {
      appTitle,
      hasChildren: !!children,
      timestamp: new Date().toISOString(),
    });
  });

  useEffect(() => {
    console.log('[MobileAppShell] ✅ MOUNTED', {
      appTitle,
      timestamp: new Date().toISOString(),
    });
    return () => {
      console.log('[MobileAppShell] 💀 UNMOUNTED', {
        appTitle,
        timestamp: new Date().toISOString(),
      });
    };
  }, [appTitle]);

  // Swipe handlers (no drag system, only swipeable)
  const handlers = useSwipeable({
    onSwipedDown: (eventData) => {
      // Close if swipe distance > 100px OR velocity > 0.5
      if (eventData.absY > 100 || eventData.velocity > 0.5) {
        handleClose();
      }
    },
    trackMouse: true, // Enable for desktop testing
  });

  const handleClose = () => {
    console.log('[MobileAppShell] ✖️ X BUTTON CLICKED / handleClose CALLED', {
      appTitle,
      isClosing,
      timestamp: new Date().toISOString(),
    });
    setIsClosing(true);
    setTimeout(() => {
      console.log('[MobileAppShell] ✖️ Calling onClose callback - INSTANT', {
        appTitle,
        timestamp: new Date().toISOString(),
      });
      onClose();
    }, 0); // Instant close (Option A)
  };

  return (
    <motion.div
      className="mobile-app-shell"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <StatusBar />

      {/* Swipe handle indicator */}
      <div className="mobile-app-shell__handle" {...handlers}>
        <div className="mobile-app-shell__handle-bar" />
      </div>

      {/* App Title (optional) */}
      {appTitle && (
        <div className="mobile-app-shell__header">
          <h1 className="mobile-app-shell__title">{appTitle}</h1>
          <button
            className="mobile-app-shell__close-btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('[MobileAppShell] ✖️ X BUTTON CLICKED', {
                appTitle,
                timestamp: new Date().toISOString(),
              });
              handleClose();
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* App Content */}
      <div className="mobile-app-shell__content">{children}</div>

      {/* Closing backdrop */}
      {isClosing && <div className="mobile-app-shell__backdrop" />}
    </motion.div>
  );
}
