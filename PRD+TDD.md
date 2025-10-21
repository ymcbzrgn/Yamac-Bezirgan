# Ubuntu×XP Desktop Portfolio
## Comprehensive Product & Technical Design Document (PRD + TDD)

**Version:** 1.0.0  
**Last Updated:** 2025-10-20  
**Status:** 🟡 Active Development (MVP Phase)  
**Project Repository:** https://github.com/ymcbzrgn/Yamac-Bezirgan

---

## 📋 Document Control

**Purpose:** This document serves as the single source of truth combining product requirements (PRD) and technical design (TDD) for the Ubuntu×XP Desktop Portfolio project. It is optimized for AI-assisted development (vibe-coding) and should be referenced during all implementation phases.

**Audience:**
- Primary: AI Development Assistant (Claude)
- Secondary: Future maintainers, code reviewers, stakeholders

**Related Documents:**
- `ROADMAP.md` - Implementation timeline and atomic tasks
- `CLAUDE.md` - Living documentation, lessons learned, error library
- `CHANGELOG.md` - Version history and releases

**Maintenance Protocol:**
- Update after each major architecture decision
- Sync with ROADMAP.md when epics/tasks change
- Document technical debt and migration paths
- Review quarterly for accuracy and relevance

---

## 🎯 Executive Summary

### The Vision
A **serverless, desktop-OS-inspired portfolio** that stands out in a sea of generic single-page portfolios. Users experience a fully functional desktop environment in their browser—complete with draggable windows, a virtual file system, dynamic GitHub project viewer, PDF CV, mini-games, and an easter egg showcasing the legacy site in the "Trash" folder.

### Why This Matters
- **Differentiation:** OS-like UX creates 10x higher memorability vs traditional portfolios
- **Technical Showcase:** Demonstrates advanced frontend skills (state management, VFS, performance optimization)
- **Zero Cost:** Serverless architecture (Cloudflare Pages + IndexedDB) = $0 hosting
- **Dynamic Content:** GitHub API integration eliminates manual project updates

### Key Innovation Points
1. **Dual-Mode Architecture:** Desktop mode (full OS experience) + Mobile mode (adaptive sheets/launcher)
2. **VFS Persistence:** IndexedDB-backed virtual file system with export/import
3. **Legacy Integration:** Old portfolio site embedded as easter egg with safe iframe strategy
4. **Performance Budget:** Strict 180KB gzip JS bundle, LCP <2s, INP <100ms

### Success Criteria (30-Second Test)
> "Can a visitor find CV or GitHub projects within 30 seconds AND remember this portfolio a week later?"

**Target Metrics:**
- CV/GitHub access rate: ≥35% in first 30s
- Games engagement: ≥20% open rate
- Performance: LCP p95 ≤2.0s, INP p95 ≤100ms
- Memorability: Qualitative feedback (unique, fun, professional)

---

## 1. Product Vision & Strategy

### 1.1 Problem Statement

**Current State Pain Points:**
- Traditional portfolios are **skimmable** but forgettable
- Static content requires manual updates after each project
- Hiring managers/technical leads spend <2min per portfolio
- Mobile experiences often broken or unoptimized
- No differentiation = lost in the noise

**User Frustrations:**
- "I've seen 100 Bootstrap portfolios today, they all look the same"
- "The GitHub link is buried, I can't quickly see project depth"
- "Mobile version is just a squished desktop layout"
- "No way to explore interactively, it's just scrolling"

### 1.2 Solution Overview

**Core Concept:**
Transform the portfolio into a **functional desktop operating system** running entirely in the browser. Users can:
- Drag/resize/minimize/maximize windows (just like Windows/macOS)
- Create folders, files, shortcuts in a persistent virtual file system
- Browse dynamic GitHub projects with README previews
- View PDF CV in a native-like viewer
- Play retro games (Snake, 2048) with high-score persistence
- Discover the old portfolio site as an easter egg in the Trash folder

**Dual-Mode Strategy:**
- **Desktop Mode (≥768px):** Full OS experience with desktop icons, multi-window management, taskbar
- **Mobile Mode (<768px):** Adaptive UX with launcher grid, fullscreen sheets, bottom drawer app switcher

**Technical Foundation:**
- **100% Serverless:** No backend, no database, no auth
- **Client-Side Persistence:** IndexedDB (VFS content) + localStorage (preferences)
- **Dynamic Data:** GitHub API with ETag caching
- **PWA-Ready:** Offline shell, install prompt, service worker

### 1.3 Target Audience & Personas

#### Persona 1: Technical Recruiter (Sarah)
**Goals:** Quickly assess technical skills, find CV, verify GitHub activity  
**Pain Points:** Too many portfolios to review, needs fast filtering  
**How We Help:** CV accessible in 1 click, GitHub projects auto-updated, clear skill signals  
**Success Metric:** CV viewed + GitHub clicked within 30s

#### Persona 2: Engineering Manager (Alex)
**Goals:** Evaluate code quality, project depth, technical decision-making  
**Pain Points:** Needs more than superficial project lists  
**How We Help:** README previews, direct GitHub links, technical stack visible  
**Success Metric:** ≥2 project READMEs opened, GitHub profile visited

#### Persona 3: Fellow Developer (Jordan)
**Goals:** Get inspiration, see cool tech implementations, maybe collaborate  
**Pain Points:** Boring portfolios, no interactivity  
**How We Help:** OS-like experience, open-source code, fun games  
**Success Metric:** Games played, code repository starred

#### Persona 4: Community/Mentor (Taylor)
**Goals:** Assess creativity, potential, culture fit  
**Pain Points:** Hard to gauge personality from static sites  
**How We Help:** Playful UX, easter eggs, nostalgic design  
**Success Metric:** Trash folder opened, positive feedback shared

### 1.4 Value Proposition

**For Visitors:**
- ✅ Instant memorability (OS UX = unique)
- ✅ Fast access to CV/projects (no hunting)
- ✅ Fun exploration (games, easter eggs)
- ✅ Works offline (PWA)

**For Portfolio Owner (You):**
- ✅ Zero maintenance cost (serverless)
- ✅ Auto-updating projects (GitHub API)
- ✅ Technical skill showcase (VFS, state mgmt, perf optimization)
- ✅ Portfolio itself is a portfolio piece

**Competitive Advantages:**
| Feature | Traditional Portfolio | OS-Themed Static | This Portfolio |
|---------|----------------------|------------------|----------------|
| Memorability | Low | Medium | **High** |
| Mobile UX | Responsive | Often broken | **Adaptive (2 modes)** |
| Dynamic Content | Manual updates | Static | **GitHub API** |
| Interactivity | Scroll + click | Click | **Drag, resize, create files** |
| Cost | $5-20/mo | $0-5/mo | **$0** |
| Performance | Variable | Good | **Optimized (<180KB)** |

---

## 2. Technical Architecture (TDD)

### 2.1 System Overview

**Architecture Pattern:** Single-Page Application (SPA) with client-side state management and persistence

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Environment                      │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ OS Layer (State Management)                           │  │
│  │  ├── Zustand Store (modular slices)                  │  │
│  │  ├── Event Bus (pub/sub)                             │  │
│  │  └── Performance Scheduler (RAF)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ UI Layer (Components)                                 │  │
│  │  ├── Desktop: Window, Taskbar, DesktopIcon          │  │
│  │  └── Mobile: Launcher, Sheet, AppSwitcher           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Apps Layer (Lazy-Loaded)                              │  │
│  │  ├── PDF Viewer (PDF.js)                             │  │
│  │  ├── GitHub Viewer (API + ETag cache)                │  │
│  │  ├── Browser (iframe/fallback)                       │  │
│  │  ├── Games (Snake, 2048)                             │  │
│  │  └── Settings (theme, mode, wallpaper)               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Persistence Layer                                     │  │
│  │  ├── IndexedDB (VFS: files, folders, content)       │  │
│  │  └── localStorage (layout, settings, scores)        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
   ┌─────────────┐              ┌──────────────┐
   │ GitHub API  │              │ Cloudflare   │
   │ (public)    │              │ Pages CDN    │
   └─────────────┘              └──────────────┘
```

**Key Architectural Decisions:**
1. **No Backend:** Eliminates server costs, scaling concerns, and latency
2. **Client-Side State:** Zustand for predictable, debuggable state mutations
3. **Persistent VFS:** IndexedDB provides structured storage for user-created content
4. **Lazy Loading:** Code-split apps to meet 180KB initial bundle budget
5. **Dual Rendering:** Separate component trees for desktop/mobile (no responsive hacks)

### 2.2 Legacy Archive Strategy

**Problem:** Need to preserve old portfolio site while building new one, and showcase it as easter egg.

**Solution:** Three-tier approach

#### Tier 1: Archive to `old/` Directory
```
old/
├── legacy-src/           # Original src/
├── legacy-public/        # Original public/
├── legacy-index.html     # Original index.html
├── vite.config.legacy.ts # Separate Vite config
├── package.json          # Minimal legacy dependencies
└── README.legacy.md      # Documentation
```

**Implementation Steps:**
1. Create `chore/archive-legacy-site` branch
2. Move all current files to `old/` with `legacy-*` prefix
3. Configure separate Vite build for legacy site
4. Test legacy build: `npm run build:legacy` → `old/dist-legacy/`

#### Tier 2: Build Pipeline Integration
```json
// package.json scripts
{
  "build:legacy": "vite build --config old/vite.config.legacy.ts",
  "postbuild:legacy": "rm -rf public/legacy && mkdir -p public/legacy && cp -R old/dist-legacy/* public/legacy/",
  "build:new": "vite build",
  "build:all": "npm run build:legacy && npm run postbuild:legacy && npm run build:new"
}
```

**Build Flow:**
```
npm run build:all
    │
    ├─► build:legacy ──► old/dist-legacy/
    │                         │
    ├─► postbuild:legacy ────┼─► Copy to public/legacy/
    │                         │
    └─► build:new ───────────┴─► dist/ (includes legacy/ folder)
                                   │
                                   └─► Deploy to Cloudflare Pages
