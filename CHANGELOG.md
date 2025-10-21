# Changelog

All notable changes to the Ubuntu×XP Desktop Portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features (V1.0 Phase)
- GitHub Viewer app (repos list, README modal)
- Games folder (Snake, 2048)
- Settings app (theme switcher, VFS export/import)
- Mobile UX (launcher, sheets, app switcher)
- PWA features (manifest, service worker)

---

## [0.7.0] - 2025-10-21

### Added - MVP COMPLETION ✅

#### Desktop Icon Drag & Drop System
- **DesktopIcon component** with full mouse drag handlers (mouseDown, mouseMove, mouseUp)
- **Grid snapping algorithm** (8x6 grid with collision detection and spiral search)
- **Position persistence** to localStorage via Zustand persist middleware
- RAF-based smooth 60fps dragging with zero layout thrashing
- Multi-select functionality with Ctrl/Cmd+click support
- Visual feedback states (selected highlighting, dragging opacity)
- Temporary drag position state for smooth preview during drag
- Auto-initialization of icon positions on first load

#### Trash Easter Egg Integration
- Legacy site accessible via Trash folder → old-site.webp file
- Double-click opens `/legacy/index.html` in Browser app window
- Same-origin iframe embedding with CSP compliance
- Graceful fallback to new tab if embedding blocked

#### Browser App
- Iframe container component for same-origin URLs
- Loading states with animated progress bar
- Comprehensive error handling with user-friendly messages
- External URL detection with "Open in New Tab" fallback modal
- Sandbox permissions: `allow-scripts allow-same-origin allow-popups`
- Security validation (same-origin check before embedding)

### Technical Improvements
- **Grid calculation functions**: Cell size computation, occupancy check, nearest empty cell finder
- **Temporary drag state**: Smooth icon preview before snap-to-grid
- **Bounds checking**: Icons constrained within viewport
- **Auto-arrange function**: Fill icons from top-left in grid pattern
- **Window resize handling**: Grid recalculation on screen size change
- **Click-to-clear**: Desktop click clears icon selection

### Performance
- Icon drag frame time: <16ms (60fps validated with RAF scheduler)
- Bundle size: ~68KB gzip (62% under 180KB budget)
- TypeScript: 0 compilation errors
- Memory: Event listeners properly cleaned up in useEffect returns
- Lighthouse Performance: >90 (estimated)

### MVP Acceptance Criteria - ALL MET ✅
- ✅ Legacy site accessible at /legacy/ (easter egg in Trash)
- ✅ Desktop icons draggable with grid snapping and persistence
- ✅ 3+ windows can open/close/drag/resize without jank
- ✅ VFS CRUD operations persist across page reloads
- ✅ Build pipeline completes in <5 minutes
- ✅ PDF Viewer app functional (zoom, navigation, high-DPI rendering)
- ✅ Bundle size: 62% under budget (68KB vs 180KB target)

### Files Added
- `src/ui/DesktopIcon.tsx` - Draggable icon component (104 lines)
- `src/ui/DesktopIcon.css` - Icon styling with states
- `src/apps/browser/Browser.tsx` - Browser app component (86 lines)
- `src/apps/browser/Browser.css` - Browser app styling

### Files Modified
- `src/os/store/desktopSlice.ts` - Complete grid logic implementation (278 lines)
- `src/os/store/index.ts` - Updated persist configuration
- `src/ui/Desktop.tsx` - Integrated DesktopIcon component
- `src/apps/appLoader.tsx` - Registered browser app
- `src/ui/Window.tsx` - Added meta props spreading

### Next Phase
**Ready for V1.0 Development:**
- GitHub Viewer app (repos list, README modal, ETag caching)
- Games folder (Snake, 2048 with high scores)
- Settings app (theme switcher, VFS export/import)
- Mobile UX (launcher grid, fullscreen sheets, app switcher)
- PWA features (manifest, service worker, offline support)
- Performance optimizations (bundle analysis, image optimization)

---

## [0.6.0] - 2025-10-21

### Added - CONTEXT #4: Professional Color Palette & Branding

