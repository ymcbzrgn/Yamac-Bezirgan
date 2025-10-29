/**
 * Desktop Slice - Masaüstü Icon Yönetimi
 * Icon pozisyonları, grid layout, desktop state
 */

import { StateCreator } from 'zustand';
import { getDefaultIconLayout } from '../vfs/seed';

/**
 * Icon position with grid coordinates
 */
export interface IconPosition {
  id: string; // VFS node ID
  x: number; // Pixel position
  y: number; // Pixel position
  gridX: number; // Grid column (0-7 for 8 columns)
  gridY: number; // Grid row (0-5 for 6 rows)
  type: 'file' | 'folder' | 'app' | 'link';
}

/**
 * Grid size configuration
 */
export interface GridSize {
  columns: number;
  rows: number;
}

/**
 * Context menu state
 */
export interface ContextMenuState {
  x: number;
  y: number;
  targetNodeId: string | null; // null = desktop empty space
}

/**
 * Desktop state interface
 */
export interface DesktopSlice {
  // State
  layout: Record<string, IconPosition>; // nodeId → position
  gridSize: GridSize;
  selectedIconIds: string[];
  tempDragPosition: { nodeId: string; x: number; y: number } | null;
  contextMenu: ContextMenuState | null;

  // Grid calculations
  getGridCellSize: () => { cellWidth: number; cellHeight: number };
  isGridCellOccupied: (gridX: number, gridY: number, excludeNodeId?: string) => boolean;
  findNearestEmptyCell: (gridX: number, gridY: number) => { gridX: number; gridY: number } | null;

  // Actions
  initializeIconPosition: (nodeId: string, type: IconPosition['type']) => void;
  updateTempDragPosition: (nodeId: string, x: number, y: number) => void;
  snapToGrid: (nodeId: string) => void;
  removeIconPosition: (nodeId: string) => void;
  selectIcon: (iconId: string, multi?: boolean) => void;
  clearSelection: () => void;
  autoArrangeIcons: () => void;
  updateGridSize: (columns: number, rows: number) => void;
  showContextMenu: (nodeId: string | null, x: number, y: number) => void;
  hideContextMenu: () => void;
}

/**
 * Desktop slice creator
 */
export const createDesktopSlice: StateCreator<
  DesktopSlice,
  [],
  [],
  DesktopSlice