```

**Result:** Legacy site served at `/legacy/index.html` under same domain

#### Tier 3: Easter Egg Integration
```typescript
// Trash folder VFS node
{
  id: 'trash-old-site',
  type: 'file',
  name: 'old-site.webp',
  meta: {
    icon: 'internet-explorer-old',
    action: 'open-iframe',
    url: '/legacy/index.html'
  }
}

// App handler
function openTrashSite() {
  // Try iframe (same-origin, frame-ancestors allowed)
  openWindow({
    appId: 'browser',
    url: '/legacy/index.html',
    title: 'My Old Portfolio (RIP 2024)',
    sandbox: 'allow-scripts allow-same-origin'
  });
  
  // Fallback: If iframe blocked, open new tab
  window.addEventListener('error', () => {
    window.open('/legacy/index.html', '_blank', 'noopener,noreferrer');
  });
}
```

**Security Considerations:**
- Legacy site served from same domain → CSP `frame-ancestors 'self'` allows iframe
- Sandbox attribute: `allow-scripts allow-same-origin` (minimal permissions)
- No postMessage communication (isolated context)

### 2.3 State Management Architecture (Zustand)

**Why Zustand:**
- Minimal boilerplate vs Redux
- TypeScript-first API
- Middleware for devtools, persist, immer
- Supports modular slices (domain separation)
- No Provider wrapping needed

**Store Structure:**
```typescript
// src/os/store/index.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createDesktopSlice, DesktopSlice } from './desktopSlice';
import { createWindowsSlice, WindowsSlice } from './windowsSlice';
import { createVFSSlice, VFSSlice } from './vfsSlice';
import { createSettingsSlice, SettingsSlice } from './settingsSlice';

export type RootState = DesktopSlice & WindowsSlice & VFSSlice & SettingsSlice;

export const useStore = create<RootState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createDesktopSlice(...a),
        ...createWindowsSlice(...a),
        ...createVFSSlice(...a),
        ...createSettingsSlice(...a),
      })),
      {
        name: 'os-storage',
        partialize: (state) => ({
          // Only persist these slices
          desktop: state.desktop,
          settings: state.settings,
          // VFS persists to IndexedDB separately
          // Windows state is ephemeral (not persisted)
        }),
      }
    ),
    { name: 'OS Store' }
  )
);
```

#### Desktop Slice (Icon Layout)
```typescript
// src/os/store/desktopSlice.ts
export interface DesktopSlice {
  desktop: {
    layout: Record<string, { x: number; y: number; pinned?: boolean }>;
    gridSize: { cols: number; rows: number };
    selectedIcons: string[];
  };
  
  // Actions
  updateIconPosition: (nodeId: string, position: { x: number; y: number }) => void;
  snapToGrid: (nodeId: string) => void;
  selectIcon: (nodeId: string, multi?: boolean) => void;
  clearSelection: () => void;
  saveLayout: () => void;
  loadLayout: () => void;
}

export const createDesktopSlice: StateCreator<RootState, [], [], DesktopSlice> = (set, get) => ({
  desktop: {
    layout: {},
    gridSize: { cols: 10, rows: 6 },
    selectedIcons: [],
  },
  
  updateIconPosition: (nodeId, position) => set((state) => {
    state.desktop.layout[nodeId] = position;
  }),
  
  snapToGrid: (nodeId) => set((state) => {
    const pos = state.desktop.layout[nodeId];
    if (!pos) return;
    
    const { gridSize } = state.desktop;
    const cellWidth = window.innerWidth / gridSize.cols;
    const cellHeight = window.innerHeight / gridSize.rows;
    
    const snappedX = Math.round(pos.x / cellWidth) * cellWidth;
    const snappedY = Math.round(pos.y / cellHeight) * cellHeight;
    
    state.desktop.layout[nodeId] = { x: snappedX, y: snappedY };
  }),
  
  // ... other actions
});
```

#### Windows Slice (Window Management)
```typescript
// src/os/store/windowsSlice.ts
export interface WindowState {
  id: string;
  appId: string;
  nodeId?: string; // VFS node being displayed
  title: string;
  bounds: { x: number; y: number; width: number; height: number };
  state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
  zIndex: number;
  meta?: Record<string, any>;
}

export interface WindowsSlice {
  windows: WindowState[];
  
  // Actions
  openWindow: (config: Partial<WindowState>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateBounds: (id: string, bounds: Partial<WindowState['bounds']>) => void;
  bringToFront: (id: string) => void;
}

export const createWindowsSlice: StateCreator<RootState, [], [], WindowsSlice> = (set, get) => ({
  windows: [],
  
  openWindow: (config) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxZ = Math.max(...get().windows.map(w => w.zIndex), 0);
    
    set((state) => {
      state.windows.push({
        id,
        appId: config.appId || 'unknown',
        title: config.title || 'Untitled',
        bounds: config.bounds || { x: 100, y: 100, width: 800, height: 600 },
        state: config.state || 'normal',
        zIndex: maxZ + 1,
        ...config,
      });
    });
    
    return id;
  },
  
  focusWindow: (id) => set((state) => {
    const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0);
    const window = state.windows.find(w => w.id === id);
    if (window) {
      window.zIndex = maxZ + 1;
      if (window.state === 'minimized') {
        window.state = 'normal';
      }
    }
  }),
  
  // ... other actions
});
```

#### VFS Slice (Virtual File System State)
```typescript
// src/os/store/vfsSlice.ts
export interface VFSSlice {
  vfs: {
    nodes: Record<string, VFSNode>; // In-memory cache
    currentPath: string[];
    clipboard: { action: 'copy' | 'cut'; nodeIds: string[] } | null;
    history: { past: VFSOperation[]; future: VFSOperation[] };
  };
  
  // Actions
  loadVFS: () => Promise<void>;
  createNode: (node: Omit<VFSNode, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<string>;
  deleteNode: (nodeId: string) => Promise<void>;
  moveNode: (nodeId: string, newParentId: string) => Promise<void>;
  renameNode: (nodeId: string, newName: string) => Promise<void>;
  navigateTo: (path: string[]) => void;
  copyNodes: (nodeIds: string[]) => void;
  pasteNodes: (targetParentId: string) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  exportVFS: () => Promise<Blob>;
  importVFS: (json: string) => Promise<void>;
}
```

**State Persistence Strategy:**
- **Desktop layout:** localStorage (fast, small data)
- **Settings:** localStorage (fast, small data)
- **VFS nodes:** IndexedDB (async, large data, structured)
- **Windows:** Ephemeral (not persisted, recreated on app open)

**Performance Considerations:**
- Immer middleware: enables mutable-style updates (compiled to immutable)
- Selective persistence: only serialize necessary slices
- Debounced localStorage writes (throttle to max 1 write/500ms)
- IndexedDB writes: batched transactions where possible

### 2.4 Virtual File System (VFS) Architecture

**Design Philosophy:** OS-like file system that persists entirely in IndexedDB, supporting folders, files, shortcuts, with CRUD operations and export/import.

#### VFS Node Schema
```typescript
// src/os/vfs/types.ts
export type VFSNodeType = 'folder' | 'file' | 'link' | 'app';

export interface VFSNode {
  id: string;                    // UUID
  type: VFSNodeType;
  name: string;
  parentId: string | null;       // null = root
  
  // Metadata
  icon?: string;                 // Icon name/path
  createdAt: number;             // Unix timestamp
  modifiedAt: number;
  size?: number;                 // Bytes (for files)
  mimeType?: string;             // e.g., 'text/plain', 'application/pdf'
  
  // Content reference (for files)
  contentRef?: string;           // Key in separate content store
  
  // Link-specific (for shortcuts)
  targetUrl?: string;            // External URL
  targetNodeId?: string;         // Internal node ID
  
  // App-specific (for .app nodes)
  appId?: string;                // Registered app identifier
  appConfig?: Record<string, any>;
  
  // Ordering/Layout
  order?: number;                // Sort order in parent
  
  // Permissions (future-proofing)
  readonly?: boolean;
  hidden?: boolean;
}

// Separate content storage (for large file contents)
export interface VFSContent {
  id: string;                    // Same as contentRef in VFSNode
  data: string | ArrayBuffer;    // Text or binary
  compressed?: boolean;          // If pako compression used
}
```

#### IndexedDB Schema
```typescript
// src/os/vfs/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface VFSDB extends DBSchema {
  nodes: {
    key: string;
    value: VFSNode;
    indexes: {
      'by-parent': string;
      'by-type': VFSNodeType;
      'by-name': string;
    };
  };
  
  contents: {
    key: string;
    value: VFSContent;
  };
  
  metadata: {
    key: string;
    value: any;
  };
}

