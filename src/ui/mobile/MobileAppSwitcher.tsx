/**
 * Mobile App Switcher Component
 * iOS-style multitasking view with:
 * - Card stack of open apps
 * - Swipe-up-to-close gesture
 * - App preview snapshots
 * - "Close All" button
 */

import { motion } from 'framer-motion';
import { getIconDisplay } from '../../os/utils/iconMap';
import type { VFSNode } from '../../os/types';
import './MobileAppSwitcher.css';

interface MobileAppSwitcherProps {
  openApps: Array<{ id: string; node: VFSNode }>;
  onAppFocus: (appId: string) => void;
  onAppClose: (appId: string) => void;
  onCloseAll: () => void;
  onDismiss: () => void;
}

export default function MobileAppSwitcher({
  openApps,
  onAppFocus,
  onAppClose,
  onCloseAll,
  onDismiss,
}: MobileAppSwitcherProps) {
  const handleCardClick = (appId: string) => {
    onAppFocus(appId);
    onDismiss();
  };

  const handleCardSwipeUp = (appId: string) => {
    onAppClose(appId);
  };

  return (
    <motion.div
      className="mobile-app-switcher"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss} // Dismiss when clicking background
    >
      <div className="mobile-app-switcher__header">
        <h2 className="mobile-app-switcher__title">Recent Apps</h2>
        {openApps.length > 0 && (
          <button
            className="mobile-app-switcher__close-all"
            onClick={(e) => {
              e.stopPropagation();
              onCloseAll();
              onDismiss();
            }}
          >
            Close All
          </button>
        )}
      </div>

      <div className="mobile-app-switcher__cards">
        {openApps.length === 0 ? (
          <div className="mobile-app-switcher__empty">
            <p>No open apps</p>
          </div>
        ) : (
          openApps.map((app, index) => (
            <motion.div
              key={app.id}
              className="mobile-app-switcher__card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                // Close if swiped up > 100px or velocity > 500
                if (info.offset.y < -100 || info.velocity.y < -500) {
                  handleCardSwipeUp(app.id);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(app.id);
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Close button */}
              <button
                className="mobile-app-switcher__card-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onAppClose(app.id);
                }}
                aria-label="Close app"
              >
                ✕
              </button>

              {/* App preview (placeholder) */}
              <div className="mobile-app-switcher__card-preview">
                <div className="mobile-app-switcher__card-icon">
                  {getIconDisplay(app.node.icon)}
                </div>
                <div className="mobile-app-switcher__card-title">
                  {app.node.name}
                </div>
              </div>

              {/* App name */}
              <div className="mobile-app-switcher__card-name">
                {app.node.name}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