> = (set, get) => ({
  // Initial state
  layout: {},
  gridSize: { columns: 16, rows: 10 }, // Increased for tighter icon spacing
  selectedIconIds: [],
  tempDragPosition: null,
  contextMenu: null,

  // Grid calculations
  getGridCellSize: () => {
    const state = get();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 48; // -48 for taskbar
    const cellWidth = screenWidth / state.gridSize.columns;
    const cellHeight = screenHeight / state.gridSize.rows;
    return { cellWidth, cellHeight };
  },

  isGridCellOccupied: (gridX, gridY, excludeNodeId) => {
    const state = get();
    return Object.entries(state.layout).some(
      ([id, pos]) =>
        id !== excludeNodeId && pos.gridX === gridX && pos.gridY === gridY
    );
  },

  findNearestEmptyCell: (targetGridX, targetGridY) => {
    const state = get();
    const maxRadius = 5; // Search up to 5 cells away

    // Spiral search pattern
    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          // Only check cells at current radius (perimeter of square)
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

          const gridX = targetGridX + dx;
          const gridY = targetGridY + dy;

          // Bounds check
          if (
            gridX < 0 ||
            gridY < 0 ||
            gridX >= state.gridSize.columns ||
            gridY >= state.gridSize.rows
          ) {
            continue;
          }

          // Check if empty
          if (!state.isGridCellOccupied(gridX, gridY)) {
            return { gridX, gridY };
          }
        }
      }
    }

    return null; // No empty cell found
  },

  // Initialize icon position (use default layout, then auto-assign if needed)
  initializeIconPosition: (nodeId, type) =>
    set((state) => {
      // Check if already positioned
      if (state.layout[nodeId]) return {};

      const { cellWidth, cellHeight } = state.getGridCellSize();

      // Priority 1: Use default layout if defined for this icon
      const defaultLayout = getDefaultIconLayout();
      if (defaultLayout[nodeId]) {
        const { x: gridX, y: gridY } = defaultLayout[nodeId];
        return {
          layout: {
            ...state.layout,
            [nodeId]: {
              id: nodeId,
              x: gridX * cellWidth,
              y: gridY * cellHeight,
              gridX,
              gridY,
              type,
            },
          },
        };
      }

      // Priority 2: Auto-assign to first empty cell
      for (let y = 0; y < state.gridSize.rows; y++) {
        for (let x = 0; x < state.gridSize.columns; x++) {
          if (!state.isGridCellOccupied(x, y)) {
            return {
              layout: {
                ...state.layout,
                [nodeId]: {
                  id: nodeId,
                  x: x * cellWidth,
                  y: y * cellHeight,
                  gridX: x,
                  gridY: y,
                  type,
                },
              },
            };
          }
        }
      }

      // Priority 3: If grid full, place at (0, 0) with overlap
      return {
        layout: {
          ...state.layout,
          [nodeId]: {
            id: nodeId,
            x: 0,
            y: 0,
            gridX: 0,
            gridY: 0,
            type,
          },
        },
      };
    }),

  // Update temporary drag position (during drag, before snap)
  updateTempDragPosition: (nodeId, x, y) =>
    set({
      tempDragPosition: { nodeId, x, y },
    }),

  // Snap to grid (called on drag end)
  snapToGrid: (nodeId) =>
    set((state) => {
      const temp = state.tempDragPosition;
      if (!temp || temp.nodeId !== nodeId) return {};

      const { cellWidth, cellHeight } = state.getGridCellSize();

      // Calculate target grid position
      const targetGridX = Math.round(temp.x / cellWidth);
      const targetGridY = Math.round(temp.y / cellHeight);

      // Bounds check
      const boundedGridX = Math.max(
        0,
        Math.min(targetGridX, state.gridSize.columns - 1)
      );
      const boundedGridY = Math.max(
        0,
        Math.min(targetGridY, state.gridSize.rows - 1)
      );

      // Check if occupied
      let finalGridX = boundedGridX;
      let finalGridY = boundedGridY;

      if (state.isGridCellOccupied(finalGridX, finalGridY, nodeId)) {
        // Find nearest empty cell
        const nearestEmpty = state.findNearestEmptyCell(finalGridX, finalGridY);
        if (nearestEmpty) {
          finalGridX = nearestEmpty.gridX;
          finalGridY = nearestEmpty.gridY;
        }
        // If no empty cell, keep current position
        else {
          const current = state.layout[nodeId];
          if (current) {
            finalGridX = current.gridX;
            finalGridY = current.gridY;
          }
        }
      }

      // Update layout
      const existing = state.layout[nodeId];
      return {
        layout: {
          ...state.layout,
          [nodeId]: {
            ...existing,
            id: nodeId,
            x: finalGridX * cellWidth,
            y: finalGridY * cellHeight,
            gridX: finalGridX,
            gridY: finalGridY,
            type: existing?.type || 'file',
          },
        },
        tempDragPosition: null,
      };
    }),

  // Remove icon position from layout (when moved to folder)
  removeIconPosition: (nodeId) =>
    set((state) => {
      const { [nodeId]: removed, ...remainingLayout } = state.layout;
      return {
        layout: remainingLayout,
      };
    }),

  // Select icon
  selectIcon: (iconId, multi = false) =>
    set((state) => {
      if (multi) {
        // Multi-select: toggle
        const isSelected = state.selectedIconIds.includes(iconId);
        return {
          selectedIconIds: isSelected
            ? state.selectedIconIds.filter((id) => id !== iconId)
            : [...state.selectedIconIds, iconId],
        };
      } else {
        // Single select: replace
        return {
          selectedIconIds: [iconId],
        };
      }
    }),

  // Clear selection
  clearSelection: () =>
    set({
      selectedIconIds: [],
    }),

  // Auto-arrange icons (fill from top-left)
  autoArrangeIcons: () =>
    set((state) => {
      const { cellWidth, cellHeight } = state.getGridCellSize();
      const nodeIds = Object.keys(state.layout);

      const newLayout = { ...state.layout };
      nodeIds.forEach((nodeId, index) => {
        const gridX = index % state.gridSize.columns;
        const gridY = Math.floor(index / state.gridSize.columns);

        newLayout[nodeId] = {
          ...newLayout[nodeId],
          x: gridX * cellWidth,
          y: gridY * cellHeight,
          gridX,
          gridY,
        };
      });

      return { layout: newLayout };
    }),

  // Update grid size (recalculate all positions)
  updateGridSize: (columns, rows) =>
    set((state) => {
      const newGridSize = { columns, rows };
      // Recalculate cell sizes
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 48;
      const cellWidth = screenWidth / columns;
      const cellHeight = screenHeight / rows;

      // Recalculate all icon positions
      const newLayout = { ...state.layout };
      Object.keys(newLayout).forEach((nodeId) => {
        const pos = newLayout[nodeId];
        newLayout[nodeId] = {
          ...pos,
          x: pos.gridX * cellWidth,
          y: pos.gridY * cellHeight,
        };
      });

      return {
        gridSize: newGridSize,
        layout: newLayout,
      };
    }),

  // Show context menu
  showContextMenu: (nodeId, x, y) =>
    set({
      contextMenu: { x, y, targetNodeId: nodeId },
    }),

  // Hide context menu
  hideContextMenu: () =>
    set({
      contextMenu: null,
    }),
});