export async function initVFSDB(): Promise<IDBPDatabase<VFSDB>> {
  return openDB<VFSDB>('vfs-storage', 1, {
    upgrade(db) {
      // Nodes store
      const nodeStore = db.createObjectStore('nodes', { keyPath: 'id' });
      nodeStore.createIndex('by-parent', 'parentId');
      nodeStore.createIndex('by-type', 'type');
      nodeStore.createIndex('by-name', 'name');
      
      // Contents store
      db.createObjectStore('contents', { keyPath: 'id' });
      
      // Metadata store
      db.createObjectStore('metadata', { keyPath: 'key' });
    },
  });
}
```

#### CRUD Operations (Idempotent)
```typescript
// src/os/vfs/crud.ts
import { v4 as uuid } from 'uuid';
import { getVFSDB } from './db';

/**
 * Create a new VFS node
 * Idempotent: If node with same ID exists, returns existing ID
 */
export async function createNode(
  node: Omit<VFSNode, 'id' | 'createdAt' | 'modifiedAt'>
): Promise<string> {
  const db = await getVFSDB();
  const now = Date.now();
  
  const newNode: VFSNode = {
    id: uuid(),
    createdAt: now,
    modifiedAt: now,
    ...node,
  };
  
  // Transaction for atomicity
  const tx = db.transaction(['nodes'], 'readwrite');
  
  try {
    // Check if parent exists (referential integrity)
    if (newNode.parentId) {
      const parent = await tx.objectStore('nodes').get(newNode.parentId);
      if (!parent || parent.type !== 'folder') {
        throw new Error(`Parent folder not found: ${newNode.parentId}`);
      }
    }
    
    await tx.objectStore('nodes').add(newNode);
    await tx.done;
    
    // Update Zustand store
    useStore.getState().vfs.nodes[newNode.id] = newNode;
    
    return newNode.id;
  } catch (err) {
    console.error('createNode failed:', err);
    throw err;
  }
}

/**
 * Delete node (and recursively delete children if folder)
 */
export async function deleteNode(nodeId: string): Promise<void> {
  const db = await getVFSDB();
  const tx = db.transaction(['nodes', 'contents'], 'readwrite');
  
  try {
    const node = await tx.objectStore('nodes').get(nodeId);
    if (!node) {
      console.warn('Node not found, skipping delete:', nodeId);
      return; // Idempotent
    }
    
    // If folder, recursively delete children
    if (node.type === 'folder') {
      const children = await tx.objectStore('nodes').index('by-parent').getAll(nodeId);
      for (const child of children) {
        await deleteNode(child.id); // Recursive
      }
    }
    
    // If file, delete content
    if (node.contentRef) {
      await tx.objectStore('contents').delete(node.contentRef);
    }
    
    // Delete node
    await tx.objectStore('nodes').delete(nodeId);
    await tx.done;
    
    // Update store
    delete useStore.getState().vfs.nodes[nodeId];
  } catch (err) {
    console.error('deleteNode failed:', err);
    throw err;
  }
}

/**
 * Move node to new parent
 */
export async function moveNode(nodeId: string, newParentId: string): Promise<void> {
  const db = await getVFSDB();
  const tx = db.transaction(['nodes'], 'readwrite');
  
  try {
    const node = await tx.objectStore('nodes').get(nodeId);
    if (!node) throw new Error('Node not found');
    
    // Prevent moving to self or descendant (circular reference)
    if (await isDescendant(nodeId, newParentId)) {
      throw new Error('Cannot move folder into itself or descendant');
    }
    
    node.parentId = newParentId;
    node.modifiedAt = Date.now();
    
    await tx.objectStore('nodes').put(node);
    await tx.done;
    
    // Update store
    useStore.getState().vfs.nodes[nodeId] = node;
  } catch (err) {
    console.error('moveNode failed:', err);
    throw err;
  }
}

// Helper: Check if targetId is descendant of sourceId
async function isDescendant(sourceId: string, targetId: string): Promise<boolean> {
  const db = await getVFSDB();
  let current = targetId;
  
  while (current) {
    if (current === sourceId) return true;
    const node = await db.get('nodes', current);
    if (!node || !node.parentId) break;
    current = node.parentId;
  }
  
  return false;
}
```

#### Default Seed Data
```typescript
// src/os/vfs/seed.ts
export const DEFAULT_VFS_STRUCTURE: Partial<VFSNode>[] = [
  // Desktop root
  {
    id: 'root',
    type: 'folder',
    name: 'Desktop',
    parentId: null,
  },
  
  // CV.pdf
  {
    id: 'cv-pdf',
    type: 'file',
    name: 'CV.pdf',
    parentId: 'root',
    icon: 'pdf',
    mimeType: 'application/pdf',
    contentRef: 'cv-content',
    readonly: true,
  },
  
  // GitHub Projects (dynamic folder)
  {
    id: 'github-folder',
    type: 'folder',
    name: 'Projects',
    parentId: 'root',
    icon: 'github-folder',
  },
  
  // LinkedIn shortcut
  {
    id: 'linkedin-link',
    type: 'link',
    name: 'LinkedIn.lnk',
    parentId: 'root',
    icon: 'linkedin',
    targetUrl: 'https://linkedin.com/in/yamacbezirgan',
  },
  
  // Games folder
  {
    id: 'games-folder',
    type: 'folder',
    name: '⭐ Games',
    parentId: 'root',
    icon: 'games-folder',
  },
  
  // Snake game
  {
    id: 'snake-app',
    type: 'app',
    name: 'Snake.app',
    parentId: 'games-folder',
    icon: 'snake',
    appId: 'snake',
  },
  
  // 2048 game
  {
    id: '2048-app',
    type: 'app',
    name: '2048.app',
    parentId: 'games-folder',
    icon: '2048',
    appId: '2048',
  },
  
  // Trash folder
  {
    id: 'trash-folder',
    type: 'folder',
    name: 'Trash',
    parentId: 'root',
    icon: 'trash-full',
  },
  
  // Old site easter egg
  {
    id: 'old-site-file',
    type: 'file',
    name: 'old-site.webp',
    parentId: 'trash-folder',
    icon: 'ie-old',
    mimeType: 'application/x-legacy-site',
    targetUrl: '/legacy/index.html',
  },
  
  // Settings app
  {
    id: 'settings-app',
    type: 'app',
    name: 'Settings.app',
    parentId: 'root',
    icon: 'settings',
    appId: 'settings',
  },
];

export async function seedVFS(): Promise<void> {
  const db = await getVFSDB();
  
  // Check if already seeded
  const rootNode = await db.get('nodes', 'root');
  if (rootNode) {
    console.log('VFS already seeded, skipping');
    return;
  }
  
  const tx = db.transaction(['nodes'], 'readwrite');
  
  for (const nodeData of DEFAULT_VFS_STRUCTURE) {
    const node: VFSNode = {
      id: nodeData.id!,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      ...nodeData,
    } as VFSNode;
    
    await tx.objectStore('nodes').add(node);
  }
  
  await tx.done;
  console.log('VFS seeded with default structure');
}
```

#### Export/Import
```typescript
// src/os/vfs/transfer.ts
export async function exportVFS(): Promise<Blob> {
  const db = await getVFSDB();
  
  const nodes = await db.getAll('nodes');
  const contents = await db.getAll('contents');
  const metadata = await db.getAll('metadata');
  
  const exportData = {
    version: '1.0',
    exportedAt: Date.now(),
    nodes,
    contents: contents.map(c => ({
      ...c,
      // Convert ArrayBuffer to Base64 for JSON
      data: c.data instanceof ArrayBuffer
        ? btoa(String.fromCharCode(...new Uint8Array(c.data)))
        : c.data,
    })),
    metadata,
  };
  
  const json = JSON.stringify(exportData, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export async function importVFS(json: string, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  const data = JSON.parse(json);
  
  if (data.version !== '1.0') {
    throw new Error('Unsupported VFS export version');
  }
  
  const db = await getVFSDB();
  
  if (mode === 'replace') {
    // Clear all existing data
    await db.clear('nodes');
    await db.clear('contents');
  }
  
  const tx = db.transaction(['nodes', 'contents'], 'readwrite');
  
  // Import nodes
  for (const node of data.nodes) {
    if (mode === 'merge') {
      // Check for conflicts
      const existing = await tx.objectStore('nodes').get(node.id);
      if (existing && existing.modifiedAt > node.modifiedAt) {
        console.log('Skipping older version:', node.name);
        continue; // Keep newer local version
      }
    }
    await tx.objectStore('nodes').put(node);
  }
  
  // Import contents
  for (const content of data.contents) {
    // Convert Base64 back to ArrayBuffer if needed
    const data = typeof content.data === 'string' && content.data.startsWith('data:')
      ? Uint8Array.from(atob(content.data.split(',')[1]), c => c.charCodeAt(0)).buffer
      : content.data;
    
    await tx.objectStore('contents').put({ ...content, data });
  }
  
  await tx.done;
  
  // Reload store
  await useStore.getState().loadVFS();
}
```

**Quota Management:**
```typescript
// src/os/vfs/quota.ts
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
}> {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return { usage: 0, quota: 0, percentUsed: 0 };
  }
  
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  const percentUsed = (usage / quota) * 100;
  
  return { usage, quota, percentUsed };
}

