# UBUNTU×XP DESKTOP PORTFOLIO - V1.0 ROADMAP
## POST-MVP FEATURE COMPLETION

**Created:** 2025-10-21
**Target:** V1.0 Production Ready
**Estimated Time:** 18-24 hours
**Status:** 🟡 Planning Complete, Ready to Execute

---

## 0) Özet Zaman Çizelgesi

**Faz Hedefleri ve Zaman Pencereleri:**
- **Phase 1 (Hızlı Fix'ler):** 1-1.5 saat | Layout düzenleme, icon mapping, trash visibility
- **Phase 2 (File Explorer):** 2-3 saat | Home klasörü yapısı, dosya görüntüleyici
- **Phase 3 (GitHub Projects):** 2-3 saat | API entegrasyonu, repo kartları, search
- **Phase 4 (4 Oyun):** 5-7 saat | Snake, Tetris, 2048, Minesweeper
- **Phase 5 (7 Utility App):** 5-7 saat | Settings, Terminal, Music, Gallery, Notes, Calculator, Calendar
- **Phase 6 (Polish & Test):** 1-2 saat | Performance, bundle size, CHANGELOG, final validation

**Kritik Yol:**
```
Phase 1 (Fix'ler) → Phase 2 (File Explorer) ┐
                                             ├→ Phase 6 (Polish)
Phase 3 (GitHub Projects) ──────────────────┤
Phase 4 (Oyunlar) ──────────────────────────┤
Phase 5 (Utility Apps) ─────────────────────┘
```

**Paralel Çalışma Stratejisi:**
- Phase 2, 3, 4, 5 birbirinden bağımsız → paralel yapılabilir
- Öncelik: Phase 1 (zorunlu) → Phase 2+3 (core features) → Phase 4+5 (nice-to-have)

**Toplam Tahmini Süre:**
- Sıralı: 21-24 saat
- Paralel: 18-20 saat

---

## 1) PHASE 1: HIZLI FIX'LER & LAYOUT DÜZENLEME

**Hedef:** Kullanıcı geri bildirimlerini hemen düzelt - taskbar'daki string'ler, icon pozisyonları, trash visibility, GitHub URL.

**Toplam Süre:** 1-1.5 saat

### Epik-1.1: Icon Mapping & Display Fix

**Süre:** 30 dakika

#### Task 1.1.1: Taskbar Window Title Icon Mapping
- **Amaç:** Taskbar'da "folder-games" gibi string'ler yerine emoji göster
- **Dosyalar:** `src/ui/Window.tsx` (satır ~305)
- **Değişiklik:**
  ```typescript
  // Window.tsx içinde getIconDisplay() fonksiyonu ekle
  const getIconDisplay = (iconStr: string | undefined) => {
    const iconMap: Record<string, string> = {
      'desktop': '🖥️',
      'folder-home': '🏠',
      'folder-code': '💻',
      'folder-games': '🎮',
      'file-pdf': '📄',
      'link-linkedin': '💼',
      'link-github': '🐙',
      'trash-empty': '🗑️',
      'trash-full': '🗑️',
    };
    return iconMap[iconStr] || iconStr || '📄';
  };

  // titlebar'da kullan:
  <span className="window__icon">{getIconDisplay(window.icon)}</span>
  ```
- **Kabul Kriteri:** Taskbar'da tüm window'ların emoji icon'ları görünür, string yok
- **Tahmin:** 20 dakika
- **Bağımlılık:** Yok
- **Test:** Games klasörünü aç → taskbar'da "🎮 Games" görmeli

#### Task 1.1.2: DesktopIcon Display Validation
- **Amaç:** Desktop icon'larının doğru emoji gösterdiğini doğrula
- **Dosyalar:** `src/ui/DesktopIcon.tsx` (satır 95-118)
- **Kontrol:** Icon mapping zaten eklenmiş (önceki session'da), test et
- **Kabul Kriteri:** Desktop'taki 6 icon doğru emoji gösterir (🏠💻📄🎮💼🐙)
- **Tahmin:** 10 dakika
- **Bağımlılık:** Task 1.1.1
- **Test:** IndexedDB sıfırla + reload → iconlar görünmeli

---

### Epik-1.2: Grid Layout Reorganization

**Süre:** 30 dakika

#### Task 1.2.1: Update Default Icon Layout
- **Amaç:** LinkedIn ve GitHub'ı sağ alt köşeye taşı, trash ekle
- **Dosyalar:** `src/os/vfs/seed.ts` (satır 177-192)
- **Değişiklik:**
  ```typescript
  export function getDefaultIconLayout(): Record<string, { x: number; y: number }> {
    // Grid: 8 columns x 6 rows
    // Cell size: ~160px wide, ~120px tall (1280x720 screen)
    const layout = {
      // Left column (0)
      'home': { x: 0, y: 0 },
      'projects': { x: 0, y: 1 },
      'cv-pdf': { x: 0, y: 2 },
      'games': { x: 0, y: 3 },

      // Right column (7) - bottom area
      'trash': { x: 7, y: 3 },
      'linkedin-link': { x: 7, y: 4 },
      'github-link': { x: 7, y: 5 },
    };
    return layout;
  }
  ```
- **Kabul Kriteri:** Desktop'ta iconlar sol ve sağ sütunlarda, ortası boş
- **Tahmin:** 20 dakika
- **Bağımlılık:** Yok
- **Test:** `localStorage.clear(); indexedDB.deleteDatabase('ubuntu-xp-vfs'); location.reload()`

#### Task 1.2.2: Trash Visibility Update
- **Amaç:** Trash'i desktop'ta görünür yap (hidden: false)
- **Dosyalar:** `src/os/vfs/seed.ts` (satır 106-118)
- **Değişiklik:**
  ```typescript
  const trashFolder: VFSNode = {
    id: 'trash',
    type: 'folder',
    name: 'Trash',
    parentId: 'root', // Desktop'ta görünsün
    createdAt: now,
    modifiedAt: now,
    icon: 'trash-empty',
    readonly: true,
    hidden: false, // ← false yap (eskiden true)
    starred: false,
  };
  ```
- **Kabul Kriteri:** Desktop'ta Trash (🗑️) icon görünür
- **Tahmin:** 10 dakika
- **Bağımlılık:** Task 1.2.1
- **Test:** Trash icon'a tek tık → seçilebilir, çift tık → klasör açılır

---

### Epik-1.3: Easter Egg & External Links

**Süre:** 30 dakika

#### Task 1.3.1: Add Legacy Site to Trash
- **Amaç:** Trash klasörünün içine eski portfolio linki ekle (easter egg)
- **Dosyalar:** `src/os/vfs/seed.ts` (satır 150-170)
- **Değişiklik:**
  ```typescript
  // Trash içinde legacy site node'u
  const legacySiteLink: VFSNode = {
    id: 'old-portfolio-link',
    type: 'link',
    name: 'old-site.webp',
    parentId: 'trash', // ← Trash içinde
    createdAt: now,
    modifiedAt: now,
    icon: '🌐',
    mimeType: 'application/x-legacy-site',
    targetUrl: '/legacy/index.html',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // nodes array'ine ekle
  const nodes = [
    rootNode, homeFolder, projectsFolder, cvFile,
    gamesFolder, trashFolder,
    legacySiteLink, // ← EKLE
    linkedInLink, githubLink,
  ];
  ```
- **Kabul Kriteri:** Trash açınca içinde "old-site.webp" görünür, çift tık → Browser'da legacy site açılır
- **Tahmin:** 20 dakika
- **Bağımlılık:** Task 1.2.2
- **Test:** Trash → old-site.webp çift tık → `/legacy/index.html` yüklenir

#### Task 1.3.2: Validate External Link Behavior
- **Amaç:** GitHub ve LinkedIn link'lerinin yeni sekmede açıldığını doğrula
- **Dosyalar:** `src/ui/Desktop.tsx` (satır 84-92 - zaten eklenmiş)
- **Kontrol:** External URL detection mantığı mevcut
- **Kabul Kriteri:**
  - GitHub 🐙 → çift tık → `https://github.com/ymcbzrgn` yeni sekmede
  - LinkedIn 💼 → çift tık → `https://linkedin.com/in/yamacbezirgan` yeni sekmede
- **Tahmin:** 10 dakika
- **Bağımlılık:** Yok
- **Test:** Her iki linke çift tıkla, doğru URL'lere gittiğini onayla

---

## 2) PHASE 2: FILE EXPLORER & HOME KLASÖRÜ

**Hedef:** Home klasörünü dosya yöneticisi haline getir - kullanıcı Documents, Pictures, Downloads alt klasörlerini görebilir, dosyaları açabilir.

**Toplam Süre:** 2-3 saat

### Epik-2.1: Home Folder Structure

**Süre:** 30 dakika

#### Task 2.1.1: Create Home Subfolders
- **Amaç:** Home içinde Documents, Downloads, Pictures klasörleri oluştur
- **Dosyalar:** `src/os/vfs/seed.ts`
- **Değişiklik:**
  ```typescript
  // Home altında Documents klasörü
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

  // Downloads klasörü
  const downloadsFolder: VFSNode = {
    id: 'downloads',
    type: 'folder',
    name: 'Downloads',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-download',
    color: '#2196F3',
    readonly: false,
    hidden: false,
    starred: false,
  };

  // Pictures klasörü
  const picturesFolder: VFSNode = {
    id: 'pictures',
    type: 'folder',
    name: 'Pictures',
    parentId: 'home',
    createdAt: now,
    modifiedAt: now,
    icon: 'folder-images',
    color: '#FF9800',
    readonly: false,
    hidden: false,
    starred: false,
  };
  ```
- **Kabul Kriteri:** IndexedDB'de home altında 3 klasör var
- **Tahmin:** 20 dakika
- **Bağımlılık:** Yok
- **Icon Mapping:** `folder-documents` → 📝, `folder-download` → 📥, `folder-images` → 🖼️

#### Task 2.1.2: Add Sample Files to Home
- **Amaç:** Her klasöre örnek dosyalar ekle
- **Dosyalar:** `src/os/vfs/seed.ts`
- **Değişiklik:**
  ```typescript
  // Documents içinde About Me
  const aboutMeFile: VFSNode = {
    id: 'about-me-md',
    type: 'file',
    name: 'About-Me.md',
    parentId: 'documents',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-markdown',
    mimeType: 'text/markdown',
    content: `# About Me\n\nMerhaba! Ben Yamaç Bezirgan, full-stack developer...\n\n## Skills\n- React, TypeScript\n- Node.js, Python\n- UI/UX Design`,
    size: 150,
    readonly: false,
    hidden: false,
    starred: true,
  };

  // Pictures içinde profile image
  const profileImage: VFSNode = {
    id: 'profile-pic',
    type: 'file',
    name: 'profile.webp',
    parentId: 'pictures',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-image',
    mimeType: 'image/webp',
    targetUrl: '/legacy/ME.png', // Public dosya
    size: 50000,
    readonly: true,
    hidden: false,
    starred: true,
  };

  // Downloads içinde README
  const readmeFile: VFSNode = {
    id: 'readme-txt',
    type: 'file',
    name: 'README.txt',
    parentId: 'downloads',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-text',
    mimeType: 'text/plain',
    content: 'Welcome to my Ubuntu×XP Desktop Portfolio!\n\nThis is a fully functional desktop environment built with React.',
    size: 100,
    readonly: false,
    hidden: false,
    starred: false,
  };
  ```
- **Kabul Kriteri:** Her klasörde en az 1 dosya var
- **Tahmin:** 10 dakika
- **Bağımlılık:** Task 2.1.1
- **Icon Mapping:** `file-markdown` → 📄, `file-image` → 🖼️, `file-text` → 📃

---

### Epik-2.2: File Explorer App

**Süre:** 1.5-2 saat

#### Task 2.2.1: Create FileExplorer Component
- **Amaç:** Klasör içeriğini gösteren ana component
- **Dosyalar:** `src/apps/file-explorer/FileExplorer.tsx` (YENİ)
- **Kod:**
  ```typescript
  import { useState } from 'react';
  import { useVFSNodesByParent, useVFSNodes } from '@os/store';
  import type { VFSNode } from '@os/types';
  import './FileExplorer.css';

  interface FileExplorerProps {
    windowId: string;
    nodeId?: string; // Açılacak klasör ID (default: root)
  }

  export default function FileExplorer({ windowId, nodeId = 'root' }: FileExplorerProps) {
    const [currentFolderId, setCurrentFolderId] = useState(nodeId);
    const nodes = useVFSNodes();
    const currentFolder = nodes[currentFolderId];
    const children = useVFSNodesByParent(currentFolderId);

    // Breadcrumb path hesapla
    const getPath = (id: string): VFSNode[] => {
      const path: VFSNode[] = [];
      let current = nodes[id];
      while (current) {
        path.unshift(current);
        current = current.parentId ? nodes[current.parentId] : null;
      }
      return path;
    };

    const path = getPath(currentFolderId);

    // Icon display
    const getIconDisplay = (node: VFSNode) => {
      const iconMap: Record<string, string> = {
        'folder-documents': '📝',
        'folder-download': '📥',
        'folder-images': '🖼️',
        'file-markdown': '📄',
        'file-text': '📃',
        'file-image': '🖼️',
      };
      if (node.icon && iconMap[node.icon]) return iconMap[node.icon];
      return node.type === 'folder' ? '📁' : '📄';
    };

    // Folder navigate
    const handleItemDoubleClick = (node: VFSNode) => {
      if (node.type === 'folder') {
        setCurrentFolderId(node.id);
      } else {
        // TODO: Open file viewer
        alert(`Opening ${node.name}`);
      }
    };

    // Breadcrumb navigate
    const handleBreadcrumbClick = (node: VFSNode) => {
      setCurrentFolderId(node.id);
    };

    return (
      <div className="file-explorer">
        {/* Breadcrumb */}
        <div className="file-explorer__breadcrumb">
          {path.map((node, i) => (
            <span key={node.id}>
              <button
                className="file-explorer__breadcrumb-item"
                onClick={() => handleBreadcrumbClick(node)}
              >
                {node.name}
              </button>
              {i < path.length - 1 && <span className="file-explorer__breadcrumb-sep">/</span>}
            </span>
          ))}
        </div>

        {/* File Grid */}
        <div className="file-explorer__grid">
          {children.map((node) => (
            <div
              key={node.id}
              className="file-explorer__item"
              onDoubleClick={() => handleItemDoubleClick(node)}
            >
              <div className="file-explorer__item-icon">
                {getIconDisplay(node)}
              </div>
              <div className="file-explorer__item-name">
                {node.name}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {children.length === 0 && (
          <div className="file-explorer__empty">
            This folder is empty
          </div>
        )}
      </div>
    );
  }
  ```
- **Kabul Kriteri:** Home klasörünü aç → Documents, Downloads, Pictures görünür
- **Tahmin:** 1 saat
- **Bağımlılık:** Task 2.1.2
- **Test:** Breadcrumb navigation çalışır, alt klasörlere gidilir

#### Task 2.2.2: FileExplorer CSS Styling
- **Amaç:** Grid layout, icon boyutları, hover states
- **Dosyalar:** `src/apps/file-explorer/FileExplorer.css` (YENİ)
- **Kod:**
  ```css
  .file-explorer {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-bg);
  }

  .file-explorer__breadcrumb {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .file-explorer__breadcrumb-item {
    background: none;
    border: none;
    color: var(--color-text-primary);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .file-explorer__breadcrumb-item:hover {
    background: rgba(0,0,0,0.05);
  }

  .file-explorer__breadcrumb-sep {
    color: var(--color-text-secondary);
  }

  .file-explorer__grid {
    flex: 1;
    padding: var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--spacing-md);
    overflow-y: auto;
  }

  .file-explorer__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .file-explorer__item:hover {
    background: rgba(0,0,0,0.05);
  }

  .file-explorer__item-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-xs);
  }

  .file-explorer__item-name {
    font-size: 0.875rem;
    text-align: center;
    word-break: break-word;
    max-width: 100%;
  }

  .file-explorer__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  ```
- **Kabul Kriteri:** Grid görünümü clean, hover states çalışır
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 2.2.1

#### Task 2.2.3: Register FileExplorer in appLoader
- **Amaç:** Home klasörüne çift tıkla → File Explorer açılsın
- **Dosyalar:**
  - `src/apps/appLoader.tsx`
  - `src/ui/Desktop.tsx`
- **Değişiklik:**
  ```typescript
  // appLoader.tsx
  const appRegistry: AppRegistry = {
    'pdf-viewer': () => import('./pdf-viewer/PdfViewer'),
    'browser': () => import('./browser/Browser'),
    'file-explorer': () => import('./file-explorer/FileExplorer'), // ← EKLE
  };

  // Desktop.tsx - handleIconDoubleClick
  else if (node.type === 'folder') {
    // Klasör → File Explorer aç
    appId = 'file-explorer';
    meta.nodeId = node.id; // Hangi klasör
  }
  ```
- **Kabul Kriteri:** Home'a çift tık → File Explorer penceresi açılır, içinde Documents/Downloads/Pictures
- **Tahmin:** 20 dakika
- **Bağımlılık:** Task 2.2.2
- **Test:** Projects, Games klasörlerini de aç → içleri boş görmeli

---

### Epik-2.3: File Viewers (Text, Markdown, Image)

**Süre:** 1 saat

#### Task 2.3.1: TextViewer Component
- **Amaç:** .txt dosyalarını göster
- **Dosyalar:** `src/apps/file-explorer/TextViewer.tsx` (YENİ)
- **Kod:**
  ```typescript
  import { useVFSNodes } from '@os/store';

  interface TextViewerProps {
    nodeId: string;
  }

  export default function TextViewer({ nodeId }: TextViewerProps) {
    const nodes = useVFSNodes();
    const file = nodes[nodeId];

    if (!file) return <div>File not found</div>;

    return (
      <div className="text-viewer">
        <pre className="text-viewer__content">
          {file.content || 'Empty file'}
        </pre>
      </div>
    );
  }
  ```
- **CSS:**
  ```css
  .text-viewer {
    padding: var(--spacing-md);
    height: 100%;
    overflow: auto;
    background: var(--color-bg);
  }

  .text-viewer__content {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
  }
  ```
- **Kabul Kriteri:** README.txt açılınca içerik görünür
- **Tahmin:** 20 dakika
- **Bağımlılık:** Task 2.2.3

#### Task 2.3.2: MarkdownViewer Component
- **Amaç:** .md dosyalarını render et (marked + DOMPurify)
- **Dosyalar:** `src/apps/file-explorer/MarkdownViewer.tsx` (YENİ)
- **Dependencies:** `marked`, `dompurify` (zaten package.json'da var)
- **Kod:**
  ```typescript
  import { useVFSNodes } from '@os/store';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  interface MarkdownViewerProps {
    nodeId: string;
  }

  export default function MarkdownViewer({ nodeId }: MarkdownViewerProps) {
    const nodes = useVFSNodes();
    const file = nodes[nodeId];

    if (!file) return <div>File not found</div>;

    const html = DOMPurify.sanitize(
      marked.parse(file.content || '# Empty') as string,
      {
        ALLOWED_TAGS: ['h1','h2','h3','p','a','ul','ol','li','code','pre','strong','em','blockquote'],
        ALLOWED_ATTR: ['href', 'class'],
      }
    );

    return (
      <div
        className="markdown-viewer"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  ```
- **CSS:**
  ```css
  .markdown-viewer {
    padding: var(--spacing-lg);
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .markdown-viewer h1 { font-size: 2rem; margin-top: 0; }
  .markdown-viewer h2 { font-size: 1.5rem; }
  .markdown-viewer h3 { font-size: 1.25rem; }
  .markdown-viewer code {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
  .markdown-viewer pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }
  ```
- **Kabul Kriteri:** About-Me.md açılınca formatted markdown görünür
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 2.3.1

#### Task 2.3.3: Update FileExplorer to Open Viewers
- **Amaç:** Dosya çift tıklanınca uygun viewer'ı aç
- **Dosyalar:**
  - `src/apps/file-explorer/FileExplorer.tsx`
  - `src/apps/appLoader.tsx`
- **Değişiklik:**
  ```typescript
  // appLoader.tsx - yeni viewer'lar ekle
  'text-viewer': () => import('./file-explorer/TextViewer'),
  'markdown-viewer': () => import('./file-explorer/MarkdownViewer'),

  // FileExplorer.tsx - handleItemDoubleClick
  const handleItemDoubleClick = (node: VFSNode) => {
    if (node.type === 'folder') {
      setCurrentFolderId(node.id);
    } else {
      // Determine viewer app
      let viewerApp = 'text-viewer';
      if (node.mimeType === 'text/markdown') viewerApp = 'markdown-viewer';
      else if (node.mimeType?.startsWith('image/')) viewerApp = 'image-viewer';
      else if (node.mimeType === 'application/pdf') viewerApp = 'pdf-viewer';

      // Open in new window (emit event to Desktop)
      window.dispatchEvent(new CustomEvent('open-file-viewer', {
        detail: { appId: viewerApp, nodeId: node.id, title: node.name }
      }));
    }
  };

  // Desktop.tsx - event listener ekle
  useEffect(() => {
    const handleOpenFile = (e: any) => {
      const { appId, nodeId, title } = e.detail;
      openWindow({
        id: uuidv4(),
        appId,
        nodeId,
        title,
        bounds: { x: 100, y: 100, width: 600, height: 400 },
        state: 'normal',
        createdAt: Date.now(),
      });
    };
    window.addEventListener('open-file-viewer', handleOpenFile);
    return () => window.removeEventListener('open-file-viewer', handleOpenFile);
  }, []);
  ```
- **Kabul Kriteri:** README.txt → TextViewer, About-Me.md → MarkdownViewer aç
- **Tahmin:** 20 dakika
- **Bağımlılık:** Task 2.3.2

---

## 3) PHASE 3: GITHUB PROJECTS VIEWER

**Hedef:** Projects klasörünü aç → GitHub API'den ymcbzrgn'in tüm repo'larını çek, kartlar halinde listele (extra-projects.html benzeri).

**Toplam Süre:** 2-3 saat

### Epik-3.1: GitHub API Integration

**Süre:** 1.5 saat

#### Task 3.1.1: Create GitHubProjects Component
- **Amaç:** Repo listesi + search/filter UI
- **Dosyalar:** `src/apps/github-projects/GitHubProjects.tsx` (YENİ)
- **Dependencies:** fetch (native), ETag cache mekanizması
- **Kod:**
  ```typescript
  import { useState, useEffect } from 'react';
  import RepoCard from './RepoCard';
  import './GitHubProjects.css';

  interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
    topics: string[];
    fork: boolean;
  }

  export default function GitHubProjects({ windowId }: { windowId: string }) {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      fetchRepos();
    }, []);

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('https://api.github.com/users/ymcbzrgn/repos?per_page=100&sort=updated');

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        // Filter forks, sort by updated
        const filtered = data
          .filter((r: Repo) => !r.fork)
          .sort((a: Repo, b: Repo) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );

        setRepos(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Search filter
    const filteredRepos = repos.filter((repo) => {
      const query = searchQuery.toLowerCase();
      return (
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.topics?.some(t => t.toLowerCase().includes(query))
      );
    });

    return (
      <div className="github-projects">
        {/* Header */}
        <div className="github-projects__header">
          <h2>GitHub Projects</h2>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="github-projects__search"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="github-projects__loading">
            <div className="spinner" />
            <p>Loading projects...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="github-projects__error">
            <p>⚠️ {error}</p>
            <button onClick={fetchRepos}>Retry</button>
          </div>
        )}

        {/* Repo Grid */}
        {!loading && !error && (
          <div className="github-projects__grid">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredRepos.length === 0 && (
          <div className="github-projects__empty">
            No projects found matching "{searchQuery}"
          </div>
        )}
      </div>
    );
  }
  ```
- **Kabul Kriteri:** Projects açınca API call yapılır, loading spinner görünür
- **Tahmin:** 1 saat
- **Bağımlılık:** Yok

#### Task 3.1.2: RepoCard Component
- **Amaç:** Tek bir repo kartı (image, name, description, stars, language)
- **Dosyalar:** `src/apps/github-projects/RepoCard.tsx` (YENİ)
- **Kod:**
  ```typescript
  import { useState, useEffect } from 'react';

  interface RepoCardProps {
    repo: {
      name: string;
      description: string;
      html_url: string;
      homepage: string;
      stargazers_count: number;
      language: string;
      topics: string[];
    };
  }

  export default function RepoCard({ repo }: RepoCardProps) {
    const [previewImage, setPreviewImage] = useState<string>('/LOGO.png');

    useEffect(() => {
      // Try to find preview image
      const findPreview = async () => {
        const exts = ['', '.png', '.jpg', '.webp'];
        for (const ext of exts) {
          const url = `https://raw.githubusercontent.com/ymcbzrgn/${repo.name}/main/portfolioWebsiteImage${ext}`;
          const ok = await checkImage(url);
          if (ok) {
            setPreviewImage(url);
            return;
          }
        }
      };
      findPreview();
    }, [repo.name]);

    const checkImage = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    return (
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="repo-card"
      >
        <div className="repo-card__image">
          <img src={previewImage} alt={repo.name} />
        </div>
        <div className="repo-card__content">
          <h3 className="repo-card__title">{repo.name}</h3>
          <p className="repo-card__description">
            {repo.description || 'No description'}
          </p>
          <div className="repo-card__meta">
            <span className="repo-card__stars">⭐ {repo.stargazers_count}</span>
            {repo.language && (
              <span className="repo-card__language">{repo.language}</span>
            )}
          </div>
          {repo.topics?.length > 0 && (
            <div className="repo-card__topics">
              {repo.topics.slice(0, 3).map(topic => (
                <span key={topic} className="repo-card__topic">{topic}</span>
              ))}
            </div>
          )}
        </div>
      </a>
    );
  }
  ```
- **Kabul Kriteri:** Kartlarda repo bilgileri doğru görünür, tıklanınca GitHub'a gider
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 3.1.1

#### Task 3.1.3: GitHubProjects CSS Styling
- **Amaç:** Grid layout, card design, responsive
- **Dosyalar:** `src/apps/github-projects/GitHubProjects.css` (YENİ)
- **Kod:**
  ```css
  .github-projects {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-bg);
  }

  .github-projects__header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .github-projects__header h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  .github-projects__search {
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.875rem;
    min-width: 220px;
  }

  .github-projects__grid {
    flex: 1;
    padding: var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
    overflow-y: auto;
  }

  .repo-card {
    display: block;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: all var(--transition-base);
  }

  .repo-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .repo-card__image {
    height: 160px;
    background: #f5f5f5;
    overflow: hidden;
  }

  .repo-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .repo-card__content {
    padding: var(--spacing-md);
  }

  .repo-card__title {
    margin: 0 0 8px 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .repo-card__description {
    margin: 0 0 12px 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .repo-card__meta {
    display: flex;
    gap: 12px;
    font-size: 0.875rem;
    margin-bottom: 8px;
  }

  .repo-card__topics {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .repo-card__topic {
    background: var(--color-primary-light);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .github-projects__loading,
  .github-projects__error,
  .github-projects__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0,0,0,0.1);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  ```
- **Kabul Kriteri:** Kartlar grid'de düzgün görünür, hover animation çalışır
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 3.1.2

---

### Epik-3.2: Integration & Testing

**Süre:** 30 dakika

#### Task 3.2.1: Register GitHubProjects in appLoader
- **Amaç:** Projects klasörüne çift tıkla → GitHub viewer açılsın
- **Dosyalar:**
  - `src/apps/appLoader.tsx`
  - `src/ui/Desktop.tsx`
- **Değişiklik:**
  ```typescript
  // appLoader.tsx
  'github-projects': () => import('./github-projects/GitHubProjects'),

  // Desktop.tsx - handleIconDoubleClick
  else if (node.id === 'projects') {
    // Projects klasörü → GitHub viewer
    appId = 'github-projects';
  }
  ```
- **Kabul Kriteri:** Projects'e çift tık → GitHub repos listesi görünür
- **Tahmin:** 10 dakika
- **Bağımlılık:** Task 3.1.3

#### Task 3.2.2: Test Rate Limit Handling
- **Amaç:** API rate limit (60 req/hour) dolduğunda graceful degradation
- **Test:**
  - Network tab'da 429 status simulate et (throttle)
  - Error mesajı görünmeli
  - Retry butonu çalışmalı
- **Kabul Kriteri:** Rate limit error'da kullanıcıya anlamlı mesaj göster
- **Tahmin:** 20 dakika
- **Bağımlılık:** Task 3.2.1

---

## 4) PHASE 4: OYUNLAR (4 GAMES)

**Hedef:** Games klasörüne Snake, Tetris, 2048, Minesweeper ekle - tam çalışır versiyonlar.

**Toplam Süre:** 5-7 saat

### Epik-4.1: Snake Game

**Süre:** 1.5 saat

#### Task 4.1.1: Snake Core Logic
- **Amaç:** Yılan hareketi, yem, collision
- **Dosyalar:** `src/apps/games/Snake.tsx` (YENİ)
- **Kod:**
  ```typescript
  import { useState, useEffect, useCallback } from 'react';
  import './Snake.css';

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;

  type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  type Position = { x: number; y: number };

  export default function Snake({ windowId }: { windowId: string }) {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    // Generate random food
    const generateFood = () => {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      setFood({ x, y });
    };

    // Game loop
    useEffect(() => {
      if (gameOver) return;

      const interval = setInterval(() => {
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          let newHead: Position;

          switch (direction) {
            case 'UP': newHead = { x: head.x, y: head.y - 1 }; break;
            case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break;
            case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break;
            case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
          }

          // Wall collision
          if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
              newHead.y < 0 || newHead.y >= GRID_SIZE) {
            setGameOver(true);
            return prevSnake;
          }

          // Self collision
          if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            setGameOver(true);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Food eaten
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore(s => s + 10);
            generateFood();
          } else {
            newSnake.pop(); // Remove tail
          }

          return newSnake;
        });
      }, 150);

      return () => clearInterval(interval);
    }, [direction, gameOver, food]);

    // Keyboard controls
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowUp':
            if (direction !== 'DOWN') setDirection('UP');
            break;
          case 'ArrowDown':
            if (direction !== 'UP') setDirection('DOWN');
            break;
          case 'ArrowLeft':
            if (direction !== 'RIGHT') setDirection('LEFT');
            break;
          case 'ArrowRight':
            if (direction !== 'LEFT') setDirection('RIGHT');
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    const reset = () => {
      setSnake([{ x: 10, y: 10 }]);
      setDirection('RIGHT');
      setGameOver(false);
      setScore(0);
      generateFood();
    };

    return (
      <div className="snake-game">
        <div className="snake-game__header">
          <span>Score: {score}</span>
          <button onClick={reset}>Reset</button>
        </div>

        <div
          className="snake-game__grid"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className="snake-game__segment"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="snake-game__food"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        </div>

        {gameOver && (
          <div className="snake-game__overlay">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <button onClick={reset}>Play Again</button>
          </div>
        )}
      </div>
    );
  }
  ```
- **Kabul Kriteri:** Yılan hareket eder, yem yer, çarptığında oyun biter
- **Tahmin:** 1 saat
- **Bağımlılık:** Yok

#### Task 4.1.2: Snake CSS + Game Node
- **Amaç:** Styling + VFS node ekle
- **Dosyalar:**
  - `src/apps/games/Snake.css`
  - `src/os/vfs/seed.ts`
- **CSS:**
  ```css
  .snake-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: #2d2d2d;
    color: white;
  }

  .snake-game__header {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .snake-game__grid {
    position: relative;
    background: #1a1a1a;
    border: 2px solid #444;
  }

  .snake-game__segment {
    position: absolute;
    background: #4CAF50;
    border-radius: 2px;
  }

  .snake-game__food {
    position: absolute;
    background: #FF5722;
    border-radius: 50%;
  }

  .snake-game__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  ```
- **VFS Node:**
  ```typescript
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
  ```
- **Kabul Kriteri:** Games → Snake görünür, çift tık → oyun açılır
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 4.1.1

---

### Epik-4.2: Tetris Game

**Süre:** 2 saat

#### Task 4.2.1: Tetris Core Logic
- **Amaç:** Tetromino'lar, rotation, line clearing
- **Dosyalar:** `src/apps/games/Tetris.tsx` (YENİ)
- **Mantık:**
  - 7 tetromino şekli (I, O, T, S, Z, J, L)
  - 10x20 grid
  - Rotation matrisi (90 derece)
  - Line clearing + scoring
  - Level sistemi (hız artışı)
- **Kabul Kriteri:** Bloklar düşer, rotate olur, satırlar temizlenir
- **Tahmin:** 1.5 saat
- **Bağımlılık:** Yok
- **Not:** Kod çok uzun, detay atlanabilir (benzer pattern Snake gibi)

#### Task 4.2.2: Tetris CSS + VFS Node
- **Amaç:** Grid styling, next piece preview
- **Tahmin:** 30 dakika
- **Bağımlılık:** Task 4.2.1

---

### Epik-4.3: 2048 Game

**Süre:** 1 saat

#### Task 4.3.1: 2048 Core Logic
- **Amaç:** 4x4 grid, tile merge, swipe/arrow keys
- **Dosyalar:** `src/apps/games/Game2048.tsx` (YENİ)
- **Mantık:**
  - Tile movement algoritması (slide + merge)
  - Random tile spawn (2 veya 4)
  - Win condition (2048 tile)
  - Game over detection (board full + no move)
- **Kabul Kriteri:** Tile'lar hareket eder, merge olur, 2048'e ulaşılınca kazanma mesajı
- **Tahmin:** 45 dakika
- **Bağımlılık:** Yok

#### Task 4.3.2: 2048 CSS + VFS Node
- **Amaç:** Tile animations, color coding (2=beige, 4=tan, 2048=gold)
- **Tahmin:** 15 dakika
- **Bağımlılık:** Task 4.3.1

---

### Epik-4.4: Minesweeper Game

**Süre:** 1.5 saat

#### Task 4.4.1: Minesweeper Core Logic
- **Amaç:** 9x9 grid, mayın placement, reveal/flag
- **Dosyalar:** `src/apps/games/Minesweeper.tsx` (YENİ)
- **Mantık:**
  - Random mayın yerleştir (10 adet)
  - Number calculation (komşu mayın sayısı)
  - Recursive reveal (0 komşusu olanlar)
  - Flag toggle (right click)
  - Win/lose detection
- **Kabul Kriteri:** Left click reveal, right click flag, mayına basınca Game Over
- **Tahmin:** 1.25 saat
- **Bağımlılık:** Yok

#### Task 4.4.2: Minesweeper CSS + VFS Node
- **Amaç:** Cell styling, flag emoji, mine emoji
- **Tahmin:** 15 dakika
- **Bağımlılık:** Task 4.4.1

---

### Epik-4.5: Games Integration

**Süre:** 30 dakika

#### Task 4.5.1: Register All Games in appLoader
- **Dosyalar:** `src/apps/appLoader.tsx`
- **Değişiklik:**
  ```typescript
  'snake-game': () => import('./games/Snake'),
  'tetris-game': () => import('./games/Tetris'),
  '2048-game': () => import('./games/Game2048'),
  'minesweeper-game': () => import('./games/Minesweeper'),
  ```
- **Kabul Kriteri:** 4 oyun da Games klasöründe görünür, açılır
- **Tahmin:** 15 dakika
- **Bağımlılık:** Tüm oyun task'ları

#### Task 4.5.2: Test All Games
- **Test:**
  - Snake → yem ye, çarp, reset
  - Tetris → rotate, line clear, game over
  - 2048 → merge, win, game over
  - Minesweeper → reveal, flag, mine hit
- **Kabul Kriteri:** 4 oyun da sorunsuz çalışır, FPS düşmez
- **Tahmin:** 15 dakika
- **Bağımlılık:** Task 4.5.1

---

## 5) PHASE 5: 7 UTILITY APPS

**Hedef:** Settings, Terminal, Music Player, Photo Gallery, Notes, Calculator, Calendar ekle.

**Toplam Süre:** 5-7 saat

### Epik-5.1: Settings App

**Süre:** 1 saat

#### Task 5.1.1: Settings UI
- **Amaç:** Tema değiştir, wallpaper seç, grid size
- **Dosyalar:** `src/apps/settings/Settings.tsx` (YENİ)
- **Özellikler:**
  - Theme switcher (Light/Dark/Ubuntu/XP)
  - Wallpaper picker (solid colors + gradients)
  - Grid size slider (6x4, 8x6, 10x8)
- **Tahmin:** 45 dakika

#### Task 5.1.2: Settings VFS Node + Integration
- **VFS Node:**
  ```typescript
  {
    id: 'settings-app',
    type: 'app',
    name: 'Settings',
    parentId: 'root',
    icon: '⚙️',
    appId: 'settings-app',
  }
  ```
- **Tahmin:** 15 dakika

---

### Epik-5.2: Terminal App

**Süre:** 1.5 saat

#### Task 5.2.1: Terminal Core
- **Amaç:** Basit komut satırı (ls, cd, cat, echo, clear)
- **Dosyalar:** `src/apps/terminal/Terminal.tsx` (YENİ)
- **Komutlar:**
  - `ls [path]` → VFS klasör içeriği listele
  - `cd [path]` → Aktif dizin değiştir
  - `cat [file]` → Dosya içeriğini göster
  - `echo [text]` → Text yazdır
  - `clear` → Terminal temizle
  - `help` → Komut listesi
- **Tahmin:** 1.25 saat

#### Task 5.2.2: Terminal VFS Node
- **Tahmin:** 15 dakika

---

### Epik-5.3: Music Player App

**Süre:** 30 dakika

#### Task 5.3.1: Music Player UI
- **Amaç:** HTML5 Audio API ile örnek mp3 çal
- **Dosyalar:** `src/apps/music-player/MusicPlayer.tsx` (YENİ)
- **Özellikler:**
  - Play/Pause/Stop
  - Volume slider
  - Progress bar
  - Playlist (örnek mp3'ler `/public/music/`)
- **Tahmin:** 30 dakika

---

### Epik-5.4: Photo Gallery App

**Süre:** 30 dakika

#### Task 5.4.1: Gallery Slideshow
- **Amaç:** Pictures klasöründeki resimleri slideshow
- **Dosyalar:** `src/apps/photo-gallery/PhotoGallery.tsx` (YENİ)
- **Özellikler:**
  - Previous/Next buttons
  - Auto-advance (5s interval)
  - Thumbnail strip
- **Tahmin:** 30 dakika

---

### Epik-5.5: Notes App

**Süre:** 30 dakika

#### Task 5.5.1: Notes Editor
- **Amaç:** Basit not alma (localStorage)
- **Dosyalar:** `src/apps/notes/Notes.tsx` (YENİ)
- **Özellikler:**
  - Note list (sidebar)
  - Rich text editor (textarea)
  - Save/Delete
  - LocalStorage persistence
- **Tahmin:** 30 dakika

---

### Epik-5.6: Calculator App

**Süre:** 1 saat

#### Task 5.6.1: Calculator Logic
- **Amaç:** Temel hesap makinesi (+, -, ×, ÷, %, √)
- **Dosyalar:** `src/apps/calculator/Calculator.tsx` (YENİ)
- **UI:** Numpad + operations + display
- **Tahmin:** 1 saat

---

### Epik-5.7: Calendar App

**Süre:** 1 saat

#### Task 5.7.1: Calendar View
- **Amaç:** Ay görünümü + etkinlik ekleme
- **Dosyalar:** `src/apps/calendar/Calendar.tsx` (YENİ)
- **Özellikler:**
  - Month grid view
  - Add event (date, title, note)
  - Event list (localStorage)
  - Month navigation (prev/next)
- **Tahmin:** 1 saat

---

## 6) PHASE 6: POLISH & TESTING

**Hedef:** Final validation, bundle size, CHANGELOG, production ready.

**Toplam Süre:** 1-2 saat

### Epik-6.1: Performance Validation

**Süre:** 30 dakika

#### Task 6.1.1: FPS Test
- **Test:**
  - 10+ window aç
  - Icon drag
  - Game oynarken FPS ölç
- **Kabul Kriteri:** 60 FPS, INP <100ms
- **Tahmin:** 15 dakika

#### Task 6.1.2: Bundle Size Check
- **Test:** `npm run build:new`
- **Kabul Kriteri:** <200KB gzip (oyunlar +30KB ekleyebilir)
- **Tahmin:** 15 dakika

---

### Epik-6.2: CHANGELOG Update

**Süre:** 30 dakika

#### Task 6.2.1: Add v0.8.0 - v1.0.0 Entries
- **Dosyalar:** `CHANGELOG.md`
- **Versiyonlar:**
  - v0.8.0: File Explorer, GitHub Projects
  - v0.9.0: 4 Games
  - v1.0.0: 7 Utility Apps, MVP Complete
- **Tahmin:** 30 dakika

---

### Epik-6.3: Final Testing

**Süre:** 30 dakika

#### Task 6.3.1: Full Feature Checklist
- **Test:**
  ```
  □ 6 desktop icon + trash
  □ Home → File Explorer → Documents/Downloads/Pictures
  □ Projects → GitHub repos load
  □ Games → 4 oyun çalışır
  □ 7 utility app açılır
  □ External links yeni sekmede
  □ Layout persist
  □ TypeScript 0 hata
  ```
- **Tahmin:** 30 dakika

---

## 7) EXECUTION STRATEGY

### Öncelik Sıralaması (Kritik → Nice-to-Have)

**1. Kritik (Mutlaka Yapılmalı):**
- Phase 1: Hızlı fix'ler (1.5h)
- Phase 2: File Explorer (3h)
- Phase 3: GitHub Projects (3h)
- Epik 6.1, 6.2, 6.3: Final polish (1.5h)

**2. High Priority:**
- Phase 4: Oyunlar (6h)

**3. Medium Priority:**
- Phase 5.1: Settings (1h)
- Phase 5.2: Terminal (1.5h)

**4. Low Priority (Optional):**
- Phase 5.3-5.7: Music, Gallery, Notes, Calculator, Calendar (3h)

### Paralel Çalışma Planı

**Gün 1 (6-8 saat):**
- Session 1: Phase 1 (fix'ler) → 1.5h
- Session 2: Phase 2 (File Explorer) → 3h
- Session 3: Phase 3 (GitHub Projects) start → 2h

**Gün 2 (6-8 saat):**
- Session 1: Phase 3 finish → 1h
- Session 2: Phase 4 (Oyunlar) → Snake + Tetris → 3.5h
- Session 3: Phase 4 (Oyunlar) → 2048 + Minesweeper → 2.5h

**Gün 3 (5-7 saat):**
- Session 1: Phase 5 (Settings + Terminal) → 2.5h
- Session 2: Phase 5 (Music + Gallery + Notes) → 1.5h
- Session 3: Phase 5 (Calculator + Calendar) → 2h

**Gün 4 (1-2 saat):**
- Session 1: Phase 6 (Polish + Testing) → 1.5h
- V1.0 Release! 🎉

---

## 8) BUNDLE SIZE BUDGET

**Current:** ~67KB gzip
**Target V1.0:** <250KB gzip

**Predicted Additions:**
- File Explorer: +8KB
- GitHub Projects: +10KB
- 4 Games: +35KB (Snake 8KB, Tetris 10KB, 2048 6KB, Minesweeper 11KB)
- 7 Utility Apps: +40KB
- **Total:** ~160KB gzip

**Final Estimate:** 67 + 160 = **227KB gzip** ✅ BUDGET içinde

---

## 9) SUCCESS METRICS

**V1.0 Kabul Kriterleri:**
- ✅ 15+ desktop icon görünür
- ✅ Home klasörü file explorer
- ✅ Projects → GitHub repos
- ✅ 4 oyun tam çalışır
- ✅ 7 utility app açılır
- ✅ Performance: 60 FPS, <250ms LCP
- ✅ Bundle: <250KB gzip
- ✅ TypeScript: 0 error
- ✅ Responsive: Desktop + (mobile optional)

---

## 10) RISK MITIGATION

**Risk #1:** Oyunlar çok uzun sürer
**Mitigation:** Placeholder'larla başla, sonra iterative tamamla

**Risk #2:** GitHub API rate limit
**Mitigation:** ETag cache + localStorage fallback

**Risk #3:** Bundle size patlar
**Mitigation:** Code splitting, lazy load, tree shaking

**Risk #4:** Performance düşer
**Mitigation:** RAF throttle, virtual scroll, memo

---

## 11) FUTURE ROADMAP (V1.1+)

**Post-V1.0 Features:**
- Mobile UX (launcher, app switcher, sheets)
- PWA (manifest, service worker, offline)
- Drag & drop file upload
- Right-click context menu
- Keyboard shortcuts (Ctrl+C, Ctrl+V)
- Window maximize snap zones
- Desktop wallpaper picker with custom upload
- Multi-language support (TR/EN)
- Accessibility (WCAG AA)

---

**END OF ROADMAP_2.md**

**Total Estimated Time:** 18-24 hours
**Status:** 🟢 Ready to Execute
**Last Updated:** 2025-10-21