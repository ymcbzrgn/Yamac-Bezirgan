/**
 * Mobile App Shell Component
 * Fullscreen app container with:
 * - Status bar at top
 * - Swipe-down-to-close gesture
 * - App content area (scrollable)
 * - Blur backdrop when closing
 */

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

  // Motion values for swipe-to-close
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const scale = useTransform(y, [0, 300], [1, 0.9]);

  // Swipe handlers
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
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  return (
    <motion.div
      className="mobile-app-shell"
      style={{ y, opacity, scale }}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 300 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        // Close if dragged down > 150px or velocity > 500
        if (info.offset.y > 150 || info.velocity.y > 500) {
          handleClose();
        } else {
          // Snap back to top
          y.set(0);
        }
      }}
    >
      <StatusBar />

      {/* Drag handle indicator */}
      <div className="mobile-app-shell__handle" {...handlers}>
        <div className="mobile-app-shell__handle-bar" />
      </div>

      {/* App Title (optional) */}
      {appTitle && (
        <div className="mobile-app-shell__header">
          <h1 className="mobile-app-shell__title">{appTitle}</h1>
          <button
            className="mobile-app-shell__close-btn"
            onClick={handleClose}
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