export async function monitorQuota(): Promise<void> {
  const { percentUsed } = await checkStorageQuota();
  
  if (percentUsed > 80) {
    showNotification({
      title: 'Storage Almost Full',
      message: 'Your virtual file system is 80% full. Consider exporting and deleting old files.',
      actions: [
        { label: 'Export VFS', onClick: () => exportVFS() },
        { label: 'Open Trash', onClick: () => navigateToTrash() },
      ],
    });
  }
  
  if (percentUsed > 95) {
    showNotification({
      title: 'Storage Critical',
      message: 'Your storage is almost full. New files may fail to save.',
      level: 'error',
    });
  }
}

// Run quota check every 10 VFS operations
let operationCount = 0;
export function incrementOperationCount(): void {
  operationCount++;
  if (operationCount % 10 === 0) {
    monitorQuota();
  }
}
```

### 2.5 Build Pipeline Architecture

**Objective:** Single `npm run build:all` command that produces `dist/` containing both new portfolio AND legacy site at `/legacy/` path.

#### Build Scripts Breakdown
```json
// package.json
{
  "scripts": {
    // Development
    "dev": "vite",
    "dev:legacy": "vite --config old/vite.config.legacy.ts",
    
    // Building
    "build:legacy": "vite build --config old/vite.config.legacy.ts --outDir old/dist-legacy",
    "build:new": "vite build --outDir dist",
    
    // Post-build: Copy legacy to new site's public folder
    "postbuild:legacy": "node scripts/copy-legacy.js",
    
    // Combined build
    "build:all": "npm run build:legacy && npm run postbuild:legacy && npm run build:new",
    
    // Preview
    "preview": "vite preview",
    "preview:legacy": "vite preview --config old/vite.config.legacy.ts --outDir old/dist-legacy",
    
    // Linting & Type-checking
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    
    // Testing (future)
    "test": "vitest",
    "test:ui": "vitest --ui",
    
    // Pre-commit
    "prepare": "husky install"
  }
}
```

#### Copy Script Implementation
```javascript
// scripts/copy-legacy.js
const fs = require('fs-extra');
const path = require('path');

async function copyLegacy() {
  const source = path.resolve(__dirname, '../old/dist-legacy');
  const target = path.resolve(__dirname, '../public/legacy');
  
  try {
    console.log('📦 Copying legacy site...');
    console.log(`  Source: ${source}`);
    console.log(`  Target: ${target}`);
    
    // Remove existing legacy folder
    await fs.remove(target);
    
    // Copy legacy dist to public/legacy
    await fs.copy(source, target, {
      overwrite: true,
      errorOnExist: false,
    });
    
    console.log('✅ Legacy site copied successfully');
    
    // Verify index.html exists
    const indexExists = await fs.pathExists(path.join(target, 'index.html'));
    if (!indexExists) {
      throw new Error('Legacy index.html not found after copy');
    }
    
    // Log size
    const stats = await fs.stat(target);
    console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.error('❌ Failed to copy legacy site:', err);
    process.exit(1);
  }
}

copyLegacy();
```

#### Vite Config (New Site)
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    
    // Bundle size visualization
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    
    // PWA generation
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'wallpapers/*.webp'],
      manifest: {
        name: 'Yamaç Bezirgan - Portfolio',
        short_name: 'YB Portfolio',
        description: 'Ubuntu×XP Desktop Portfolio',
        theme_color: '#5e2ca5',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
        ],
      },
    }),
  ],
  
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-zustand': ['zustand', 'immer'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // App chunks (lazy-loaded)
          'app-pdf': ['pdfjs-dist'],
          'app-github': ['marked', 'dompurify'],
          'app-games': ['./src/apps/games/snake', './src/apps/games/2048'],
        },
      },
    },
    
    // Performance budgets
    chunkSizeWarningLimit: 500, // KB
  },
  
  resolve: {
    alias: {
      '@': '/src',
      '@os': '/src/os',
      '@ui': '/src/ui',
      '@apps': '/src/apps',
    },
  },
});
```

#### Vite Config (Legacy Site)
```typescript
// old/vite.config.legacy.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './old',
  plugins: [react()],
  
  build: {
    outDir: './dist-legacy',
    emptyOutDir: true,
    sourcemap: false, // Minimize legacy bundle
  },
  
  resolve: {
    alias: {
      '@': './old/legacy-src',
    },
  },
});
```

#### Cloudflare Pages Configuration
```toml
# wrangler.toml (or Cloudflare Pages settings)
[build]
command = "npm run build:all"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[build.environment]
NODE_VERSION = "18"
NPM_VERSION = "9"
```

```
# public/_headers
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://raw.githubusercontent.com; connect-src 'self' https://api.github.com; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'

/legacy/*
  X-Frame-Options: SAMEORIGIN
  Content-Security-Policy: default-src 'self'; frame-ancestors 'self'
```

```
# public/_redirects
/*    /index.html   200
/legacy/*   /legacy/index.html   200
```

### 2.6 Performance Strategy

**Budget Constraints:**
- Initial JS bundle (gzip): ≤180 KB
- Initial CSS bundle (gzip): ≤35 KB
- Total initial payload: ≤250 KB
- Lazy-loaded chunks: ≤50 KB each

**Optimization Techniques:**

#### Code Splitting
```typescript
// Lazy-load apps
const PdfViewer = lazy(() => import('@apps/pdf-viewer'));
const GithubViewer = lazy(() => import('@apps/github-viewer'));
const SnakeGame = lazy(() => import('@apps/games/snake'));

// Lazy-load heavy libraries
const loadPDFJS = () => import('pdfjs-dist');
const loadMarked = () => import('marked');
const loadDOMPurify = () => import('dompurify');
```

#### Transform-Based Animations
```typescript
// Window drag handler
function onWindowDrag(e: MouseEvent, windowId: string) {
  // ❌ BAD: Causes layout thrashing
  // windowElement.style.left = e.clientX + 'px';
  // windowElement.style.top = e.clientY + 'px';
  
  // ✅ GOOD: GPU-accelerated, no layout
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;
  windowElement.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
}
```

#### RAF-Based Batch Updates
```typescript
// src/os/perf/rafScheduler.ts
class RAFScheduler {
  private pending = new Map<string, () => void>();
  private rafId: number | null = null;
  
  schedule(key: string, callback: () => void) {
    this.pending.set(key, callback);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }
  
  flush() {
    this.pending.forEach(cb => cb());
    this.pending.clear();
    this.rafId = null;
  }
}

export const rafScheduler = new RAFScheduler();

// Usage in window drag
let pendingPosition: { x: number; y: number } | null = null;

function onMouseMove(e: MouseEvent) {
  pendingPosition = { x: e.clientX, y: e.clientY };
  
  rafScheduler.schedule('window-drag', () => {
    if (pendingPosition) {
      updateWindowBounds(windowId, pendingPosition);
      pendingPosition = null;
    }
  });
}
```

#### Virtual Scrolling for Large Lists
```typescript
// src/ui/VirtualList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function FileList({ items }: { items: VFSNode[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Row height
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <FileRow node={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Image Optimization
```typescript
// vite.config.ts - imagetools plugin
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('responsive')) {
          return new URLSearchParams({
            format: 'avif;webp;jpg',
            w: '320;640;1024;1920',
            as: 'picture',
          });
        }
        return new URLSearchParams();
      },
    }),
  ],
});

// Usage in components
import wallpaper from '@/assets/wallpaper.jpg?responsive';

<picture>
  {wallpaper.sources.avif && <source srcSet={wallpaper.sources.avif} type="image/avif" />}
  {wallpaper.sources.webp && <source srcSet={wallpaper.sources.webp} type="image/webp" />}
  <img src={wallpaper.sources.jpg} alt="Wallpaper" />
</picture>
```

#### Performance Measurement
```typescript
// src/os/perf/measure.ts
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  performance.mark(`${name}-start`);
  const result = fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
  
  const measure = performance.getEntriesByName(name)[0];
  if (measure.duration > 100) {
    console.warn(`[PERF] ${name} took ${measure.duration.toFixed(2)}ms`);
  }
  
  return result;
}

// Async version
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  performance.mark(`${name}-start`);
  try {
    return await fn();
  } finally {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
}

// Usage
const nodes = await measureAsync('VFS-Load', () => loadVFSNodes());
```

**Web Vitals Monitoring:**
```typescript
// src/os/analytics/webVitals.ts
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(metric => sendToAnalytics('CLS', metric.value));
  onFCP(metric => sendToAnalytics('FCP', metric.value));
  onINP(metric => sendToAnalytics('INP', metric.value));
  onLCP(metric => sendToAnalytics('LCP', metric.value));
  onTTFB(metric => sendToAnalytics('TTFB', metric.value));
}

function sendToAnalytics(metricName: string, value: number) {
  // Privacy-friendly analytics (Plausible, Umami, or self-hosted)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', JSON.stringify({ metricName, value }));
  }
}
```

### 2.7 Security Architecture

**Threat Model:**
- XSS via Markdown rendering (GitHub READMEs)
- Clickjacking via iframe embeds
- CSRF (not applicable - no server-side state)
- Data exfiltration via malicious links
- CSP bypass attempts

#### Content Security Policy
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://raw.githubusercontent.com https://avatars.githubusercontent.com;
  connect-src 'self' https://api.github.com;
  frame-src 'self';
  frame-ancestors 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

**Notes:**
- `script-src 'unsafe-inline'`: Required for Vite HMR in dev (removed in prod via nonce)
- `img-src github`: GitHub avatars and README images
- `frame-src 'self'`: Only same-origin iframes (legacy site)
- `frame-ancestors 'self'`: Prevent portfolio being iframed by others

#### DOMPurify Configuration
```typescript
// src/os/security/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeMarkdown(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote',
      'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):)/i,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    ADD_ATTR: ['target', 'rel'],
    ADD_URI_SAFE_ATTR: ['href', 'src'],
  });
}

