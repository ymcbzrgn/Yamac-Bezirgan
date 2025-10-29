/**
 * Bottom Sheet Component
 * Swipeable modal from bottom of screen
 * iOS/Android style bottom sheet with:
 * - Drag handle indicator
 * - Swipe-down-to-dismiss gesture
 * - Dynamic heights (25%, 50%, 75%, 100%)
 * - Blur backdrop
 */

import { motion } from 'framer-motion';
import './BottomSheet.css';

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  height?: '25%' | '50%' | '75%' | '100%';
  title?: string;
}

export default function BottomSheet({
  children,
  isOpen,
  onClose,
  height = '50%',
  title,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="bottom-sheet__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="bottom-sheet"
        style={{ height }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          // Close if dragged down > 150px or velocity > 500
          if (info.offset.y > 150 || info.velocity.y > 500) {
            onClose();
          }
        }}
      >
        {/* Drag Handle */}
        <div className="bottom-sheet__handle">
          <div className="bottom-sheet__handle-bar" />
        </div>

        {/* Title (optional) */}
        {title && (
          <div className="bottom-sheet__header">
            <h2 className="bottom-sheet__title">{title}</h2>
            <button
              className="bottom-sheet__close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="bottom-sheet__content">{children}</div>
      </motion.div>
    </>
  );
}
