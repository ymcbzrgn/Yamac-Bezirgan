/**
 * IndexedDB Database Schema & Connection
 * Ubuntu×XP VFS Storage
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { VFSNode, VFSContent } from '../types';

/**
 * Database schema definition
 */
interface UbuntuXPDB extends DBSchema {
  // VFS nodes (files, folders, links, apps)
  nodes: {
    key: string; // node.id
    value: VFSNode;
    indexes: {
      'by-parent': string; // parentId for querying children
      'by-type': string; // type for filtering
      'by-created': number; // createdAt for sorting
    };
  };

  // File contents (large blobs stored separately)
  contents: {
    key: string; // contentRef (same as VFSNode.contentRef)
    value: VFSContent;
  };
}

/**
 * Database configuration
 */
const DB_NAME = 'ubuntu-xp-vfs';
const DB_VERSION = 1;

/**
 * Singleton database connection
 */
let dbInstance: IDBPDatabase<UbuntuXPDB> | null = null;

/**
 * Open or get existing database connection
 */
export async function getDB(): Promise<IDBPDatabase<UbuntuXPDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<UbuntuXPDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(
        `[VFS DB] Upgrading from v${oldVersion} to v${newVersion}`
      );

      // Create nodes store
      if (!db.objectStoreNames.contains('nodes')) {
        const nodesStore = db.createObjectStore('nodes', { keyPath: 'id' });

        // Index for parent-child queries
        nodesStore.createIndex('by-parent', 'parentId', { unique: false });

        // Index for type filtering (folder, file, link, app)
        nodesStore.createIndex('by-type', 'type', { unique: false });

        // Index for creation time sorting
        nodesStore.createIndex('by-created', 'createdAt', { unique: false });

        console.log('[VFS DB] Created "nodes" store with indexes');
      }

      // Create contents store
      if (!db.objectStoreNames.contains('contents')) {
        db.createObjectStore('contents', { keyPath: 'id' });
        console.log('[VFS DB] Created "contents" store');
      }
    },

    blocked() {
      console.warn(
        '[VFS DB] Database upgrade blocked. Close other tabs using this database.'
      );
    },

    blocking() {
      console.warn(
        '[VFS DB] This connection is blocking a database upgrade. Closing...'
      );
      dbInstance?.close();
      dbInstance = null;
    },

    terminated() {
      console.error('[VFS DB] Database connection unexpectedly terminated');
      dbInstance = null;
    },
  });

  console.log(`[VFS DB] Connected to ${DB_NAME} v${DB_VERSION}`);
  return dbInstance;
}

/**
 * Close database connection
 * (Usually not needed, but useful for testing or cleanup)
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('[VFS DB] Connection closed');
  }
}

/**
 * Delete entire database (for reset/testing)
 * WARNING: This will delete all VFS data!
 */
export async function deleteDB(): Promise<void> {
  closeDB();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      console.log(`[VFS DB] Database ${DB_NAME} deleted`);
      resolve();
    };
    request.onerror = () => {
      console.error(`[VFS DB] Failed to delete database:`, request.error);
      reject(request.error);
    };
    request.onblocked = () => {
      console.warn(
        `[VFS DB] Delete blocked. Close all tabs using this database.`
      );
    };
  });
}

/**
 * Check if database is empty (no nodes)
 */
export async function isDBEmpty(): Promise<boolean> {
  const db = await getDB();
  const count = await db.count('nodes');
  return count === 0;
}

/**
 * Get database stats (for debugging/monitoring)
 */
export async function getDBStats(): Promise<{
  nodeCount: number;
  contentCount: number;
  estimatedSize?: number;
}> {
  const db = await getDB();

  const [nodeCount, contentCount] = await Promise.all([
    db.count('nodes'),
    db.count('contents'),
  ]);

  let estimatedSize: number | undefined;

  // Storage API (if available) for quota info
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    estimatedSize = estimate.usage;
  }

  return {
    nodeCount,
    contentCount,
    estimatedSize,
  };
}