// Post-process: Add noopener/noreferrer to external links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    const href = node.getAttribute('href')!;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }
});
```

#### Iframe Sandbox
```typescript
// src/apps/browser/Browser.tsx
export function Browser({ url }: { url: string }) {
  const [canEmbed, setCanEmbed] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Try to detect if URL allows iframe embedding
    fetch(url, { method: 'HEAD' })
      .then(res => {
        const xfo = res.headers.get('X-Frame-Options');
        const csp = res.headers.get('Content-Security-Policy');
        
        if (xfo && xfo !== 'ALLOWALL') {
          setCanEmbed(false);
        } else if (csp && csp.includes('frame-ancestors')) {
          setCanEmbed(false);
        } else {
          setCanEmbed(true);
        }
      })
      .catch(() => setCanEmbed(false));
  }, [url]);
  
  if (canEmbed === false) {
    return (
      <div className="browser-fallback">
        <p>This site cannot be embedded due to security restrictions.</p>
        <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
          Open in New Tab
        </button>
      </div>
    );
  }
  
  return (
    <iframe
      src={url}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      referrerPolicy="no-referrer"
      title="Browser Window"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
```

#### Dependency Security
```json
// .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 0 * * 1' # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm audit --audit-level=moderate
      - run: npm outdated
      
  cve-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'
```

---

## 3. Feature Epics (Detailed)

### Epic 0: Legacy Archive & Build System (NEW)

**Owner:** Infrastructure  
**Priority:** P0 (Blocking)  
**Estimated Effort:** 1 week  
**Dependencies:** None

**Objective:** Safely archive existing portfolio site and integrate it into new build pipeline so it can be served at `/legacy/` and accessed via Trash easter egg.

**User Stories:**
- As a developer, I want the old site preserved so I can reference it or roll back if needed
- As a visitor, I want to discover the old site in the Trash folder as an easter egg
- As a maintainer, I want a single build command that produces both old and new sites

**Acceptance Criteria:**
1. ✅ All existing code moved to `old/` directory with `legacy-*` prefix
2. ✅ Legacy site builds independently: `npm run build:legacy` produces `old/dist-legacy/`
3. ✅ Build pipeline copies legacy dist to `public/legacy/` before new build
4. ✅ `npm run build:all` produces `dist/` with both sites
5. ✅ Legacy site accessible at `/legacy/index.html` in deployed version
6. ✅ Trash folder contains `old-site.webp` that opens legacy site in iframe
7. ✅ CSP headers allow same-origin iframe (legacy site)
8. ✅ Fallback to new tab if iframe blocked

**Technical Tasks:**
- [ ] Create `old/` directory structure
- [ ] Configure `old/vite.config.legacy.ts`
- [ ] Implement `scripts/copy-legacy.js`
- [ ] Update root `package.json` scripts
- [ ] Test full build pipeline locally
- [ ] Configure Cloudflare Pages build command
- [ ] Add CSP headers for `/legacy/*` path
- [ ] Implement Trash easter egg UI
- [ ] Test iframe embedding in all browsers

**Risks & Mitigations:**
| Risk | Mitigation |
|------|------------|
| Legacy build breaks | Pin legacy dependencies, separate package.json |
| CSP blocks iframe | Explicit `frame-ancestors 'self'` for legacy path |
| Build time doubles | Parallelize builds (npm-run-all) |

**Definition of Done:**
- [ ] Legacy site viewable at `/legacy/index.html`
- [ ] Trash easter egg opens legacy site in window
- [ ] No CSP violations in console
- [ ] Build time <5 minutes
- [ ] Documentation in README.md

---

### Epic 1: Desktop Shell & Window Manager

**Owner:** UI/UX  
**Priority:** P0 (MVP Critical)  
**Estimated Effort:** 2-3 weeks  
**Dependencies:** Epic 0 (build system), Epic 2 (VFS for icon persistence)

**Objective:** Create a functional desktop environment with draggable icons, multi-window management, taskbar, and context menus that feels like a real OS.

**User Stories:**
- As a user, I want to drag desktop icons and have their positions saved
- As a user, I want to open multiple windows, move/resize them, and switch between them
- As a user, I want to minimize windows to taskbar and restore them
- As a user, I want to snap windows to screen edges (Windows-style)
- As a user, I want right-click context menus for creating folders/files

**Acceptance Criteria:**
1. ✅ Desktop grid system (10x6 cols/rows on 1920x1080)
2. ✅ Icon drag-and-drop with grid snapping (<16ms frame time)
3. ✅ Icon positions persist to localStorage
4. ✅ Multi-select icons (Ctrl+click, Shift+click, drag-select)
5. ✅ Window drag with transform-based positioning (INP <100ms)
6. ✅ Window resize with 8-direction handles
7. ✅ Window minimize/maximize/restore with animations
8. ✅ Window focus management (z-index auto-increment)
9. ✅ Taskbar with active window list
10. ✅ Context menus (right-click on desktop, icons, windows)
11. ✅ Window snap zones (drag to edge = half-screen)

**Technical Implementation:**

#### Desktop Grid System
```typescript
// src/ui/Desktop.tsx
export function Desktop() {
  const { layout, updateIconPosition, snapToGrid } = useStore(s => s.desktop);
  const vfsNodes = useStore(s => s.vfs.nodes);
  
  // Desktop root nodes (parentId === 'root')
  const desktopNodes = Object.values(vfsNodes).filter(n => n.parentId === 'root');
  
  return (
    <div className="desktop" style={{ 
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
    }}>
      <div className="desktop-grid">
        {desktopNodes.map(node => (
          <DesktopIcon
            key={node.id}
            node={node}
            position={layout[node.id] || { x: 0, y: 0 }}
            onDragEnd={(pos) => {
              updateIconPosition(node.id, pos);
              snapToGrid(node.id);
            }}
          />
        ))}
      </div>
      
      <WindowManager />
      <Taskbar />
      <ContextMenuProvider />
    </div>
  );
}
```

#### Icon Drag & Drop
```typescript
// src/ui/DesktopIcon.tsx
export function DesktopIcon({ node, position, onDragEnd }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      
      rafScheduler.schedule(`icon-drag-${node.id}`, () => {
        onDragEnd(newPos);
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  return (
    <div
      className="desktop-icon"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => openNode(node)}
    >
      <img src={getIconSrc(node.icon)} alt={node.name} />
      <span>{node.name}</span>
    </div>
  );
}
```

#### Window Component
```typescript
// src/ui/Window.tsx
export function Window({ windowState }: { windowState: WindowState }) {
  const { focusWindow, updateBounds, closeWindow } = useStore(s => s.windows);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection | null>(null);
  
  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // Ignore button clicks
    setIsDragging(true);
    focusWindow(windowState.id);
  };
  
  // Transform-based drag
  useEffect(() => {
    if (!isDragging) return;
    
    let startX = 0, startY = 0;
    const startBounds = { ...windowState.bounds };
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      rafScheduler.schedule(`window-drag-${windowState.id}`, () => {
        updateBounds(windowState.id, {
          x: startBounds.x + deltaX,
          y: startBounds.y + deltaY,
        });
      });
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    const init = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
    };
    
    window.addEventListener('mousedown', init, { once: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div
      className={`window ${windowState.state}`}
      style={{
        position: 'fixed',
        left: windowState.bounds.x,
        top: windowState.bounds.y,
        width: windowState.bounds.width,
        height: windowState.bounds.height,
        zIndex: windowState.zIndex,
      }}
      onClick={() => focusWindow(windowState.id)}
    >
      <div className="titlebar" onMouseDown={handleTitlebarMouseDown}>
        <span className="title">{windowState.title}</span>
        <div className="controls">
          <button onClick={() => minimizeWindow(windowState.id)}>−</button>
          <button onClick={() => maximizeWindow(windowState.id)}>□</button>
          <button onClick={() => closeWindow(windowState.id)}>×</button>
        </div>
      </div>
      
      <div className="window-content">
        <AppLoader appId={windowState.appId} windowId={windowState.id} />
      </div>
      
      {/* Resize handles */}
      <div className="resize-handles">
        {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(dir => (
          <div
            key={dir}
            className={`resize-handle resize-${dir}`}
            onMouseDown={(e) => handleResizeStart(e, dir as ResizeDirection)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Performance Targets:**
- Icon drag: 60fps (16ms per frame)
- Window drag: INP p95 <100ms
- Window open/close animation: <300ms
- Multi-select 100 icons: <50ms

**Testing Strategy:**
- Unit tests: Zustand store actions
- Integration tests: Window focus, z-index management
- E2E tests: Full drag-drop flow
- Performance tests: Chrome DevTools recording

**Definition of Done:**
- [ ] Desktop renders 40+ icons without jank
- [ ] Window drag/resize smooth at 60fps
- [ ] All acceptance criteria met
- [ ] Lighthouse Performance >90
- [ ] No console errors

---

### Epic 2: Virtual File System (VFS) & Persistence

*[Detailed in Section 2.4 - VFS Architecture]*

**Key Additions:**
- Undo/Redo system (Command pattern)
- File search (fuzzy matching)
- Clipboard operations (copy/paste)
- Multi-file operations (bulk delete, move)

---

### Epic 3: Applications Suite

#### App 1: PDF Viewer

**Technical Stack:** PDF.js (lazy-loaded)

**Features:**
- Page navigation (prev/next, jump to page)
- Zoom controls (50%-200%)
- Download button
- Print button
- Search in PDF (Ctrl+F)

**Performance Target:** First render p95 <1200ms (3G Fast network, mid-tier device)

**Implementation:**
```typescript
// src/apps/pdf-viewer/PdfViewer.tsx
import { lazy, Suspense } from 'react';

const PDFJSViewer = lazy(() => import('./PDFJSViewer'));

export function PdfViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <Suspense fallback={<PDFSkeleton />}>
      <PDFJSViewer url={fileUrl} />
    </Suspense>
  );
}

// Separate component to keep PDF.js lazy-loaded
function PDFJSViewer({ url }: { url: string }) {
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  useEffect(() => {
    const loadPDF = async () => {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
      
      const loadedPDF = await pdfjs.getDocument(url).promise;
      setPDF(loadedPDF);
    };
    
    measureAsync('PDF-Load', loadPDF);
  }, [url]);
  
  // Render pages, zoom, navigation...
}
```

---

#### App 2: GitHub Viewer

**Features:**
- Public repos list (sorted by updated_at)
- Repo cards (name, description, stars, language)
- README preview modal (Markdown rendered, sanitized)
- "Open on GitHub" button
- Offline support (ETag cache)

**API Integration:**
```typescript
// src/apps/github-viewer/api.ts
const GITHUB_USERNAME = 'ymcbzrgn';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function fetchRepos(): Promise<Repo[]> {
  const cacheKey = `github-repos-${GITHUB_USERNAME}`;
  const cached = await db.get('apiCache', cacheKey);
  
  // Check cache freshness
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('[GitHub] Using cached repos');
    return cached.data;
  }
  
  // Fetch with ETag
  const headers: HeadersInit = {};
  if (cached?.etag) {
    headers['If-None-Match'] = cached.etag;
  }
  
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });
    
    if (res.status === 304) {
      console.log('[GitHub] ETag match, using cache');
      return cached.data;
    }
    
    if (!res.ok) {
      if (res.status === 403) {
        // Rate limit hit
        console.warn('[GitHub] Rate limit exceeded, using cache');
        if (cached) return cached.data;
        throw new Error('Rate limit exceeded and no cache available');
      }
      throw new Error(`GitHub API error: ${res.status}`);
    }
    
    const data = await res.json();
    const etag = res.headers.get('ETag');
    
    // Update cache
    await db.put('apiCache', {
      key: cacheKey,
      data,
      etag,
      timestamp: Date.now(),
    });
    
    return data;
  } catch (err) {
    console.error('[GitHub] Fetch failed:', err);
    if (cached) {
      console.log('[GitHub] Returning stale cache due to error');
      return cached.data;
    }
    throw err;
  }
}
```

**README Rendering:**
```typescript
// src/apps/github-viewer/README.tsx
import { marked } from 'marked';
import { sanitizeMarkdown } from '@/os/security/sanitize';

export function READMEPreview({ repo }: { repo: Repo }) {
  const [html, setHTML] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadREADME = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
          headers: { Accept: 'application/vnd.github.v3.raw' },
        });
        
        if (!res.ok) throw new Error('README not found');
        
        const markdown = await res.text();
        const rawHTML = marked(markdown);
        const cleanHTML = sanitizeMarkdown(rawHTML);
        
        setHTML(cleanHTML);
      } catch (err) {
        setHTML('<p>README not available</p>');
      } finally {
        setLoading(false);
      }
    };
    
    loadREADME();
  }, [repo]);
  
  if (loading) return <Spinner />;
  
  return (
    <div
      className="readme-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

---

#### App 3: Browser (Iframe/Fallback)

**Features:**
- Address bar with URL input
- Try iframe first, fallback to preview card if blocked
- Loading indicator
- Error handling

**Implementation:**
```typescript
// src/apps/browser/Browser.tsx
export function Browser({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [loading, setLoading] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  
  const handleNavigate = (targetUrl: string) => {
    setUrl(targetUrl);
    setLoading(true);
    setEmbedFailed(false);
  };
  
  const handleIframeError = () => {
    setEmbedFailed(true);
    setLoading(false);
  };
  
  if (embedFailed) {
    return (
      <div className="browser-fallback">
        <h3>Cannot Embed This Site</h3>
        <p>The website you're trying to visit doesn't allow embedding.</p>
        <PreviewCard url={url} />
        <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
          Open in New Tab
        </button>
      </div>
    );
  }
  
  return (
    <div className="browser">
      <div className="address-bar">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNavigate(url)}
          placeholder="Enter URL..."
        />
        <button onClick={() => handleNavigate(url)}>Go</button>
      </div>
      
      {loading && <div className="loading-indicator">Loading...</div>}
      
      <iframe
        src={url}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={() => setLoading(false)}
        onError={handleIframeError}
        style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }}
      />
    </div>
  );
}
```

---

#### App 4 & 5: Games (Snake, 2048)

**Performance Requirements:**
- 60 FPS gameplay (p95 frame time <20ms)
- Pause on window blur
- High scores in localStorage
- Keyboard controls (arrow keys)

**Snake Game Architecture:**
```typescript
// src/apps/games/snake/Snake.tsx
export function SnakeGame() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game loop
  useEffect(() => {
    if (isPaused) return;
    
    const intervalId = setInterval(() => {
      setGameState(state => updateGameState(state));
    }, 100); // 10 FPS game logic
    
    return () => clearInterval(intervalId);
  }, [isPaused]);
  
  // Rendering loop (separate from game logic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw snake
      gameState.snake.forEach(segment => {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
      });
      
      // Draw food
      ctx.fillStyle = '#F44336';
      ctx.fillRect(gameState.food.x * 20, gameState.food.y * 20, 18, 18);
      
      // Continue loop
      if (!isPaused) {
        requestAnimationFrame(render);
      }
    };
    
    const rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, isPaused]);
  
  // Auto-pause on window blur
  useEffect(() => {
    const handleBlur = () => setIsPaused(true);
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setGameState(state => changeDirection(state, e.key));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="snake-game">
      <div className="score">Score: {gameState.score}</div>
      <canvas ref={canvasRef} width={400} height={400} />
      {isPaused && <div className="pause-overlay">Paused</div>}
    </div>
  );
}
```

---

#### App 6: Settings

**Features:**
- Theme selector (Ubuntu Light, Ubuntu Dark, XP Classic, High Contrast)
- Mode toggle (Desktop/Mobile/Auto)
- Wallpaper picker (presets + custom upload)
- Icon pack selector
- Language selector (future)
- Export/Import VFS button

---

### Epic 4: Mobile UX (Adaptive Design)

**Philosophy:** Not responsive (scaling), but adaptive (different UX).

**Mobile Components:**
- **Launcher:** Grid of icons (4x6 on typical phone)
- **Sheet:** Fullscreen app container with header
- **App Switcher:** Horizontal scroll of app thumbnails
- **Context Menu:** Bottom sheet instead of popup

**Device Detection:**
```typescript
// src/os/device.ts
export function useDeviceMode() {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  
  useEffect(() => {
    const updateMode = () => {
      const isMobile = window.innerWidth < 768 || 
                       ('ontouchstart' in window && window.innerWidth < 1024);
      setMode(isMobile ? 'mobile' : 'desktop');
    };
    
    updateMode();
    window.addEventListener('resize', updateMode);
    return () => window.removeEventListener('resize', updateMode);
  }, []);
  
  return mode;
}
```

**Launcher Implementation:**
```typescript
// src/ui/mobile/Launcher.tsx
export function Launcher() {
  const vfsNodes = useStore(s => s.vfs.nodes);
  const { openWindow } = useStore(s => s.windows);
  
  const desktopNodes = Object.values(vfsNodes).filter(n => n.parentId === 'root');
  
  const handleIconClick = (node: VFSNode) => {
    openWindow({
      appId: getAppIdForNode(node),
      title: node.name,
      nodeId: node.id,
      state: 'fullscreen', // Mobile always fullscreen
    });
  };
  
  const handleIconLongPress = (node: VFSNode) => {
    showContextMenu({
      items: [
        { label: 'Open', onClick: () => handleIconClick(node) },
        { label: 'Rename', onClick: () => startRename(node.id) },
        { label: 'Delete', onClick: () => deleteNode(node.id) },
      ],
    });
  };
  
  return (
    <div className="launcher">
      <div className="launcher-grid">
        {desktopNodes.map(node => (
          <LauncherIcon
            key={node.id}
            node={node}
            onClick={() => handleIconClick(node)}
            onLongPress={() => handleIconLongPress(node)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Sheet Component:**
```typescript
// src/ui/mobile/Sheet.tsx
import { useGesture } from '@use-gesture/react';

export function Sheet({ children, onClose }: Props) {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));
  
  const bind = useGesture({
    onDrag: ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      // Swipe down to close
      if (!down && my > 100 && dy > 0) {
        onClose();
      } else {
        api.start({ y: down ? my : 0, immediate: down });
      }
    },
  });
  
  return (
    <animated.div
      className="sheet"
      style={{
        transform: y.to(yVal => `translateY(${Math.max(yVal, 0)}px)`),
      }}
      {...bind()}
    >
      <div className="sheet-handle" />
      <div className="sheet-content">
        {children}
      </div>
    </animated.div>
  );
}
```

---

### Epic 5: PWA & Offline Support

**Manifest:**
```json
// public/manifest.webmanifest
{
  "name": "Yamaç Bezirgan - Portfolio",
  "short_name": "YB Portfolio",
  "description": "Ubuntu×XP Desktop-inspired Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#5e2ca5",
  "theme_color": "#5e2ca5",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["portfolio", "personal", "entertainment"],
  "shortcuts": [
    {
      "name": "View CV",
      "url": "/?open=cv",
      "icons": [{ "src": "/icons/cv-shortcut.png", "sizes": "96x96" }]
    },
    {
      "name": "GitHub Projects",
      "url": "/?open=github",
      "icons": [{ "src": "/icons/github-shortcut.png", "sizes": "96x96" }]
    }
  ]
}
```

**Service Worker Strategy:**
```typescript
// Service Worker (via Workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// GitHub API: Cache-first with 1-hour expiration
registerRoute(
  /^https:\/\/api\.github\.com\//,
  new CacheFirst({
    cacheName: 'github-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

// Images: Cache-first with 30-day expiration
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// HTML: Network-first (always try fresh)
registerRoute(
  /\.html$/,
  new NetworkFirst({
    cacheName: 'html',
    networkTimeoutSeconds: 3,
  })
);
```

---

### Epic 6: Performance & Observability

**Lighthouse CI Integration:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:8080
          uploadArtifacts: true
          temporaryPublicStorage: true
          
          # Budget assertions
          budgetPath: ./lighthouse-budget.json
```

**Budget File:**
```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "interactive", "budget": 3000 },
      { "metric": "first-contentful-paint", "budget": 1500 },
      { "metric": "largest-contentful-paint", "budget": 2000 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 180 },
      { "resourceType": "stylesheet", "budget": 35 },
      { "resourceType": "image", "budget": 500 },
      { "resourceType": "total", "budget": 800 }
    ],
    "resourceCounts": [
      { "resourceType": "third-party", "budget": 5 }
    ]
  }
]
```

**Real User Monitoring:**
```typescript
// src/os/analytics/rum.ts
import { onCLS, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

export function initRUM() {
  // Collect Web Vitals
  onCLS(metric => sendMetric('CLS', metric.value, metric.rating));
  onFID(metric => sendMetric('FID', metric.value, metric.rating));
  onINP(metric => sendMetric('INP', metric.value, metric.rating));
  onLCP(metric => sendMetric('LCP', metric.value, metric.rating));
  onTTFB(metric => sendMetric('TTFB', metric.value, metric.rating));
}

function sendMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
  // Privacy-friendly analytics (no PII)
  if (navigator.sendBeacon) {
    const data = JSON.stringify({
      name,
      value: Math.round(value),
      rating,
      url: window.location.pathname,
      timestamp: Date.now(),
      // No user ID, no session ID
    });
    
    navigator.sendBeacon('/api/metrics', data);
  }
}
```

---

### Epic 7: Security & Compliance

*[Detailed in Section 2.7 - Security Architecture]*

**Additional Considerations:**

**Dependency Scanning:**
```yaml
# .github/workflows/dependency-review.yml
name: Dependency Review

on: [pull_request]

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: moderate
```

**License Compliance:**
```json
// package.json
{
  "scripts": {
    "license-check": "license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC' --summary"
  }
}
```

---

## 4. Data Models & Schemas

### VFS Node (Detailed)
```typescript
export interface VFSNode {
  // Identity
  id: string;                    // UUID v4
  type: 'folder' | 'file' | 'link' | 'app';
  name: string;                  // Display name (user-editable)
  
  // Hierarchy
  parentId: string | null;       // null = root (Desktop)
  
  // Metadata
  icon?: string;                 // Icon identifier (e.g., 'folder', 'pdf', 'snake')
  createdAt: number;             // Unix timestamp (ms)
  modifiedAt: number;            // Unix timestamp (ms)
  accessedAt?: number;           // Last access (for cleanup)
  
  // File-specific
  size?: number;                 // Bytes (for files)
  mimeType?: string;             // MIME type (e.g., 'text/plain', 'application/pdf')
  contentRef?: string;           // Reference to VFSContent.id
  encoding?: 'utf8' | 'base64';  // Text encoding
  
  // Link-specific
  targetUrl?: string;            // External URL (http/https)
  targetNodeId?: string;         // Internal node reference (for aliases)
  
  // App-specific
  appId?: string;                // Registered app identifier (e.g., 'pdf-viewer', 'snake')
  appConfig?: Record<string, any>; // App-specific configuration
  
  // UI/Layout
  order?: number;                // Sort order within parent (default: createdAt)
  color?: string;                // Custom color/theme
  tags?: string[];               // User-defined tags (for search)
  
  // Permissions (future-proofing)
  readonly?: boolean;            // Prevent edits
  hidden?: boolean;              // Hide from normal view
  starred?: boolean;             // User favorite
}
```

### Window State (Detailed)
```typescript
export interface WindowState {
  // Identity
  id: string;                    // Unique window instance ID
  appId: string;                 // App identifier (e.g., 'pdf-viewer')
  nodeId?: string;               // VFS node being displayed (optional)
  
  // Display
  title: string;                 // Window title
  icon?: string;                 // Titlebar icon
  
  // Geometry
  bounds: {
    x: number;                   // Left position (px)
    y: number;                   // Top position (px)
    width: number;               // Width (px)
    height: number;              // Height (px)
  };
  
  // State
  state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
  zIndex: number;                // Stacking order (auto-managed)
  
  // Constraints
  minWidth?: number;             // Minimum width (default: 200)
  minHeight?: number;            // Minimum height (default: 150)
  maxWidth?: number;             // Maximum width (default: screen width)
  maxHeight?: number;            // Maximum height (default: screen height)
  resizable?: boolean;           // Allow resize (default: true)
  movable?: boolean;             // Allow drag (default: true)
  
  // App-specific metadata
  meta?: Record<string, any>;    // Any app-specific data
  
  // Lifecycle
  createdAt: number;             // When window opened
  lastFocusedAt?: number;        // Last focus timestamp
}
```

### Settings Schema
```typescript
export interface Settings {
  // Theme
  theme: 'ubuntu-light' | 'ubuntu-dark' | 'xp-classic' | 'high-contrast';
  customTheme?: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  
  // Mode
  mode: 'desktop' | 'mobile' | 'auto';
  modeLock?: boolean;            // Prevent auto-switching
  
  // Wallpaper
  wallpaper: string;             // Preset ID or custom URL
  wallpaperFit: 'cover' | 'contain' | 'stretch';
  
  // Icon Pack
  iconPack: 'ubuntu' | 'xp' | 'macos' | 'custom';
  
  // Language
  language: 'en' | 'tr';
  
  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Privacy
  analytics: boolean;
  crashReports: boolean;
  
  // Advanced
  showHiddenFiles: boolean;
  enableExperimentalFeatures: boolean;
}
```

---

## 5. Integration Points

### GitHub API

**Endpoints Used:**
- `GET /users/{username}/repos` - List public repos
- `GET /repos/{owner}/{repo}/readme` - Get README content
- `GET /repos/{owner}/{repo}` - Get repo details

**Authentication:** None (public API, 60 req/hour)

**Rate Limiting Strategy:**
1. ETag caching (304 responses don't count toward limit)
2. Cache-first fallback on 403
3. Exponential backoff on failures
4. User-visible "Refresh" button with cooldown

**Error Handling:**
```typescript
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      
      if (res.status === 403) {
        // Check if rate limit
        const remaining = res.headers.get('X-RateLimit-Remaining');
        if (remaining === '0') {
          throw new RateLimitError('GitHub API rate limit exceeded');
        }
      }
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (err) {
      lastError = err as Error;
      console.warn(`[Retry ${i + 1}/${maxRetries}] ${err.message}`);
      
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}
```

### Cloudflare Pages

**Deployment Trigger:** Git push to `main` branch

**Build Command:** `npm run build:all`

**Output Directory:** `dist`

**Environment Variables:**
- `NODE_VERSION=18`
- `NPM_VERSION=9`
- `VITE_API_BASE_URL` (future: if backend added)

**Preview Deployments:** Automatic for PRs

**Custom Domain:** TBD (e.g., yamacinbezirgan.dev)

### IndexedDB

**Database Name:** `vfs-storage`

**Version:** 1

**Stores:**
- `nodes` - VFS nodes
- `contents` - File contents
- `metadata` - System metadata

**Upgrade Strategy:**
```typescript
// Future version migration
openDB('vfs-storage', 2, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 2) {
      // Migration from v1 to v2
      const nodeStore = transaction.objectStore('nodes');
      nodeStore.createIndex('by-tags', 'tags', { multiEntry: true });
    }
  },
});
```

### localStorage

**Keys:**
- `os-storage` - Zustand persisted state (desktop layout, settings)
- `game-scores-snake` - Snake high scores
- `game-scores-2048` - 2048 high scores
- `vfs-export-history` - Export timestamps (for backup reminders)

**Size Management:**
- Monitor usage: `localStorage.length`
- Cleanup old game scores (keep top 10)
- Warn at 80% capacity

---

## 6. Implementation Strategy

**Reference:** See `ROADMAP.md` for detailed phase breakdown and atomic tasks.

**High-Level Phases:**

### MVP (Faz 1) - Weeks 1-3
**Goal:** Archive legacy site, build new OS core, basic window management, VFS foundations.

**Deliverables:**
- ✅ Legacy site at `/legacy/`
- ✅ Desktop shell with draggable icons
- ✅ Window manager (open, close, drag, resize)
- ✅ VFS CRUD operations
- ✅ localStorage persistence
- ✅ Basic build pipeline

**Success Criteria:**
- Legacy site accessible via Trash easter egg
- 3+ windows can be opened/closed/dragged without jank
- VFS operations persist across page reloads
- Build completes in <5 minutes

---

### V1.0 (Faz 2) - Weeks 4-7
**Goal:** Complete all apps, mobile UX, PWA, Cloudflare deployment.

**Deliverables:**
- ✅ All apps (PDF, GitHub, Browser, Games, Settings)
- ✅ Mobile launcher and sheets
- ✅ PWA manifest + service worker
- ✅ Theme system (3 themes)
- ✅ Production deployment on Cloudflare Pages
- ✅ CSP headers and security hardening

**Success Criteria:**
- All acceptance criteria for Epics 1-7 met
- Lighthouse: Performance >90, PWA >90, Accessibility >90
- LCP p95 <2s, INP p95 <100ms, CLS p95 <0.1
- Mobile UX functional on iOS Safari and Chrome Android

---

### V1.1 (Faz 3) - Weeks 8-10
**Goal:** Performance optimization, analytics, advanced features, polish.

**Deliverables:**
- ✅ Bundle size optimization (<180KB)
- ✅ Image optimization (AVIF/WebP)
- ✅ Analytics integration (privacy-friendly)
- ✅ Error tracking (Sentry or self-hosted)
- ✅ Advanced features (keyboard shortcuts, file search, undo/redo)
- ✅ Accessibility audit (WCAG 2.1 AA)

**Success Criteria:**
- Web Vitals p95 all green
- JS bundle <180KB gzip
- 0 critical accessibility issues
- Error rate <1%
- 30-day uptime >99.9%

---

## 7. Quality Assurance & Testing

### Testing Strategy

**Unit Tests (Vitest):**
- Zustand store actions
- VFS CRUD operations
- Utility functions (sanitize, format, etc.)
- Target: >80% coverage for business logic

**Integration Tests:**
- Window focus management
- VFS tree operations
- GitHub API caching
- Target: Critical paths covered

**E2E Tests (Playwright):**
- Desktop icon drag-and-drop
- Window open → interact → close flow
- GitHub viewer: list → README → open link
- Mobile launcher flow
- Target: Happy paths + error scenarios

**Visual Regression (Percy or Chromatic):**
- Theme variants
- Window states (normal, minimized, maximized)
- Mobile vs desktop layouts

**Performance Tests:**
- Lighthouse CI on every PR
- Bundle size budgets enforced
- Web Vitals thresholds
- Load testing: 100 concurrent users (optional)

**Accessibility Tests:**
- axe-core automated scan
- Manual screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation test
- Color contrast validation

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build:all
      
      # Bundle size check
      - name: Check bundle size
        run: |
          size=$(du -sb dist | awk '{print $1}')
          if [ $size -gt 512000 ]; then
            echo "Bundle too large: $size bytes"
            exit 1
          fi
          
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: http://localhost:8080
          budgetPath: ./lighthouse-budget.json
          
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm audit --audit-level=high
      - run: npm run license-check
```

