/**
 * Windows Slice - Window Manager State
 * Window CRUD, focus, minimize/maximize, z-index yönetimi
 */

import { StateCreator } from 'zustand';
import type { WindowState } from '../types';

/**
 * Windows state interface
 */
export interface WindowsSlice {
  // State
  windows: WindowState[];
  focusedWindowId: string | null;
  nextZIndex: number;

  // Actions
  openWindow: (window: Omit<WindowState, 'zIndex'>) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  updateWindowBounds: (
    windowId: string,
    bounds: Partial<WindowState['bounds']>
  ) => void;
  updateWindowTitle: (windowId: string, title: string) => void;
}

/**
 * Windows slice creator
 */
export const createWindowsSlice: StateCreator<
  WindowsSlice,
  [],
  [],
  WindowsSlice
> = (set) => ({
  // Initial state
  windows: [],
  focusedWindowId: null,
  nextZIndex: 1000, // Start from 1000 to avoid conflicts with other z-indexed elements

  // Actions
  openWindow: (window) =>
    set((state) => {
      const newWindow: WindowState = {
        ...window,
        zIndex: state.nextZIndex,
      };
      return {
        windows: [...state.windows, newWindow],
        focusedWindowId: newWindow.id,
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  closeWindow: (windowId) =>
    set((state) => {
      const newWindows = state.windows.filter((w) => w.id !== windowId);
      const wasFocused = state.focusedWindowId === windowId;

      // If closed window was focused, focus the top window (highest z-index)
      let newFocusedWindowId = state.focusedWindowId;
      if (wasFocused && newWindows.length > 0) {
        const topWindow = newWindows.reduce((top, w) =>
          w.zIndex > top.zIndex ? w : top
        );
        newFocusedWindowId = topWindow.id;
      } else if (newWindows.length === 0) {
        newFocusedWindowId = null;
      }

      return {
        windows: newWindows,
        focusedWindowId: newFocusedWindowId,
      };
    }),

  focusWindow: (windowId) =>
    set((state) => {
      const window = state.windows.find((w) => w.id === windowId);
      if (!window) return state;

      // If window is minimized, restore it first
      const shouldRestore = window.state === 'minimized';

      return {
        windows: state.windows.map((w) =>
          w.id === windowId
            ? {
                ...w,
                zIndex: state.nextZIndex,
                state: shouldRestore ? 'normal' : w.state,
              }
            : w
        ),
        focusedWindowId: windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  minimizeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, state: 'minimized' } : w
      ),
      // If minimized window was focused, unfocus it
      focusedWindowId:
        state.focusedWindowId === windowId ? null : state.focusedWindowId,
    })),

  maximizeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId
          ? {
              ...w,
              state: 'maximized',
              // Store previous bounds for restore (will be implemented with immer in root store)
            }
          : w
      ),
    })),

  restoreWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, state: 'normal' } : w
      ),
    })),

  updateWindowBounds: (windowId, bounds) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId
          ? {
              ...w,
              bounds: { ...w.bounds, ...bounds },
            }
          : w
      ),
    })),

  updateWindowTitle: (windowId, title) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, title } : w
      ),
    })),
});
