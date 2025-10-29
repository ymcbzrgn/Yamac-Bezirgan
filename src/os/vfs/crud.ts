/**
 * VFS CRUD Operations
 * Idempotent, transaction-safe IndexedDB operations
 */

import { getDB } from './db';
import type { VFSNode, VFSContent } from '../types';

/**
 * Create a new VFS node
 * Idempotent: If node with same ID exists, throws error (unless silentIfExists=true)
 */
export async function createNode(node: VFSNode, silentIfExists = false): Promise<void> {
  const db = await getDB();

  // Validation
  if (!node.id || !node.name) {
    throw new Error('Invalid node: id and name are required');
  }

  // Check if node already exists (idempotency check)
  const existing = await db.get('nodes', node.id);
  if (existing) {
    if (silentIfExists) {
      // Silent mode: log as info and return without error
      console.log(`[VFS CRUD] ℹ️ Node already exists, skipping: ${node.name} (${node.id})`);
      return;
    }
    throw new Error(`Node with id "${node.id}" already exists`);
  }

  // Check circular dependency if parentId is set
  if (node.parentId) {
    await validateNoCircularDependency(node.id, node.parentId);
  }

  // Create node
  const tx = db.transaction('nodes', 'readwrite');
  try {
    await tx.store.add(node);
    await tx.done;
    console.log(`[VFS CRUD] Created node: ${node.name} (${node.id})`);
  } catch (error) {
    // Handle race condition: node created between check and transaction
    if (error instanceof Error &&
        (error.name === 'ConstraintError' ||
         error.message?.includes('already exists'))) {
      if (silentIfExists) {
        console.log(`[VFS CRUD] ℹ️ Node already exists (race condition), skipping: ${node.name} (${node.id})`);
        tx.done.catch(() => {}); // Suppress expected transaction abort
        return; // Silent success
      }
    }
    // Real errors: still log and throw
    console.error('[VFS CRUD] Failed to create node:', error);
    throw error;
  }
}

/**
 * Read a single node by ID
 */
export async function getNode(nodeId: string): Promise<VFSNode | undefined> {
  const db = await getDB();
  return await db.get('nodes', nodeId);
}

/**
 * Read all nodes (for loading entire VFS tree)
 */
export async function getAllNodes(): Promise<VFSNode[]> {
  const db = await getDB();
  return await db.getAll('nodes');
}

/**
 * Get all children of a parent node
 */
export async function getNodesByParent(
  parentId: string | null
): Promise<VFSNode[]> {
  const db = await getDB();
  return await db.getAllFromIndex('nodes', 'by-parent', parentId);
}

/**
 * Update an existing node (partial update)
 */
export async function updateNode(
  nodeId: string,
  updates: Partial<VFSNode>
): Promise<void> {
  const db = await getDB();

  const tx = db.transaction('nodes', 'readwrite');
  try {
    const existing = await tx.store.get(nodeId);

    if (!existing) {
      throw new Error(`Node with id "${nodeId}" not found`);
    }

    // Merge updates
    const updated: VFSNode = {
      ...existing,
      ...updates,
      id: existing.id, // Prevent ID change
      modifiedAt: Date.now(), // Auto-update timestamp
    };

    // If parentId changed, check circular dependency
    if (updates.parentId !== undefined && updates.parentId !== existing.parentId) {
      await validateNoCircularDependency(nodeId, updates.parentId);
    }

    await tx.store.put(updated);
    await tx.done;
    console.log(`[VFS CRUD] Updated node: ${updated.name} (${nodeId})`);
  } catch (error) {
    console.error('[VFS CRUD] Failed to update node:', error);
    throw error;
  }
}

/**
 * Delete a node (and optionally its children)
 * Default: recursive delete (moves to trash in future implementation)
 */
export async function deleteNode(
  nodeId: string,
  recursive = true
): Promise<void> {
  const db = await getDB();

  const tx = db.transaction('nodes', 'readwrite');
  try {
    const node = await tx.store.get(nodeId);

    if (!node) {
      // Idempotent: already deleted
      console.warn(`[VFS CRUD] Node ${nodeId} not found, skipping delete`);
      return;
    }

    // If recursive, delete all children first
    if (recursive && (node.type === 'folder' || node.type === 'app')) {
      const children = await getNodesByParent(nodeId);
      for (const child of children) {
        await deleteNodeRecursive(child.id, tx.store);
      }
    }

    // Delete the node itself
    await tx.store.delete(nodeId);
    await tx.done;
    console.log(`[VFS CRUD] Deleted node: ${node.name} (${nodeId})`);
  } catch (error) {
    console.error('[VFS CRUD] Failed to delete node:', error);
    throw error;
  }
}

