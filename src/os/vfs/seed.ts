/**
 * VFS Seed Data
 * Default desktop structure initialization
 */

import { createNode } from './crud';
import { isDBEmpty } from './db';
import type { VFSNode } from '../types';

/**
 * Seed default desktop structure
 * Idempotent: Only runs if database is empty
 */
export async function seedDefaultDesktop(): Promise<void> {
  // Check if DB is already seeded
  const isEmpty = await isDBEmpty();

  if (!isEmpty) {
    console.log('[VFS Seed] Database already seeded, skipping...');
    return;
  }

  console.log('[VFS Seed] Creating default desktop structure...');

  const now = Date.now();

  // Root node (Desktop)
  const rootNode: VFSNode = {
    id: 'root',
    type: 'folder',
    name: 'Desktop',
    parentId: null,
    createdAt: now,
    modifiedAt: now,
    icon: 'desktop',
    readonly: true, // Root cannot be deleted/renamed
    hidden: false,
    starred: false,
  };

  // Home folder
  const homeFolder: VFSNode = {
    id: 'home',
    type: 'folder',
    name: 'Home',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-home',
    color: '#FF5722',
    readonly: false,
    hidden: false,
    starred: true,
  };

  // Projects folder (GitHub repos showcase)
  const projectsFolder: VFSNode = {
    id: 'projects',
    type: 'folder',
    name: 'Projects',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-code',
    color: '#2196F3',
    tags: ['github'],
    readonly: true, // Populated from GitHub API
    hidden: false,
    starred: true,
  };

  // CV.pdf (fake file, will be loaded from public/)
  const cvFile: VFSNode = {
    id: 'cv-pdf',
    type: 'file',
    name: 'CV.pdf',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-pdf',
    color: '#D32F2F',
    size: 0, // Unknown size (external file)
    mimeType: 'application/pdf',
    targetUrl: '/legacy/YAMAÇ_BEZİRGAN.pdf', // External link to legacy folder
    readonly: true,
    hidden: false,
    starred: true,
  };

  // Games folder (will contain Snake, Tetris, etc.)
  const gamesFolder: VFSNode = {
    id: 'games',
    type: 'folder',
    name: 'Games',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-games',
    color: '#9C27B0',
    tags: ['entertainment'],
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Trash (special system folder)
  const trashFolder: VFSNode = {
    id: 'trash',
    type: 'folder',
    name: 'Trash',
    parentId: null, // Not on desktop, accessed via context menu
    createdAt: now,
    modifiedAt: now,
    icon: 'trash-empty',
    readonly: true, // Cannot rename/move trash
    hidden: true, // Not shown on desktop
    starred: false,
  };

  // LinkedIn link (external URL)
  const linkedInLink: VFSNode = {
    id: 'linkedin-link',
    type: 'link',
    name: 'LinkedIn',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'link-linkedin',
    color: '#0077B5',
    targetUrl: 'https://www.linkedin.com/in/yamacbezirgan/',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // GitHub link
  const githubLink: VFSNode = {
    id: 'github-link',
    type: 'link',
    name: 'GitHub',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: 'link-github',
    color: '#333333',
    targetUrl: 'https://github.com/ymcbzrgn',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Create all nodes
  const nodes = [
    rootNode,
    homeFolder,
    projectsFolder,
    cvFile,
    gamesFolder,
    trashFolder,
    linkedInLink,
    githubLink,
  ];

  try {
    for (const node of nodes) {
      await createNode(node);
    }

    console.log(`[VFS Seed] ✅ Created ${nodes.length} default nodes`);
  } catch (error) {
    console.error('[VFS Seed] ❌ Failed to seed database:', error);
    throw error;
  }
}

/**
 * Get default icon positions for desktop grid
 * Maps node IDs to grid positions (x, y)
 */
export function getDefaultIconLayout(): Record<
  string,
  { x: number; y: number }
> {
  return {
    home: { x: 0, y: 0 },
    projects: { x: 0, y: 1 },
    'cv-pdf': { x: 0, y: 2 },
    games: { x: 0, y: 3 },
    'linkedin-link': { x: 0, y: 4 },
    'github-link': { x: 0, y: 5 },
  };
}
