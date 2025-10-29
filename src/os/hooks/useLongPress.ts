/**
 * useLongPress Hook
 * Touch-optimized long-press detection for mobile context menus
 * Prevents conflicts with drag, scroll, and double-tap gestures
 */

import { useRef, useCallback } from 'react';

interface LongPressOptions {
  delay?: number;              // Default: 500ms
  moveThreshold?: number;      // Default: 10px (cancels if moved)
  preventDefault?: boolean;    // Default: true
}

interface LongPressHandlers<T extends HTMLElement> {
  onTouchStart: (e: React.TouchEvent<T>) => void;
  onTouchEnd: () => void;
  onTouchMove: (e: React.TouchEvent<T>) => void;
  onMouseDown?: (e: React.MouseEvent<T>) => void;  // Optional desktop testing
  onMouseUp?: () => void;
  onMouseMove?: (e: React.MouseEvent<T>) => void;
}

export function useLongPress<T extends HTMLElement>(
  callback: (e: React.TouchEvent<T> | React.MouseEvent<T>) => void,
  options: LongPressOptions = {}
): LongPressHandlers<T> {
  const { delay = 500, moveThreshold = 10, preventDefault = true } = options;

  const timeoutRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const eventRef = useRef<React.TouchEvent<T> | React.MouseEvent<T> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    startPosRef.current = null;
    eventRef.current = null;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<T>) => {
      if (preventDefault) {
        e.preventDefault(); // Prevents drag, selection
      }

      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      eventRef.current = e;

      timeoutRef.current = window.setTimeout(() => {
        if (eventRef.current) {
          callback(eventRef.current);
          clear();
        }
      }, delay);
    },
    [callback, delay, preventDefault, clear]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<T>) => {
      if (!startPosRef.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startPosRef.current.x);
      const deltaY = Math.abs(touch.clientY - startPosRef.current.y);

      // If moved beyond threshold, cancel long-press (prevents accidental trigger during scroll)
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clear();
      }
    },
    [moveThreshold, clear]
  );

  const handleTouchEnd = useCallback(() => {
    clear();
  }, [clear]);

  // Optional: Desktop mouse support for testing
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<T>) => {
      if (e.button !== 0) return; // Only left click

      startPosRef.current = { x: e.clientX, y: e.clientY };
      eventRef.current = e;

      timeoutRef.current = window.setTimeout(() => {
        if (eventRef.current) {
          callback(eventRef.current);
          clear();
        }
      }, delay);
    },
    [callback, delay, clear]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!startPosRef.current) return;

      const deltaX = Math.abs(e.clientX - startPosRef.current.x);
      const deltaY = Math.abs(e.clientY - startPosRef.current.y);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clear();
      }
    },
    [moveThreshold, clear]
  );

  const handleMouseUp = useCallback(() => {
    clear();
  }, [clear]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseMove: handleMouseMove,
  };
}
