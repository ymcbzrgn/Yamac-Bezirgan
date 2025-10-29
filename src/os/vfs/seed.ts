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
    targetUrl: '/legacy/YAMAC_BEZIRGAN_CV.pdf', // External link to legacy folder
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

  // === Game Apps (Phase 4) ===

  // Snake game
  const snakeGame: VFSNode = {
    id: 'snake-game',
    type: 'app',
    name: 'Snake',
    parentId: 'games',
    createdAt: now,
    modifiedAt: now,
    icon: '🐍',
    appId: 'snake-game',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Tetris game
  const tetrisGame: VFSNode = {
    id: 'tetris-game',
    type: 'app',
    name: 'Tetris',
    parentId: 'games',
    createdAt: now,
    modifiedAt: now,
    icon: '🎮',
    appId: 'tetris-game',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // 2048 game
  const game2048: VFSNode = {
    id: '2048-game',
    type: 'app',
    name: '2048',
    parentId: 'games',
    createdAt: now,
    modifiedAt: now,
    icon: '🔢',
    appId: '2048-game',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Minesweeper game
  const minesweeperGame: VFSNode = {
    id: 'minesweeper-game',
    type: 'app',
    name: 'Minesweeper',
    parentId: 'games',
    createdAt: now,
    modifiedAt: now,
    icon: '💣',
    appId: 'minesweeper-game',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Trash (special system folder)
  const trashFolder: VFSNode = {
    id: 'trash',
    type: 'folder',
    name: 'Trash',
    parentId: 'root', // Show on desktop
    createdAt: now,
    modifiedAt: now,
    icon: 'trash-empty',
    readonly: true, // Cannot rename/move trash
    hidden: false, // Visible on desktop
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

  // === Utility Apps (Phase 5) ===

  // Settings app (moved to Home)
  const settingsApp: VFSNode = {
    id: 'settings-app',
    type: 'app',
    name: 'Settings',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '⚙️',
    appId: 'settings-app',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Calculator app (moved to Home)
  const calculatorApp: VFSNode = {
    id: 'calculator-app',
    type: 'app',
    name: 'Calculator',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '🔢',
    appId: 'calculator-app',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Notes app (moved to Home)
  const notesApp: VFSNode = {
    id: 'notes-app',
    type: 'app',
    name: 'Notes',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '📝',
    appId: 'notes-app',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Calendar app (moved to Home)
  const calendarApp: VFSNode = {
    id: 'calendar-app',
    type: 'app',
    name: 'Calendar',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '📅',
    appId: 'calendar-app',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Terminal app (stays on Desktop)
  const terminalApp: VFSNode = {
    id: 'terminal-app',
    type: 'app',
    name: 'Terminal',
    parentId: 'root',
    createdAt: now,
    modifiedAt: now,
    icon: '🖥️',
    appId: 'terminal-app',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Music Player app (moved to Home)
  const musicPlayerApp: VFSNode = {
    id: 'music-player-app',
    type: 'app',
    name: 'Music Player',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '🎵',
    appId: 'music-player-app',
    readonly: false,
    hidden: true, // Hidden - will be re-added later
    starred: false,
  };

  // Photo Gallery app (moved to Home)
  const photoGalleryApp: VFSNode = {
    id: 'photo-gallery-app',
    type: 'app',
    name: 'Photos',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: '🖼️',
    appId: 'photo-gallery-app',
    readonly: false,
    hidden: true, // Hidden - will be re-added later
    starred: false,
  };

  // === Home Folder Substructure ===

  // Documents folder
  const documentsFolder: VFSNode = {
    id: 'documents',
    type: 'folder',
    name: 'Documents',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-documents',
    color: '#4CAF50',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Downloads folder
  const downloadsFolder: VFSNode = {
    id: 'downloads',
    type: 'folder',
    name: 'Downloads',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-downloads',
    color: '#00BCD4',
    readonly: false,
    hidden: true, // Hidden - will be re-added later
    starred: false,
  };

  // Pictures folder
  const picturesFolder: VFSNode = {
    id: 'pictures',
    type: 'folder',
    name: 'Pictures',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-pictures',
    color: '#E91E63',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // About Me markdown file
  const aboutMeContent = `# Yamaç Bezirgan

## Full Stack Developer

Welcome to my interactive portfolio! I'm a passionate developer who loves creating engaging web experiences.

### Skills
- React & TypeScript
- Node.js & Express
- Database Design
- System Architecture

### About This Portfolio
This entire portfolio is built as a desktop OS simulation, showcasing advanced frontend development techniques including:
- Virtual File System (IndexedDB)
- State Management (Zustand)
- Window Management System
- Performance Optimization

Feel free to explore and interact with the various applications!`;

  const aboutMeFile: VFSNode = {
    id: 'about-me-md',
    type: 'file',
    name: 'About-Me.md',
    parentId: 'documents',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-markdown',
    color: '#607D8B',
    size: aboutMeContent.length,
    mimeType: 'text/markdown',
    targetUrl: `data:text/markdown;base64,${btoa(unescape(encodeURIComponent(aboutMeContent)))}`,
    readonly: false,
    hidden: false,
    starred: false,
  };

  // README text file
  const readmeContent = `Welcome to My Portfolio!
========================

Thank you for visiting my interactive desktop portfolio.

This is a fully functional desktop environment running in your browser, featuring:

- Virtual File System with persistent storage
- Draggable and resizable windows
- Multiple applications (PDF viewer, File Explorer, Games, and more)
- GitHub integration for live project showcase

Navigation Tips:
- Double-click icons to open them
- Drag windows to move them around
- Use the taskbar to switch between open windows
- Check out the Games folder for some fun!

Feel free to explore and interact with everything.

- Yamaç Bezirgan
  GitHub: github.com/ymcbzrgn
  LinkedIn: linkedin.com/in/yamacbezirgan`;

  const readmeFile: VFSNode = {
    id: 'readme-txt',
    type: 'file',
    name: 'README.txt',
    parentId: 'downloads',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-text',
    color: '#9E9E9E',
    size: readmeContent.length,
    mimeType: 'text/plain',
    targetUrl: `data:text/plain;base64,${btoa(readmeContent)}`,
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Profile image (reference to legacy folder)
  const profileImage: VFSNode = {
    id: 'profile-webp',
    type: 'file',
    name: 'profile.webp',
    parentId: 'pictures',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-image',
    color: '#FF9800',
    size: 0,
    mimeType: 'image/webp',
    targetUrl: '/legacy/profile.webp', // Adjust path as needed
    readonly: true,
    hidden: false,
    starred: false,
  };

  // Old Website (legacy site in trash - easter egg!)
  const oldWebsite: VFSNode = {
    id: 'old-website',
    type: 'file',
    name: 'Old Website',
    parentId: 'trash', // Lives in trash folder
    createdAt: now - 90 * 24 * 60 * 60 * 1000, // 90 days ago (looks old!)
    modifiedAt: now - 90 * 24 * 60 * 60 * 1000,
    icon: '🌐',
    color: '#9E9E9E',
    size: 0, // Unknown (external)
    mimeType: 'application/x-legacy-site', // Triggers browser app
    targetUrl: '/legacy/index.html', // Points to built legacy site
    readonly: true, // Can't edit or delete
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
    // Game apps (Phase 4)
    snakeGame,
    tetrisGame,
    game2048,
    minesweeperGame,
    // Utility apps (Phase 5)
    settingsApp,
    calculatorApp,
    notesApp,
    calendarApp,
    terminalApp,
    musicPlayerApp,
    photoGalleryApp,
    trashFolder,
    linkedInLink,
    githubLink,
    // Home subfolders
    documentsFolder,
    downloadsFolder,
    picturesFolder,
    // Sample files
    aboutMeFile,
    readmeFile,
    profileImage,
    oldWebsite,
  ];

  // Use silentIfExists=true to skip duplicates without errors
  for (const node of nodes) {
    await createNode(node, true);
  }

  console.log(`[VFS Seed] ✅ Seeding complete (${nodes.length} nodes processed)`);
}

/**
 * Get default icon positions for desktop grid
 * Maps node IDs to grid positions (x, y)
 * Grid: 16 columns x 10 rows (0-15, 0-9)
 * Layout: Apps top-left, Trash bottom-left, Social links bottom-right
 */
export function getDefaultIconLayout(): Record<
  string,
  { x: number; y: number }
> {
  return {
    // Top-left (2x2 grid for main apps)
    home: { x: 0, y: 0 },
    projects: { x: 1, y: 0 },
    'cv-pdf': { x: 0, y: 1 },
    games: { x: 1, y: 1 },

    // Bottom-left (trash)
    trash: { x: 0, y: 9 },

    // Bottom-right (social links)
    'linkedin-link': { x: 15, y: 8 },
    'github-link': { x: 15, y: 9 },
  };
}
