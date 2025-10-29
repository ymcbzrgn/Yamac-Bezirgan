/**
 * VFS Slice - Virtual File System In-Memory Cache
 * Real IndexedDB CRUD operations (Faz 4)
 */

import { StateCreator } from 'zustand';
import type { VFSNode } from '../types';
import * as crud from '../vfs/crud';
import { seedDefaultDesktop } from '../vfs/seed';

/**
 * VFS state interface
 */
export interface VFSSlice {
  // State
  nodes: Record<string, VFSNode>; // node.id -> VFSNode (in-memory cache)
  rootId: string | null;
  isLoading: boolean;
  lastSync: number | null;
  error: string | null;

  // Actions
  loadVFS: () => Promise<void>;
  createNode: (node: VFSNode) => Promise<void>;
  updateNode: (nodeId: string, updates: Partial<VFSNode>) => Promise<void>;
  deleteNode: (nodeId: string) => Promise<void>;
  moveNode: (nodeId: string, newParentId: string) => Promise<void>;
  getNodesByParent: (parentId: string | null) => VFSNode[];
  getNodePath: (nodeId: string) => VFSNode[];
}

/**
 * VFS slice creator with real IndexedDB operations
 */
export const createVFSSlice: StateCreator<VFSSlice, [], [], VFSSlice> = (
  set,
  get
) => ({
  // Initial state
  nodes: {},
  rootId: null,
  isLoading: false,
  lastSync: null,
  error: null,

  /**
   * Load entire VFS from IndexedDB into memory
   * Runs seed if DB is empty
   */
  loadVFS: async () => {
    set({ isLoading: true, error: null });

    try {
      // Seed default desktop if DB is empty
      await seedDefaultDesktop();

      // Load all nodes from IndexedDB
      const allNodes = await crud.getAllNodes();

      // Convert array to Record<id, node> for fast lookup
      const nodesMap: Record<string, VFSNode> = {};
      let rootId: string | null = null;

      for (const node of allNodes) {
        nodesMap[node.id] = node;
        if (node.parentId === null && node.type === 'folder') {
          rootId = node.id; // Find root node
        }
      }

      set({
        nodes: nodesMap,
        rootId,
        isLoading: false,
        lastSync: Date.now(),
        error: null,
      });

      console.log(
        `[VFS Slice] Loaded ${allNodes.length} nodes from IndexedDB`
      );
    } catch (error) {
      console.error('[VFS Slice] Failed to load VFS:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * Create a new node
   * Optimistic update: Update state first, then DB
   */
  createNode: async (node: VFSNode) => {
    // Optimistic update
    set((state) => ({
      nodes: {
        ...state.nodes,
        [node.id]: node,
      },
    }));

    try {
      await crud.createNode(node);
      console.log(`[VFS Slice] Created node: ${node.name}`);
    } catch (error) {
      // Rollback on error
      console.error('[VFS Slice] Failed to create node, rolling back:', error);
      set((state) => {
        const newNodes = { ...state.nodes };
        delete newNodes[node.id];
        return { nodes: newNodes };
      });
      throw error;
    }
  },

  /**
   * Update a node
   * Optimistic update
   */
  updateNode: async (nodeId: string, updates: Partial<VFSNode>) => {
    const state = get();
    const existingNode = state.nodes[nodeId];

    if (!existingNode) {
      throw new Error(`Node ${nodeId} not found in cache`);
    }

    // Optimistic update
    const updatedNode: VFSNode = {
      ...existingNode,
      ...updates,
      modifiedAt: Date.now(),
    };

    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: updatedNode,
      },
    }));

    try {
      await crud.updateNode(nodeId, updates);
      console.log(`[VFS Slice] Updated node: ${nodeId}`);
    } catch (error) {
      // Rollback on error
      console.error('[VFS Slice] Failed to update node, rolling back:', error);
      set((state) => ({
        nodes: {
          ...state.nodes,
          [nodeId]: existingNode, // Restore original
        },
      }));
      throw error;
    }
  },

  /**
   * Delete a node (recursive)
   * Optimistic update
   */
  deleteNode: async (nodeId: string) => {
    const state = get();
    const nodeToDelete = state.nodes[nodeId];

    if (!nodeToDelete) {
      console.warn(`[VFS Slice] Node ${nodeId} not found, skipping delete`);
      return;
    }

    // Get all descendants (for recursive delete)
    const descendants = getAllDescendants(nodeId, state.nodes);

    // Optimistic delete
    set((state) => {
      const newNodes = { ...state.nodes };
      delete newNodes[nodeId];
      // Delete descendants too
      for (const descendant of descendants) {
        delete newNodes[descendant.id];
      }
      return { nodes: newNodes };
    });

    try {
      await crud.deleteNode(nodeId, true); // Recursive delete
      console.log(`[VFS Slice] Deleted node: ${nodeId}`);
    } catch (error) {
      // Rollback on error
      console.error('[VFS Slice] Failed to delete node, rolling back:', error);
      set((state) => ({
        nodes: {
          ...state.nodes,
          [nodeId]: nodeToDelete,
          // Restore descendants
          ...Object.fromEntries(descendants.map((n) => [n.id, n])),
        },
      }));
      throw error;
    }
  },

  /**
   * Move a node to a different parent
   * Optimistic update
   */
  moveNode: async (nodeId: string, newParentId: string) => {
    const state = get();
    const existingNode = state.nodes[nodeId];

    if (!existingNode) {
      throw new Error(`Node ${nodeId} not found in cache`);
    }

    const oldParentId = existingNode.parentId;

    // Optimistic update
    const movedNode: VFSNode = {
      ...existingNode,
      parentId: newParentId,
      modifiedAt: Date.now(),
    };

    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: movedNode,
      },
    }));

    try {
      await crud.moveNode(nodeId, newParentId);
      console.log(`[VFS Slice] Moved node ${nodeId} to ${newParentId}`);
    } catch (error) {
      // Rollback on error
      console.error('[VFS Slice] Failed to move node, rolling back:', error);
      set((state) => ({
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...movedNode,
            parentId: oldParentId, // Restore old parent
          },
        },
      }));
      throw error;
    }
  },

  /**
   * Get all children of a parent (from in-memory cache)
   * Filters out hidden nodes
   */
  getNodesByParent: (parentId: string | null) => {
    const state = get();
    return Object.values(state.nodes).filter(
      (node) => node.parentId === parentId && !node.hidden
    );
  },

  /**
   * Get path from root to node (breadcrumb)
   */
  getNodePath: (nodeId: string) => {
    const state = get();
    const path: VFSNode[] = [];
    let currentId: string | null = nodeId;

    while (currentId) {
      const node: VFSNode | undefined = state.nodes[currentId];
      if (!node) break;

      path.unshift(node); // Add to beginning
      currentId = node.parentId;

      // Safety: prevent infinite loop
      if (path.length > 100) {
        console.error('[VFS Slice] Circular dependency detected in getNodePath');
        break;
      }
    }

    return path;
  },
});

/**
 * Helper: Get all descendants of a node (recursive)
 */
function getAllDescendants(
  nodeId: string,
  nodes: Record<string, VFSNode>
): VFSNode[] {
  const descendants: VFSNode[] = [];

  function traverse(parentId: string) {
    const children = Object.values(nodes).filter(
      (node) => node.parentId === parentId
    );

    for (const child of children) {
      descendants.push(child);
      traverse(child.id); // Recurse
    }
  }

  traverse(nodeId);
  return descendants;
}