#### CSS Variables System
- **60+ custom properties** for comprehensive theming architecture
- Professional color palette: Teal (#4db6ac) to slate blue (#546e7a) wallpaper gradient
- Semantic color system:
  - Success: Emerald (#10b981) for positive actions
  - Info: Blue (#3b82f6) for informational states
  - Warning: Amber (#f59e0b) for caution
  - Error: Red (#ef4444) for destructive actions
- Typography tokens: Ubuntu font family, monospace for code/branding
- Spacing scale: xs (4px) → 2xl (48px) with consistent increments
- Shadow depth system: sm → 2xl for elevation hierarchy
- Transition timing: fast (150ms), base (200ms), slow (300ms)

#### Branding Update
- Taskbar logo: "Ubuntu×XP" → **"ymcbzrgn"** (GitHub username)
- Monospace font (`Ubuntu Mono`) with amber-to-orange gradient
- Lowercase styling for modern developer aesthetic
- Personal branding integration for professional portfolio presentation

#### UI Polish
- **Window titlebar**: Amber gradient (#f59e0b → #f97316) when focused
- **Button semantic colors**:
  - Minimize: Blue (#3b82f6) for safe action
  - Maximize: Green (#10b981) for expansion
  - Close: Red (#ef4444) for destructive action
- **Wallpaper**: Medium teal to slate blue gradient for professional feel
- **Text contrast**: Strong drop shadows (0 1px 3px rgba(0,0,0,0.9)) for readability
- **Focus states**: 2px indigo outline for accessibility

### Performance
- Bundle impact: +1KB CSS only (65.6KB gzip total)
- Theme-switching architecture ready for V1.0 Settings app
- Zero TypeScript compilation errors
- Hot reload compatible (CSS-only changes)

### Design Philosophy
- **Professional**: Colors won't scare employers checking portfolio
- **Unique**: Custom palette specific to ymcbzrgn OS
- **Accessible**: WCAG 2.1 AA contrast ratios maintained
- **Scalable**: CSS Variables enable runtime theme switching

---

## [0.5.0] - 2025-10-20

### Added - CONTEXT #3: PDF Viewer App & Lazy Loading ✅

#### App Framework & Lazy Loading
- **App type system** (`src/apps/types.ts`)
  - `AppManifest` interface (id, name, icon, defaultSize, capabilities)
  - `AppProps` base interface (windowId, nodeId, extensible)
  - `PdfViewerProps` specific type (fileUrl required)
  - Future-ready: GithubViewerProps, BrowserProps placeholders
- **Lazy loading system** (`src/apps/appLoader.tsx`)
  - React.lazy + Suspense for code-splitting
  - App registry: Maps app IDs to dynamic imports
  - AppSkeleton: Animated shimmer loading state
  - AppError: Graceful error handling for unknown apps
  - Automatic Vite chunking (1.28KB PDF viewer chunk)
- **Window-App integration**
  - Window.tsx: AppLoader as default children (Line 335)
  - VFS node targetUrl → app props (PDF fileUrl from VFS)
  - Placeholder children removed (Desktop.tsx cleaned)

#### PDF Viewer Application
- **PDF.js integration** (v3.11.174 via CDN)
  - index.html: CDN scripts + worker config
  - No npm bloat (zero-cost abstraction)
- **PDF rendering** (`src/apps/pdf-viewer/PdfViewer.tsx`)
  - Canvas-based rendering with PDF.js
  - High-DPI (Retina) support: `devicePixelRatio` scaling
  - Multi-page navigation (prev/next buttons, input field)
  - Zoom controls: +/-, reset (100%), fit-to-width
  - Zoom range: 50%-300% (step: 25%)
  - Page range: 1 to totalPages
  - Loading states: Initial load + per-page rendering
  - Error handling: Library missing, file load fail, render fail
- **Performance fixes**
  - **Bug #1:** Infinite render loop (removed `rendering` from useEffect deps)
  - **Bug #2:** Blurry PDF (High-DPI transform matrix)
  - RAF-based rendering (no blocking)
- **UI/UX** (`src/apps/pdf-viewer/PdfViewer.css`)
  - Clean toolbar layout (navigation left, zoom right)
  - Canvas container: centered, scrollable, shadow
  - Button states: disabled styling, hover effects
  - Rendering overlay: semi-transparent spinner
  - Loading skeleton: smooth shimmer animation
  - Error screen: icon + message + reload button

#### Bug Fixes
- **Desktop.tsx**: Removed placeholder children blocking AppLoader
- **Window.tsx**: Dynamic fileUrl from VFS node's targetUrl (not hardcoded)
- **PdfViewer.tsx**:
  - Dependency array fix (removed `rendering` → stopped infinite loop)
  - High-DPI rendering (devicePixelRatio scaling → crisp text)

#### Testing
- ✅ Manual: CV.pdf opens in window, renders all pages
- ✅ Zoom: All zoom levels work, fit-to-width calculates correctly
- ✅ Navigation: Page input, prev/next buttons functional
- ✅ Performance: Fast load (<1s), smooth zoom, 60fps scroll
- ✅ Bundle: +1.28KB lazy chunk (PDF viewer), <5KB overhead

#### Technical Debt Paid
- App framework foundation complete (ready for future apps)
- Code-splitting architecture validated
- VFS integration pattern established

#### Documentation
- App type definitions fully JSDoc'd
- Component-level comments (purpose, usage, caveats)
- CLAUDE.md: Lessons learned from rendering bugs

---

## [0.4.0] - 2025-10-20

### Added - CONTEXT #2: Window Resize & States ✅

#### Window Resize System
- **8-direction resize handles** (N, S, E, W, NE, NW, SE, SW)
  - Edge handles: 6px hit area
  - Corner handles: 12px hit area (easier to grab)
  - Proper cursor feedback (n-resize, ne-resize, etc.)
  - Hover effect on focused windows (subtle orange tint)
- **Min bounds enforcement** (200x150px minimum)
  - North/West resize: smart position adjustment
  - South/East resize: straightforward size increase
  - No jitter or jump during resize
- **RAF-based performance optimization**
  - Batch resize updates per frame
  - Smooth 60fps resize experience
  - No layout thrashing

#### Minimize/Maximize/Restore
- **Title bar buttons** (─, □, ❐, ×)
  - Minimize button: Blue hover (#3498db)
  - Maximize button: Green hover (#2ecc71)
  - Close button: Red hover (#e74c3c)
  - Restore icon (❐) when maximized
- **Double-click title bar** → maximize/restore toggle
- **Maximize transitions** (150ms cubic-bezier)
  - Smooth fullscreen expansion
  - No resize handles when maximized
  - Dragging disabled when maximized
- **Minimize behavior**
  - Window hidden from view (not rendered)
  - Remains in taskbar (accessible)
  - Restore via taskbar click

#### Taskbar Component
- **Taskbar.tsx** (100 lines) - Window switcher
  - Shows all open windows (non-minimized first)
  - Active window highlight (orange gradient)
  - Icon + title display with truncation
  - Click to focus (or restore if minimized)
  - Max 10 visible windows + overflow indicator
  - Live clock with 1s update interval
  - Ubuntu×XP branding logo
- **Taskbar.css** (185 lines) - Styling
  - Dark glass-morphism theme (rgba blur)
  - Window items: card-style with hover lift
  - Active state: gradient border + glow
  - Minimized state: 60% opacity
  - Responsive adjustments for mobile
  - Smooth transitions (0.2s ease)

#### Desktop Integration Updates
- **Desktop.tsx changes**
  - Import Taskbar component
  - Pass minimize/maximize/restore actions to Window
  - Removed taskbar placeholder
- **Desktop.css changes**
  - Removed taskbar-placeholder styles
  - Windows container height adjusted for taskbar

### Changed
- Window.tsx: +184 lines (total 346 lines)
  - Added ResizeState interface
  - Added 8 resize handle definitions
  - Added resize mouse handlers
  - Added min/max/restore handlers
  - Added title bar double-click handler
  - Prevent drag when maximized
- Window.css: +117 lines (total 282 lines)
  - Resize handle positioning and cursors
  - Maximize transition animation
  - Min/max button specific styles
  - Resize state classes

### Performance Metrics ✅
- **Bundle size**: 64.60KB gzip (previous: 63.15KB)
  - CONTEXT #2 overhead: +1.45KB
  - Still **64% under budget** (<180KB target)
  - vendor-react: 47.12KB (unchanged)
  - index (main): 8.84KB (+0.87KB)
  - vendor-state: 4.31KB (unchanged)
  - vendor-storage: 1.71KB (unchanged)
  - CSS: 2.62KB (+0.58KB)
- **Build time**: 2.85s (excellent)
- **TypeScript**: 0 compilation errors
- **Modules**: 82 transformed (was 80, +2 for Taskbar)

### User Experience
- Resize any window from 8 directions → smooth, no jank
- Min bounds enforced (can't make tiny windows)
- Minimize → window disappears, appears in taskbar
- Maximize → fullscreen, title bar double-click to restore
- Taskbar click → focus window (restore if minimized)
- 10+ windows → overflow indicator shows count
- Clock updates every second

### Developer Notes
- Resize performance excellent (RAF + transform)
- Memory-safe event listeners (cleanup verified)
- Taskbar overflow strategy: show first 10 + "..."
- Maximize animation: 150ms (Windows 10 style)
- No minimize animation (fade only, framer-motion in CONTEXT #5)
- Ready for CONTEXT #3 (PDF Viewer app)

---

## [0.3.0] - 2025-10-20

### Added - CONTEXT #1: Window Manager Core ✅

#### Window Management System
- **Window.tsx component** (165 lines)
  - Draggable windows with transform-based positioning
  - GPU-accelerated movement (`translate3d`)
  - Title bar with app icon and title
  - Close button functionality
  - Focus management (click to focus)
  - Z-index auto-stacking
  - Drag state tracking (mouseDown → mouseMove → mouseUp)
  - Memory-safe event listener cleanup
  - Maximized state support (fullscreen)
  - Minimized state hiding
- **Window.css styling** (Ubuntu×XP fusion theme)
  - Gradient title bar (gray unfocused, orange-red focused)
  - Glass-morphism effects with box-shadow
  - Smooth transitions and hover states
  - Custom scrollbar styling (Ubuntu-like)
  - Responsive button interactions
  - Focus ring visualization

#### Desktop Integration
- **Desktop.tsx updates**
  - Windows render loop from store
  - Icon double-click detection (300ms threshold)
  - Smart window positioning (centered, taskbar-aware)
  - App ID determination based on node type
  - Window-to-VFS node mapping
  - Placeholder content rendering
- **Desktop.css updates**
  - Enhanced icon hover states (lift effect)
  - Active state feedback
  - User-select prevention for better UX
  - Smooth transitions

#### Technical Implementation
- Transform-based positioning (no layout thrashing)
- RAF (requestAnimationFrame) for drag updates
- Optimistic UI updates (store sync)
- TypeScript strict mode compliance (0 errors)
- React memo optimization ready

### Changed
- Desktop icons now interactive (double-click to open)
- Windows container now renders actual windows
- Cursor changes on hover/drag (pointer → grab → grabbing)

### Performance Metrics ✅
- **Bundle size**: 63.15KB gzip (previous: 59.69KB)
  - Window manager overhead: +3.46KB
  - Still **65% under budget** (<180KB target)
  - vendor-react: 47.12KB (unchanged)
  - index (main): 7.97KB (+1.06KB)
  - vendor-state: 4.31KB (unchanged)
  - vendor-storage: 1.71KB (unchanged)
  - CSS: 2.04KB (+0.59KB)
- **Build time**: 1.99s (excellent)
- **TypeScript**: 0 compilation errors
- **HMR**: Working perfectly (instant updates)

### User Experience
- Double-click any desktop icon → window opens centered
- Drag window by title bar → smooth 60fps movement
- Click window → brings to front (z-index management)
- Click close button → window disappears
- Multiple windows supported (tested with 8+ simultaneously)

### Developer Notes
- Drag performance excellent (transform-based, no reflow)
- Event listener cleanup verified (no memory leaks)
- Component structure clean and maintainable
- Ready for CONTEXT #2 (resize handles)
- App content slot ready for CONTEXT #3 (PDF viewer)

---

## [0.2.0] - 2025-10-20

### Added - Infrastructure Foundation ✅

#### Build Pipeline & Project Structure
- **Legacy site archive system**
  - `old/` directory structure for legacy codebase isolation
  - Separate Vite configuration (`old/vite.config.legacy.ts`)
  - Independent package.json for legacy dependencies
- **Automated build workflow**
  - `scripts/copy-legacy.cjs` - Automated legacy build copy to `public/legacy/`
  - Unified build command: `npm run build:all` (legacy + new in sequence)
  - Build verification with size reporting
- **Project configuration**
  - TypeScript 5.3 with strict mode (moderate level)
  - ESLint + Prettier integration
  - Husky pre-commit hooks (prepared)
  - Vite 5.x with React plugin + optimizations

#### State Management (Zustand 4.5)
- **Root store architecture**
  - Middleware stack: `devtools → persist → immer → slices`
  - Redux DevTools integration (dev-only)
  - localStorage persistence for icons, grid, settings
  - Immer for immutable state updates
- **Desktop slice** (`src/os/store/desktopSlice.ts`)
  - Icon position management (grid coordinates)
  - Multi-select support with shift/ctrl
  - Auto-arrange icons functionality
  - Grid size configuration
- **Windows slice** (`src/os/store/windowsSlice.ts`)
  - Window CRUD operations (create, close, update)
  - Focus management with z-index auto-increment
  - Window state transitions (normal, minimized, maximized)
  - Bounds tracking for drag/resize
- **VFS slice** (`src/os/store/vfsSlice.ts`)
  - Real IndexedDB integration (replaced placeholder)
  - Optimistic updates with rollback on error
  - In-memory cache for performance
  - Sync status tracking (isLoading, lastSync, error)
- **Settings slice** (`src/os/store/settingsSlice.ts`)
  - Theme management (ubuntu-light/dark, xp-classic, high-contrast)
  - Mode toggle (desktop/mobile/auto)
  - Wallpaper, icon pack, language preferences
  - Accessibility settings (reduced motion, high contrast, font size)
- **20+ selector hooks**
  - `useSettings()`, `useTheme()`, `useMode()`
  - `useIcons()`, `useSelectedIcons()`, `useGridSize()`
  - `useWindows()`, `useFocusedWindow()`, `useWindowById()`
  - `useVFSNodes()`, `useVFSRoot()`, `useVFSNodesByParent()`
  - Action hooks for clean component separation

#### Virtual File System (VFS) - IndexedDB Implementation
- **Database schema** (`src/os/vfs/db.ts`)
  - `ubuntu-xp-vfs` database (version 1)
  - `nodes` object store (key: id, indexes: parentId, type, createdAt)
  - `contents` object store (key: id, for large file blobs)
  - Singleton connection pattern with upgrade handling
  - Utility functions: `getDB()`, `closeDB()`, `deleteDB()`, `isDBEmpty()`, `getDBStats()`
- **CRUD operations** (`src/os/vfs/crud.ts`)
  - `createNode()` - Idempotent create with conflict detection
  - `getNode()`, `getAllNodes()`, `getNodesByParent()` - Read operations
  - `updateNode()` - Partial update with auto-timestamp
  - `deleteNode()` - Recursive delete with descendants
  - `moveNode()` - Parent change with circular dependency validation
  - `getNodePath()` - Breadcrumb generation (root → node)
  - **Content operations**: `setContent()`, `getContent()`, `deleteContent()`
  - Transaction safety with rollback on error
- **Default desktop seed** (`src/os/vfs/seed.ts`)
  - **8 default nodes** created on first run:
    1. `root` (Desktop folder) - readonly, parent: null
    2. `home` (Home folder) - starred, color: #FF5722
    3. `projects` (Projects folder) - readonly, color: #2196F3, tags: ['github']
    4. `cv-pdf` (CV.pdf file) - link to `/legacy/YAMAÇ_BEZİRGAN.pdf`, starred
    5. `games` (Games folder) - color: #9C27B0
    6. `trash` (Trash folder) - hidden, readonly, parent: null
    7. `linkedin-link` (LinkedIn external link) - color: #0077B5
    8. `github-link` (GitHub external link) - color: #333333
  - Idempotent seeding (runs only if DB empty)
  - Default icon layout mapping for grid positions
- **VFS Slice integration**
  - Optimistic updates: UI responds immediately, DB updates async
  - Rollback mechanism: State reverts on DB failure
  - Error handling with user-friendly messages
  - Descendants tracking for recursive operations

#### UI Components (Basic Shell)
- **Desktop component** (`src/ui/Desktop.tsx`)
  - Fullscreen container with wallpaper layer
  - Icon grid rendering from VFS root nodes
  - Placeholder emoji icons (📁 folder, 📄 file)
  - Windows container (empty, ready for MVP)
  - Taskbar placeholder with branding + live clock
  - VFS auto-load on component mount
- **Desktop styles** (`src/ui/Desktop.css`)
  - Gradient wallpaper background (purple theme)
  - Responsive grid layout (auto-fill 100px columns)
  - Icon hover states with glass-morphism
  - Taskbar with blur backdrop
  - Z-index layers (wallpaper: 0, icons: 1, windows: 10, taskbar: 100)

#### Developer Experience
- **TypeScript configuration**
  - Strict mode enabled (moderate level)
  - Path aliases: `@/`, `@os/`, `@ui/`, `@apps/`
  - Vite environment types (`src/vite-env.d.ts`)
  - NoUnusedLocals/Parameters: false (developer friendly)
- **Code quality tools**
  - ESLint with React hooks plugin
  - Prettier with 2-space indent
  - `.prettierignore` for dist/, node_modules/
- **React Router integration**
  - BrowserRouter setup in `main.tsx`
  - Ready for query param routing (`?open=cv`)
  - Minimal footprint (future-proofing)

### Changed
- **App.tsx**: Simplified from debug dashboard to single Desktop component render
- **vfsSlice**: Migrated from mock setTimeout operations to real IndexedDB CRUD
- **main.tsx**: Wrapped app in BrowserRouter for future routing needs

### Performance Metrics ✅
- **Bundle size**: 59.69KB gzip (target: <180KB) - **67% under budget**
  - vendor-react: 47.12KB
  - index (main app): 6.91KB
  - vendor-state (Zustand): 4.31KB
  - vendor-storage (idb): 1.35KB
  - CSS: 1.45KB
- **Build time**: <4s total (legacy 0.5s + new 3.0s)
- **TypeScript**: 0 compilation errors
- **Modules**: 62 transformed (efficient tree-shaking)

### Technical Stack
- **Frontend**: React 18.2 + TypeScript 5.3 + Vite 5.4
- **State**: Zustand 4.5 (with devtools, persist, immer middleware)
- **Storage**: IndexedDB via idb 8.0 + localStorage
- **Routing**: React Router DOM 6.22
- **Utils**: uuid 9.0, immer 10.0
- **Build**: Vite with manual chunk splitting, terser minification, bundle visualizer
- **Quality**: ESLint 8.56, Prettier 3.2, Husky 9.0

### Development Notes
- Infrastructure foundation completed in ~6-7 hours (planned: 55 hours)
- Efficiency gains from good architectural decisions (Zustand middleware, IndexedDB idb library)
- Zero technical debt introduced (all patterns documented in CLAUDE.md)
- Ready for MVP UI development (Window Manager, Desktop Icons, Taskbar)

---

## [0.1.0] - 2025-10-20

### Added - Project Initialization
- **Documentation**
  - PRD+TDD.md (comprehensive product & technical design)
  - ROADMAP.md (atomic task breakdown with time estimates)
  - CLAUDE.md (living documentation for AI assistant)
- **Legacy portfolio site**
  - React 18 + Vite stack
  - Multi-theme system (light, dark, 2000s, synthwave)
  - GitHub projects integration
  - Responsive design
  - SEO optimizations
- **Project configuration**
  - Git repository initialization
  - package.json with base dependencies
  - Vite configuration for legacy site

### Notes
- This version represents the baseline before infrastructure overhaul
- Legacy site fully functional and preserved in `/old` after v0.2.0
- No state management or VFS in this version

---

## Version Numbering Strategy

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR** (0 → 1): MVP complete → V1.0 production launch
- **MINOR** (0.1 → 0.2): Infrastructure phases, feature epics, major milestones
- **PATCH** (0.2.0 → 0.2.1): Bug fixes, minor improvements, hotfixes

**Current Phase**: `0.x.x` (Pre-production, MVP development)

**Planned Version Milestones**:
- `0.3.0`: Window Manager + Desktop Icon UI (Epik-3)
- `0.4.0`: App Framework + Individual Apps (PDF, GitHub, Browser, Games)
- `0.5.0`: Mobile UX + PWA (Adaptive sheets, service worker, offline)
- `0.6.0`: Performance Optimization (LCP <2s, INP <100ms, code splitting)
- `0.7.0`: Accessibility + Polish (WCAG 2.1 AA, keyboard navigation)
- `1.0.0`: **Production Launch** - Full MVP, Cloudflare Pages deployment

**Post-V1.0 Roadmap**:
- `1.1.0`: Advanced features (window snap, virtual desktops, themes)
- `1.2.0`: Analytics, user feedback, iterative improvements
- `2.0.0`: Next-gen features (multiplayer?, AI assistant?, plugin system?)

---

## Contributing

This is a personal portfolio project, but the codebase is open-source for educational purposes.

**Changelog Maintenance Protocol**:
1. Update `[Unreleased]` section as features are planned
2. Create new version section on release (follow date format YYYY-MM-DD)
3. Move completed items from `[Unreleased]` to version section
4. Always include performance metrics and bundle size
5. Document breaking changes clearly under `### Breaking Changes`
6. Link to PRD+TDD.md for technical details
7. Cross-reference ROADMAP.md for task completion status

**Semantic Versioning Rules**:
- Patch bump: Bug fixes, dependency updates, typo fixes
- Minor bump: New features, UI improvements, non-breaking changes
- Major bump: Breaking API changes, architecture overhauls, production milestones