---

## 8. Risk Management

### Risk Matrix

| Risk | Likelihood | Impact | Mitigation | Early Warning |
|------|-----------|--------|------------|---------------|
| **IndexedDB quota exceeded (mobile Safari)** | High | High | Compression (pako), cleanup job, export prompt | Usage >50% |
| **GitHub API rate limit** | Medium | Medium | ETag cache, backoff, offline fallback | Remaining <10 |
| **CSP blocks legitimate resources** | Medium | High | Strict whitelist, thorough testing | Console violations |
| **Performance budget overrun** | Medium | High | Code splitting, lazy loading, bundle analysis | Build warnings |
| **Mobile Safari gesture conflicts** | Medium | Low | `touch-action: none`, custom gesture lib | User reports |
| **Legacy site iframe blocked** | Low | Low | Fallback to new tab (already handled) | CSP reports |
| **VFS data corruption** | Low | Critical | Idempotent transactions, export backups | DB errors |
| **Accessibility gaps** | Medium | Medium | Early audits, automated checks | Lighthouse score <90 |

### Contingency Plans

**If IndexedDB quota exceeded:**
1. Show immediate warning modal
2. Offer export VFS as JSON
3. Suggest deleting old files/trash
4. If quota still exceeded, disable VFS writes (read-only mode)

