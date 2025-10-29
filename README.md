# Yamaç Bezirgan - Interactive Desktop Portfolio

> A fully functional desktop OS simulation running in your browser, showcasing full-stack development, AI/ML integration, and creative engineering.

[![Live Demo](https://img.shields.io/badge/Live-yamacbezirgan.com-blue)](https://www.yamacbezirgan.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 👨‍💻 About Me

I'm Yamaç Bezirgan, a Computer Engineering graduate from Altınbaş University with hands-on full-stack experience building end-to-end, user-centric products. Currently working as an ML & AI Automation Intern at Arketic AI, I bring technical rigor with a creative, product-driven mindset to deliver reliable and innovative software.

With international experience from Erasmus+ at Università degli Studi di Milano and a growing focus on AI, I'm passionate about contributing to impactful projects in dynamic, collaborative teams.

**Current Role:** ML & AI Automation Intern @ Arketic AI
**Focus:** Full-Stack Development, AI/ML Integration, Product Engineering
**Education:** Computer Engineering (Altınbaş University, 2020-2025) | Erasmus+ (Milano, 2022-2023)

## 🚀 Project Overview

This portfolio isn't just a website—it's a complete desktop operating system simulation that runs entirely in your browser. Built to demonstrate advanced frontend architecture, it features:

- **Virtual File System (VFS)** - Full CRUD operations with IndexedDB persistence
- **Window Management** - Draggable, resizable windows with z-index orchestration
- **Dual-Mode UI** - Responsive desktop experience + native mobile app shell
- **GitHub Integration** - Live project showcase with ETag caching
- **Built-in Apps** - PDF viewer, file explorer, markdown renderer, terminal, games
- **PWA Support** - Installable, offline-capable progressive web app

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Component architecture with type safety
- **Vite** - Lightning-fast build tool with HMR
- **Framer Motion** - Smooth animations and gestures
- **CSS Modules** - Scoped styling with CSS variables for theming

### State & Storage
- **Zustand** - Lightweight state management with modular slices
- **IndexedDB** - Client-side database for VFS (via `idb` wrapper)
- **localStorage** - User preferences and layout persistence

### Architecture
- **Virtual File System** - Hierarchical node structure with CRUD operations
- **Event Bus** - Pub/sub pattern for cross-component communication
- **Window Manager** - Transform-based positioning for 60fps performance
- **Mobile-First** - Adaptive rendering with touch gesture support

### External Integrations
- **PDF.js** - In-browser PDF rendering with zoom controls
- **GitHub API** - Repository fetching with rate-limit handling
- **Marked + DOMPurify** - Secure markdown rendering

### Deployment
- **Cloudflare Pages** - Git-based CI/CD with edge deployment
- **CSP Headers** - Content Security Policy for XSS protection
- **Service Worker** - Offline caching and background sync

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ymcbzrgn/Yamac-Bezirgan.git
cd Yamac-Bezirgan

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
/
├── src/
│   ├── os/                    # Core OS layer
│   │   ├── store/            # Zustand state slices
│   │   ├── vfs/              # Virtual File System (CRUD, seed)
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── eventBus.ts       # Event orchestration
│   ├── ui/                    # UI components
│   │   ├── Desktop.tsx       # Desktop environment
│   │   ├── Window.tsx        # Draggable window component
│   │   ├── Taskbar.tsx       # Application launcher
│   │   └── mobile/           # Mobile-specific components
│   ├── apps/                  # Applications (lazy-loaded)
│   │   ├── pdf-viewer/       # PDF.js integration
│   │   ├── file-explorer/    # VFS file browser
│   │   ├── browser/          # Iframe-based web browser
│   │   └── games/            # Interactive games
│   └── main.tsx              # Entry point
├── public/
│   ├── legacy/               # Previous portfolio version
│   ├── _headers              # Cloudflare security headers
│   └── manifest.webmanifest  # PWA configuration
└── CLAUDE.md                 # AI-assisted development log
```

## ✨ Key Features

### Desktop Experience
- **Multi-Window System** - Open multiple apps simultaneously with window controls
- **File Management** - Create, rename, move, delete files and folders
- **Drag & Drop** - Intuitive interactions with visual feedback
- **Context Menus** - Right-click actions for power users
- **Trash System** - Recoverable deletion with restore functionality

### Mobile Experience
- **App Launcher** - Grid-based home screen with gestures
- **Full-Screen Apps** - Native-like app experience
- **Swipe Gestures** - Swipe down to close, smooth transitions
- **Touch Optimized** - Large tap targets, responsive UI

### Performance
- **Code Splitting** - Lazy-loaded apps for minimal initial bundle
- **Transform-Based Animations** - GPU-accelerated window positioning
- **IndexedDB Caching** - Persistent state across sessions
- **ETag Validation** - Efficient GitHub API requests

## 🎨 Design Philosophy

This portfolio demonstrates:
- **System Architecture** - Modular, scalable codebase inspired by real operating systems
- **Performance Optimization** - 60fps animations, <2s initial load
- **User Experience** - Intuitive interactions on desktop and mobile
- **Code Quality** - TypeScript, error boundaries, idempotent operations
- **Creative Engineering** - Building a complete OS in the browser

## 📊 Technical Highlights

### VFS Implementation
- Idempotent CRUD operations with transaction rollback
- Circular dependency detection
- Quota management (50MB mobile, 1GB desktop)
- Conflict resolution for concurrent writes

### Window Management
- Z-index stack with automatic focus management
- Transform-based positioning (no layout thrashing)
- Resize constraints with aspect ratio preservation
- Minimize/maximize animations with state persistence

### Mobile Optimization
- Device detection (CSS `@media` + JS `userAgent`)
- Touch event handling with passive listeners
- Swipeable components with velocity detection
- Adaptive rendering (different component trees)

## 🤝 Contact

**Yamaç Bezirgan**
📧 [contact@yamacbezirgan.com](mailto:contact@yamacbezirgan.com)
🌐 [www.yamacbezirgan.com](https://www.yamacbezirgan.com)
💼 [LinkedIn](https://linkedin.com/in/yamacbezirgan)
🐙 [GitHub](https://github.com/ymcbzrgn)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🇹🇷 Türkçe

# Yamaç Bezirgan - İnteraktif Masaüstü Portfolyo

> Tarayıcınızda çalışan tamamen fonksiyonel bir masaüstü işletim sistemi simülasyonu. Full-stack geliştirme, AI/ML entegrasyonu ve yaratıcı mühendislik becerilerin sergiliyor.

## 👨‍💻 Hakkımda

Altınbaş Üniversitesi Bilgisayar Mühendisliği mezunuyum ve uçtan uca, kullanıcı odaklı ürünler geliştirme konusunda pratik deneyime sahibim. Şu anda Arketic AI'da ML & AI Otomasyon Stajyeri olarak çalışıyorum. Teknik titizliği yaratıcı, ürün odaklı bir yaklaşımla birleştirerek güvenilir ve yenilikçi yazılımlar sunuyorum.

Università degli Studi di Milano'da Erasmus+ deneyimi ve yapay zeka alanındaki artan odağımla, dinamik ve işbirlikçi ekiplerde etkili projelere katkıda bulunmaya hazırım.

**Güncel Rol:** ML & AI Otomasyon Stajyeri @ Arketic AI
**Odak:** Full-Stack Geliştirme, AI/ML Entegrasyonu, Ürün Mühendisliği
**Eğitim:** Bilgisayar Mühendisliği (Altınbaş Üniversitesi, 2020-2025) | Erasmus+ (Milano, 2022-2023)

## 🚀 Proje Özeti

Bu portfolyo sadece bir web sitesi değil—tarayıcınızda çalışan tam bir masaüstü işletim sistemi simülasyonu. Gelişmiş frontend mimarisini göstermek için tasarlandı ve şu özellikleri içeriyor:

- **Sanal Dosya Sistemi (VFS)** - IndexedDB ile kalıcı CRUD operasyonları
- **Pencere Yönetimi** - Sürüklenebilir, boyutlandırılabilir pencereler ve z-index yönetimi
- **İki Modlu UI** - Masaüstü deneyimi + mobil uygulama arayüzü
- **GitHub Entegrasyonu** - ETag önbellekleme ile canlı proje vitrini
- **Yerleşik Uygulamalar** - PDF görüntüleyici, dosya yöneticisi, markdown editör, terminal, oyunlar
- **PWA Desteği** - Kurulabilir, çevrimdışı çalışabilen progresif web uygulaması

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** + **TypeScript** - Tip güvenli bileşen mimarisi
- **Vite** - HMR ile hızlı derleme
- **Framer Motion** - Akıcı animasyonlar ve jestler
- **CSS Modules** - Tema sistemi için CSS değişkenleri

### State & Depolama
- **Zustand** - Modüler dilimlerle hafif state yönetimi
- **IndexedDB** - VFS için istemci taraflı veritabanı
- **localStorage** - Kullanıcı tercihleri ve düzen kalıcılığı

### Mimari
- **Sanal Dosya Sistemi** - CRUD operasyonları ile hiyerarşik node yapısı
- **Event Bus** - Bileşenler arası iletişim için pub/sub pattern
- **Pencere Yöneticisi** - 60fps performans için transform tabanlı konumlandırma
- **Mobil Öncelikli** - Dokunmatik jest desteği ile adaptif render

### Harici Entegrasyonlar
- **PDF.js** - Tarayıcı içi PDF görüntüleme
- **GitHub API** - Rate-limit yönetimi ile repo getirme
- **Marked + DOMPurify** - Güvenli markdown render

### Deployment
- **Cloudflare Pages** - Git tabanlı CI/CD ve edge deployment
- **CSP Headers** - XSS koruması için Content Security Policy
- **Service Worker** - Çevrimdışı önbellekleme ve arka plan senkronizasyonu

## 📦 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/ymcbzrgn/Yamac-Bezirgan.git
cd Yamac-Bezirgan

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production için derle
npm run build

# Production build'i önizle
npm run preview
```

## 🤝 İletişim

**Yamaç Bezirgan**
📧 [contact@yamacbezirgan.com](mailto:contact@yamacbezirgan.com)
🌐 [www.yamacbezirgan.com](https://www.yamacbezirgan.com)
💼 [LinkedIn](https://linkedin.com/in/yamacbezirgan)
🐙 [GitHub](https://github.com/ymcbzrgn)

## 📄 Lisans

Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) altında mevcuttur.
