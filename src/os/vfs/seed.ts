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

  // About Me markdown file (English)
  const aboutMeContent = `# Yamaç Bezirgan

## Full-Stack Developer | AI/ML Enthusiast

Hey there! I'm Yamaç, a Computer Engineering graduate from Altınbaş University with a passion for building end-to-end, user-centric products. Currently working as an ML & AI Automation Intern at Arketic AI, I bring together technical rigor and creative thinking to deliver innovative software solutions.

### Background
- 🎓 **Education:** Computer Engineering @ Altınbaş University (2020-2025)
- 🌍 **International Experience:** Erasmus+ @ Università degli Studi di Milano (2022-2023)
- 💼 **Current Role:** ML & AI Automation Intern @ Arketic AI (June 2025 - Present)
- 🚀 **Freelance:** Building dynamic web applications since September 2020

### What I Do
I specialize in full-stack development with a growing focus on AI integration. My work spans from crafting responsive React frontends to architecting scalable backend systems, all while exploring the exciting world of machine learning and automation.

**Key Skills:**
- **Frontend:** React, TypeScript, Next.js, Responsive Design
- **Backend:** Node.js, Express, REST APIs, Database Design
- **AI/ML:** LLM Systems, Workflow Orchestration, Model Training
- **Tools:** Docker, Git, MongoDB, PostgreSQL, CI/CD

### About This Portfolio
This entire portfolio is a desktop OS simulation running in your browser! It's not just a showcase—it's a technical demonstration of advanced frontend architecture:

- **Virtual File System** - Full CRUD operations with IndexedDB persistence
- **Window Management** - Draggable, resizable windows with state management
- **Mobile-First Design** - Responsive desktop experience + native mobile shell
- **PWA Support** - Installable, works offline
- **Built-in Apps** - PDF viewer, file explorer, games, and more

Every feature you see here is built from scratch using React, TypeScript, and modern web APIs. Feel free to explore, open apps, drag windows around, and experience what a desktop OS feels like in a browser!

### Let's Connect
I'm always excited to collaborate on impactful projects and contribute to dynamic teams. Whether it's building scalable web applications, exploring AI/ML solutions, or tackling creative technical challenges, I'm ready to jump in.

📧 [contact@yamacbezirgan.com](mailto:contact@yamacbezirgan.com)
🌐 [yamacbezirgan.com](https://www.yamacbezirgan.com)
💼 [LinkedIn](https://linkedin.com/in/yamacbezirgan)
🐙 [GitHub](https://github.com/ymcbzrgn)

---

*"Building software is like composing music—it takes technical skill, creativity, and a lot of iteration to get it just right."*`;

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

  // About Me markdown file (Turkish)
  const aboutMeContentTR = `# Yamaç Bezirgan

## Full-Stack Developer | AI/ML Meraklısı

Merhaba! Ben Yamaç, Altınbaş Üniversitesi Bilgisayar Mühendisliği mezunuyum ve uçtan uca, kullanıcı odaklı ürünler geliştirme konusunda tutkuluyum. Şu anda Arketic AI'da ML & AI Otomasyon Stajyeri olarak çalışıyorum ve teknik titizlikle yaratıcı düşünceyi birleştirerek yenilikçi yazılım çözümleri sunuyorum.

### Arka Plan
- 🎓 **Eğitim:** Bilgisayar Mühendisliği @ Altınbaş Üniversitesi (2020-2025)
- 🌍 **Uluslararası Deneyim:** Erasmus+ @ Università degli Studi di Milano (2022-2023)
- 💼 **Güncel Rol:** ML & AI Otomasyon Stajyeri @ Arketic AI (Haziran 2025 - Devam Ediyor)
- 🚀 **Freelance:** Eylül 2020'den beri dinamik web uygulamaları geliştiriyorum

### Ne Yapıyorum
Yapay zeka entegrasyonuna artan bir odakla full-stack geliştirme konusunda uzmanlaşıyorum. Çalışmalarım responsive React frontend'lerden ölçeklenebilir backend sistemlerine kadar uzanıyor ve bu süreçte makine öğrenmesi ve otomasyonun heyecan verici dünyasını keşfediyorum.

**Ana Yetenekler:**
- **Frontend:** React, TypeScript, Next.js, Responsive Tasarım
- **Backend:** Node.js, Express, REST API'ler, Veritabanı Tasarımı
- **AI/ML:** LLM Sistemleri, İş Akışı Düzenleme, Model Eğitimi
- **Araçlar:** Docker, Git, MongoDB, PostgreSQL, CI/CD

### Bu Portfolyo Hakkında
Bu portfolyo tamamen tarayıcınızda çalışan bir masaüstü işletim sistemi simülasyonu! Sadece bir vitrin değil—gelişmiş frontend mimarisinin teknik bir gösterimi:

- **Sanal Dosya Sistemi** - IndexedDB kalıcılığı ile tam CRUD operasyonları
- **Pencere Yönetimi** - State yönetimi ile sürüklenebilir, boyutlandırılabilir pencereler
- **Mobil Öncelikli Tasarım** - Responsive masaüstü deneyimi + native mobil kabuk
- **PWA Desteği** - Kurulabilir, çevrimdışı çalışır
- **Yerleşik Uygulamalar** - PDF görüntüleyici, dosya yöneticisi, oyunlar ve daha fazlası

Burada gördüğünüz her özellik React, TypeScript ve modern web API'leri kullanılarak sıfırdan inşa edildi. Keşfetmekte, uygulamaları açmakta, pencereleri sürüklemekte özgürsünüz ve bir masaüstü işletim sisteminin tarayıcıda nasıl hissettirdiğini deneyimleyin!

### Bağlantıda Kalalım
Etkili projelerde işbirliği yapmaktan ve dinamik ekiplere katkıda bulunmaktan her zaman heyecan duyarım. İster ölçeklenebilir web uygulamaları geliştirmek, ister AI/ML çözümleri keşfetmek ya da yaratıcı teknik zorlukları çözmek olsun, atlamaya hazırım.

📧 [contact@yamacbezirgan.com](mailto:contact@yamacbezirgan.com)
🌐 [yamacbezirgan.com](https://www.yamacbezirgan.com)
💼 [LinkedIn](https://linkedin.com/in/yamacbezirgan)
🐙 [GitHub](https://github.com/ymcbzrgn)

---

*"Yazılım geliştirmek müzik bestelemeye benzer—doğru sonucu elde etmek için teknik beceri, yaratıcılık ve bir sürü iterasyon gerekir."*`;

  const aboutMeFileTR: VFSNode = {
    id: 'about-me-tr-md',
    type: 'file',
    name: 'Hakkimda.md',
    parentId: 'documents',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-markdown',
    color: '#607D8B',
    size: aboutMeContentTR.length,
    mimeType: 'text/markdown',
    targetUrl: `data:text/markdown;base64,${btoa(unescape(encodeURIComponent(aboutMeContentTR)))}`,
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
    id: 'profile-png',
    type: 'file',
    name: 'profile.png',
    parentId: 'pictures',
    createdAt: now,
    modifiedAt: now,
    icon: 'file-image',
    color: '#FF9800',
    size: 0,
    mimeType: 'image/png',
    targetUrl: '/legacy/profile.png',
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
    aboutMeFileTR,
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