**If GitHub API rate limited:**
1. Switch to cache-first mode
2. Show banner: "Using cached data, refresh in X minutes"
3. Disable auto-refresh
4. Offer manual refresh button with cooldown timer

**If bundle size exceeds budget:**
1. Build fails in CI
2. PR blocked until fixed
3. Team reviews bundle analyzer report
4. Options: remove feature, lazy-load, or increase budget (last resort)

**If critical bug in production:**
1. Rollback via Cloudflare Pages (instant)
2. Fix in hotfix branch
3. Fast-track testing
4. Deploy with higher priority
5. Postmortem: update CLAUDE.md with lesson learned

---

## 9. Appendices

### A. Glossary

**CSP (Content Security Policy):** HTTP header that controls which resources a browser can load, preventing XSS attacks.

**ETag:** HTTP header used for cache validation; allows conditional requests (304 Not Modified).

**Frame-Ancestors:** CSP directive that controls which origins can embed a page in an iframe.

**Idempotent:** An operation that produces the same result regardless of how many times it's executed.

**IndexedDB:** Browser API for storing structured data; supports transactions and indexes.

**INP (Interaction to Next Paint):** Web Vital measuring responsiveness; time from user interaction to visual feedback.

**LCP (Largest Contentful Paint):** Web Vital measuring loading performance; time to largest element render.