/**
 * Helper: Recursive delete within a transaction
 */
async function deleteNodeRecursive(
  nodeId: string,
  store: any
): Promise<void> {
  const node = await store.get(nodeId);
  if (!node) return;

  // Get children from IndexedDB (within same transaction)
  const db = await getDB();
  const children = await db.getAllFromIndex('nodes', 'by-parent', nodeId);

  for (const child of children) {
    await deleteNodeRecursive(child.id, store);
  }

  await store.delete(nodeId);
}

/**
 * Move a node to a different parent
 */
export async function moveNode(
  nodeId: string,
  newParentId: string | null
): Promise<void> {
  const db = await getDB();

  // Check circular dependency
  if (newParentId) {
    await validateNoCircularDependency(nodeId, newParentId);
  }

  const tx = db.transaction('nodes', 'readwrite');
  try {
    const node = await tx.store.get(nodeId);

    if (!node) {
      throw new Error(`Node with id "${nodeId}" not found`);
    }

    // Update parent
    const updated: VFSNode = {
      ...node,
      parentId: newParentId,
      modifiedAt: Date.now(),
    };

    await tx.store.put(updated);
    await tx.done;
    console.log(`[VFS CRUD] Moved node ${node.name} to parent ${newParentId}`);
  } catch (error) {
    console.error('[VFS CRUD] Failed to move node:', error);
    throw error;
  }
}

/**
 * Get path from root to a node (breadcrumb)
 * Returns array: [root, parent, grandparent, ..., node]
 */
export async function getNodePath(nodeId: string): Promise<VFSNode[]> {
  const db = await getDB();
  const path: VFSNode[] = [];
  let currentId: string | null = nodeId;

  while (currentId) {
    const node: VFSNode | undefined = await db.get('nodes', currentId);
    if (!node) break;

    path.unshift(node); // Add to beginning
    currentId = node.parentId;

    // Safety: prevent infinite loop (circular dependency)
    if (path.length > 100) {
      console.error('[VFS CRUD] Circular dependency detected in getNodePath');
      throw new Error('Circular dependency detected');
    }
  }

  return path;
}

/**
 * Validate no circular dependency when setting parent
 * Throws error if nodeId is an ancestor of newParentId
 */
async function validateNoCircularDependency(
  nodeId: string,
  newParentId: string | null
): Promise<void> {
  if (!newParentId) return; // Root level, no circular issue

  const db = await getDB();
  let currentId: string | null = newParentId;
  let depth = 0;

  while (currentId) {
    if (currentId === nodeId) {
      throw new Error(
        `Circular dependency: cannot move node ${nodeId} into its own descendant ${newParentId}`
      );
    }

    const parent: VFSNode | undefined = await db.get('nodes', currentId);
    if (!parent) break;

    currentId = parent.parentId;
    depth++;

    // Safety: max depth 100
    if (depth > 100) {
      throw new Error('Max tree depth exceeded (possible circular dependency)');
    }
  }
}

/**
 * File Content Operations
 */

/**
 * Create or update file content
 */
export async function setContent(content: VFSContent): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('contents', 'readwrite');

  try {
    await tx.store.put(content);
    await tx.done;
    console.log(`[VFS CRUD] Saved content: ${content.id}`);
  } catch (error) {
    console.error('[VFS CRUD] Failed to save content:', error);
    throw error;
  }
}

/**
 * Get file content by ID
 */
export async function getContent(
  contentId: string
): Promise<VFSContent | undefined> {
  const db = await getDB();
  return await db.get('contents', contentId);
}

/**
 * Delete file content
 */
export async function deleteContent(contentId: string): Promise<void> {
  const db = await getDB();
  await db.delete('contents', contentId);
  console.log(`[VFS CRUD] Deleted content: ${contentId}`);
}