**PWA (Progressive Web App):** Web app that behaves like a native app (offline, install prompt, etc.).

**RAF (requestAnimationFrame):** Browser API for scheduling animations at optimal timing (60fps).

**VFS (Virtual File System):** In-memory file system abstraction backed by persistent storage (IndexedDB).

**Web Vitals:** Set of metrics (LCP, INP, CLS) measuring real-world user experience.

---

### B. Open Questions

*Track answers in CLAUDE.md as decisions are made*

1. **React vs Preact:** Use React 18 (mevcut kod compatibility) or Preact (smaller bundle)?
   - **Decision:** TBD
   - **Impact:** 10-30KB bundle size difference

2. **Legacy site frame-ancestors:** Which domains to allow?
   - **Decision:** TBD
   - **Impact:** Easter egg functionality

3. **Games count:** Snake + 2048 confirmed, add third game?
   - **Decision:** TBD
   - **Impact:** 5-15KB additional bundle

4. **README size limit:** Truncate long READMEs?
   - **Decision:** TBD
   - **Impact:** Performance, UX

5. **Telemetry solution:** Plausible, Umami, or self-hosted?
   - **Decision:** TBD
   - **Impact:** Cost, privacy compliance

6. **Multi-language support:** EN/TR toggle?
   - **Decision:** TBD (likely V1.1+)
   - **Impact:** i18n library, content duplication

7. **Custom shortcuts:** "Book a call" launcher icon?
   - **Decision:** TBD
   - **Impact:** Minimal

8. **Theme preference:** Ubuntu-heavy, XP-heavy, or equal toggle?
   - **Decision:** TBD
   - **Impact:** Design time, CSS size

---

### C. References

**Technical Documentation:**
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Vitals](https://web.dev/vitals/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [PWA Best Practices](https://web.dev/pwa-checklist/)

**Performance Resources:**
- [Chrome DevTools Performance Guide](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

**Inspiration:**
- [Windows 93](https://www.windows93.net/)
- [Ubuntu Web](https://ubuntu.com/)
- [XP.css](https://botoxparty.github.io/XP.css/)

---

### D. Changelog

**Version 1.0.0 (2025-10-20):**
- Initial comprehensive PRD+TDD document
- Combined product requirements and technical design
- Linked to ROADMAP.md for implementation details
- Established as single source of truth for vibe-coding

**Next Review:** After MVP completion (Week 3)

---

## 🎓 How to Use This Document (For AI Assistants)

**Context Loading:**
1. Read this document in full before starting any task
2. Cross-reference with `ROADMAP.md` for current task
3. Check `CLAUDE.md` for lessons learned and error library

**When Implementing:**
1. Find relevant Epic section
2. Review acceptance criteria
3. Check data models/schemas
4. Implement with reference to code examples
5. Update CLAUDE.md with any issues/learnings

**When Debugging:**
1. Search for component/feature in this doc
2. Review architectural decisions (Section 2)
3. Check error handling patterns
4. Update error library in CLAUDE.md

**When Optimizing:**
1. Reference performance targets (Section 2.6)
2. Check budget constraints
3. Use provided measurement utilities
4. Document improvements in CLAUDE.md

**Decision Making:**
1. Check if decision already documented (Appendix B)
2. If new decision needed, document rationale
3. Update this document and CLAUDE.md
4. Sync with ROADMAP if impacts timeline

---

**End of Document**

*This PRD+TDD is a living document. Update after major decisions, architecture changes, or when technical debt is identified. Treat it as the canonical source for "why" and "how" the system works.*

**Last Updated:** 2025-10-20  
**Next Review:** After MVP (Week 3)  
**Maintainer:** AI Development Assistant (Claude) + Yamaç Bezirgan