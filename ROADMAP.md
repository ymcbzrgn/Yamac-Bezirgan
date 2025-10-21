# UBUNTU×XP DESKTOP PORTFOLIO ROADMAP

## 0) Özet Zaman Çizelgesi

**Faz Hedefleri ve Zaman Pencereleri:**
- **MVP (Faz 1):** 2–3 hafta | Mevcut site arşivlenmesi, yeni masaüstü iskeleti, temel pencere yönetimi, VFS temelleri
- **V1.0 (Faz 2):** 3–4 hafta | Tüm uygulamalar, mobil UX, PWA, tam tema sistemi, Cloudflare deployment
- **V1.1 (Faz 3):** 2–3 hafta | Performans optimizasyonu, analytics, advanced features, polish

**Kritik Yol:**
```
✅ Archive Legacy → ✅ Build System → ✅ OS Store → ⏳ Window Manager → ✅ VFS Core →
⏳ Desktop Rendering → App Framework → Individual Apps → Mobile UX →
PWA → Performance Tuning → Production Launch
```

**Altyapı Foundation (Faz 0) - Tamamlandı (2025-10-20):**
- ✅ Legacy build pipeline (1-2 saat)
- ✅ State management (Zustand, 4 slices, 2-3 saat)
- ✅ VFS Core (IndexedDB, CRUD, seed, 3-4 saat)
- ✅ Desktop shell component (basic render)
- ✅ Production build test (59.69KB gzip, <180KB hedef)

**Ana Bağımlılıklar:**
- Build system olmadan hiçbir kod çalışmaz
- OS Store olmadan window manager ve VFS çalışmaz
- VFS olmadan apps mount edemez
- Desktop rendering olmadan kullanıcı hiçbir şey göremez
- App framework olmadan individual apps inşa edilemez

---

## 1) MVP (Faz 1)

**Hedef:** Eski siteyi güvenle arşivleyip, yeni masaüstü portfolyonun iskeletini ayağa kaldırmak - kullanıcı masaüstünde 2-3 pencere açıp kapatabilir, ikonları sürükleyebilir, temel VFS işlemleri yapabilir.

### Makro Görevler (Epikler)

#### Epik-1: Legacy Site Archive & Build Pipeline ✅ TAMAMLANDI (2025-10-20)

**Gerçek Süre:** 1-2 saat (Tahmin: 11 saat - çok verimli!)

**Mikro Görevler:**

1. ✅ **Create archive branch and move legacy codebase to old/ directory**
   - **Amaç:** Mevcut tüm kodu güvenli yedekle
   - **Çıktı:** `old/` klasöründe tam çalışır kopya (legacy-src/, legacy-public/, vite.config.legacy.ts)
   - **Kabul Kriteri:** `git diff --name-status` ile tüm dosyalar old/ altında; kökte yalnızca package.json, README.md, .gitignore kaldı
   - **Tahmin:** 2 saat | **Gerçek:** <30 dk
   - **Bağımlılıklar:** Yok
   - **Durum:** ✅ Tamamlandı

2. ✅ **Configure legacy build system with separate Vite config**
   - **Amaç:** Eski sitenin bağımsız build alınabilmesini sağla
   - **Çıktı:** `old/vite.config.legacy.ts` + `old/package.json` (build:legacy script)
   - **Kabul Kriteri:** `npm run build:legacy` komutu `old/dist-legacy/` üretir, içerik index.html + assets/
   - **Tahmin:** 3 saat | **Gerçek:** <20 dk
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı

3. ✅ **Implement legacy-to-public copy automation in build script**
   - **Amaç:** Eski site build çıktısını yeni sitenin public/legacy/ altına otomatik kopyala
   - **Çıktı:** `scripts/copy-legacy.cjs` (Node.js script with size reporting)
   - **Kabul Kriteri:** `npm run build:all` sonrası `dist/legacy/index.html` mevcut, tarayıcıda `/legacy/` açılınca eski site görünür
   - **Tahmin:** 1 saat | **Gerçek:** <15 dk
   - **Bağımlılıklar:** #2
   - **Durum:** ✅ Tamamlandı

4. ✅ **Setup new Vite+TypeScript project scaffold**
   - **Amaç:** Yeni portfolyo için modern build araçları kur
   - **Çıktı:** `vite.config.ts`, `tsconfig.json`, `package.json` (scripts: dev, build, preview), `src/main.tsx`
   - **Kabul Kriteri:** `npm run dev` localhost'ta boş sayfa render eder, TypeScript hataları yok, HMR çalışır
   - **Tahmin:** 2 saat | **Gerçek:** <20 dk
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı

5. ✅ **Create unified build pipeline (build:all script)**
   - **Amaç:** Tek komutla hem eski hem yeni siteyi derle
   - **Çıktı:** `build:all` script: build:legacy → postbuild:legacy → build:new
   - **Kabul Kriteri:** `npm run build:all` sonrası `dist/` klasöründe yeni site + `dist/legacy/` eski site mevcut
   - **Tahmin:** 1 saat | **Gerçek:** <10 dk
   - **Bağımlılıklar:** #3, #4
   - **Durum:** ✅ Tamamlandı, build süresi <4s

6. ✅ **Setup ESLint + Prettier with TypeScript rules**
   - **Amaç:** Kod kalitesi ve stil tutarlılığı sağla
   - **Çıktı:** `.eslintrc.json`, `.prettierrc`, `.prettierignore`
   - **Kabul Kriteri:** `npm run lint` temiz geçer, format çalışır
   - **Tahmin:** 2 saat | **Gerçek:** <15 dk
   - **Bağımlılıklar:** #4
   - **Durum:** ✅ Tamamlandı (Husky hooks hazır ama henüz aktif değil)

---

#### Epik-2: OS Core Architecture & State Management ✅ TAMAMLANDI (2025-10-20)

**Gerçek Süre:** 2-3 saat (Tahmin: 22 saat - middleware kullanımı ile çok hızlandı!)

**Mikro Görevler:**

1. ✅ **Design and implement core type definitions**
   - **Amaç:** Tüm sistemde kullanılacak contract'ları tanımla
   - **Çıktı:** `src/os/types.ts` (VFSNode, WindowState, Settings, Events, AppManifest)
   - **Kabul Kriteri:** TypeScript derlenir, tüm tipler export edilir, JSDoc açıklamaları mevcut
   - **Tahmin:** 3 saat | **Gerçek:** <30 dk
   - **Bağımlılıklar:** Yok
   - **Durum:** ✅ Tamamlandı (206 satır, detaylı tip tanımları)

2. ✅ **Create Zustand store slices for desktop state**
   - **Amaç:** Masaüstü icon pozisyonları ve grid layout'u yönet
   - **Çıktı:** `src/os/store/desktopSlice.ts` (icons, gridSize, selection, actions)
   - **Kabul Kriteri:** Store test'i geçer, immer kullanarak immutable updates
   - **Tahmin:** 4 saat | **Gerçek:** <45 dk
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı (112 satır, 7 action)

3. ✅ **Create Zustand store slices for window management**
   - **Amaç:** Pencere durumlarını (açık, minimize, maximize, z-index) merkezi yönet
   - **Çıktı:** `src/os/store/windowsSlice.ts` (openWindow, closeWindow, minimize, maximize, focus, updateBounds)
   - **Kabul Kriteri:** Aynı anda 10 pencere açılıp kapatılabilir, z-index doğru sıralanır
   - **Tahmin:** 5 saat | **Gerçek:** <1 saat
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı (141 satır, 8 action, auto z-index increment)

4. ✅ **Create Zustand store slices for settings/preferences**
   - **Amaç:** Tema, mod (desktop/mobile), wallpaper tercihlerini yönet
   - **Çıktı:** `src/os/store/settingsSlice.ts` (updateSettings, resetSettings, toggleTheme, toggleMode)
   - **Kabul Kriteri:** localStorage'a otomatik persist edilir (root store middleware)
   - **Tahmin:** 3 saat | **Gerçek:** <30 dk
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı (118 satır, default settings tanımlı)

5. ✅ **Implement event bus for cross-component communication**
   - **Amaç:** Window → App, App → Window, System Events için pub/sub
   - **Çıktı:** `src/os/eventBus.ts` (on, off, emit, typed events)
   - **Kabul Kriteri:** Typed events, unsubscribe fonksiyonu, error handling
   - **Tahmin:** 3 saat | **Gerçek:** <30 dk (zaten Faz 2'de yapılmış)
   - **Bağımlılıklar:** Yok
   - **Durum:** ✅ Tamamlandı (singleton pattern, 70 satır)

6. ⏸️ **Create performance utilities (RAF scheduler, throttle/debounce)**
   - **Amaç:** Animasyon ve yoğun işlemler için perf helper'ları
   - **Çıktı:** `src/os/perf/scheduler.ts` (rafScheduler, throttleRaf, debounce)
   - **Kabul Kriteri:** 60fps'te 100 eşzamanlı raf callback'i hiç frame drop olmadan çalışır
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok
   - **Durum:** ⏸️ Ertelendi (Window drag implement edilince gerekecek)

**Ek Tamamlanan:**
- ✅ Root Zustand store (`src/os/store/index.ts`) - 137 satır
  - Middleware stack: devtools → persist → immer
  - 20+ selector hooks (useSettings, useIcons, useWindows, useVFSNodes vb.)
  - Action hooks (useDesktopActions, useWindowActions vb.)
  - localStorage persist (icons, gridSize, settings)
- ✅ VFS Slice placeholder (Epik-4'te gerçek DB ile değiştirildi)

---

#### Epik-3: Window Manager & Desktop Rendering ⏳ SONRAKI SPRINT

**Durum:** Placeholder component oluşturuldu (2025-10-20), tam MVP next sprint'te
**Tamamlanan Kısım:**
- ✅ `src/ui/Desktop.tsx` - Basic desktop shell (wallpaper, icon grid, taskbar placeholder)
- ✅ `src/ui/Desktop.css` - Grid layout + z-index layers
- ✅ VFS auto-load on mount (useEffect → loadVFS)
- ✅ Emoji placeholder icons (📁 folder, 📄 file)

**Tahmin:** 31 saat | **Kalan:** ~31 saat (tam window manager + interactions)

**Mikro Görevler:**

1. **Implement base Window component with drag-drop**
   - **Amaç:** Kullanıcı pencereleri mouse ile sürükleyebilir
   - **Çıktı:** `src/ui/Window.tsx` (drag handlers, transform-based positioning)
   - **Kabul Kriteri:** 10 pencere aynı anda sürüklenebilir, INP p95 < 100ms, transform kullanımı layout thrashing yok
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** Epik-2#3

2. **Add resize handles to Window component**
   - **Amaç:** Pencere boyutları mouse ile değiştirilebilir
   - **Çıktı:** 8 yön resize handle (N, S, E, W, NE, NW, SE, SW), min/max bounds
   - **Kabul Kriteri:** Resize sırasında 60fps, içerik taşmaz, min 200x150px bounds uygulanır
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #1

3. **Implement window minimize/maximize/restore logic**
   - **Amaç:** Titlebar butonları ile pencere durumlarını kontrol et
   - **Çıktı:** Titlebar butonları, state transitions, animasyonlar (scale/opacity)
   - **Kabul Kriteri:** Minimize animasyonu taskbar'a, maximize tam ekran, restore önceki bounds'a dönüş
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #1

4. **Create DesktopIcon component with grid snapping**
   - **Amaç:** Masaüstü ikonları sürüklenince grid'e otur
   - **Çıktı:** `src/ui/DesktopIcon.tsx` (drag, snap-to-grid, double-click open)
   - **Kabul Kriteri:** 40 ikon 80x80 grid'e snap olur, pozisyonlar localStorage'a persist edilir
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** Epik-2#2

5. **Implement Taskbar with window switcher**
   - **Amaç:** Açık pencereleri göster, tıklamayla focus/restore et
   - **Çıktı:** `src/ui/Taskbar.tsx` (window list, active state, minimize tıklamasında restore)
   - **Kabul Kriteri:** 10 pencere aynı anda listede, active olanı highlight, tıklama window store'u günceller
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Epik-2#3

6. **Create right-click ContextMenu system**
   - **Amaç:** Desktop/icon sağ tık menüsü
   - **Çıktı:** `src/ui/ContextMenu.tsx` (position, dismiss on outside click, nested menus)
   - **Kabul Kriteri:** Menü viewport dışına taşmaz, ESC kapatır, nested menu 3 seviye destekler
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

7. **Implement z-index management and window focus system**
   - **Amaç:** Tıklanan pencere öne gelir, z-index충돌 없음
   - **Çıktı:** Focus handler, z-index hesaplama (base + stack order)
   - **Kabul Kriteri:** 20 pencerede doğru z-index, focus ring görünür, keyboard navigation (Tab) çalışır
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Epik-2#3

---

#### Epik-4: Virtual File System (VFS) Core 🔄 KISMEN TAMAMLANDI (2025-10-20)

**Gerçek Süre:** 3-4 saat (Tahmin: 25 saat - idb library kullanımı ile 6x hızlandı!)

**Mikro Görevler:**

1. ✅ **Design VFS node schema and IndexedDB adapter interface**
   - **Amaç:** Dosya/klasör yapısını kalıcı depolamak için contract belirle
   - **Çıktı:** `src/os/vfs/db.ts` (Schema + singleton DB connection)
   - **Kabul Kriteri:** Schema TypeScript'te tanımlı, JSDoc ile açıklanmış
   - **Tahmin:** 3 saat | **Gerçek:** <45 dk
   - **Bağımlılıklar:** Epik-2#1
   - **Durum:** ✅ Tamamlandı (161 satır)
     - `ubuntu-xp-vfs` database (version 1)
     - `nodes` store (indexes: parentId, type, createdAt)
     - `contents` store (large blobs)
     - Utility: getDB(), closeDB(), deleteDB(), isDBEmpty(), getDBStats()

2. ✅ **Implement IndexedDB CRUD operations**
   - **Amaç:** Düğümleri DB'ye yaz/oku/güncelle/sil
   - **Çıktı:** `src/os/vfs/crud.ts` (create, read, update, delete, move, getPath)
   - **Kabul Kriteri:** Transaction rollback çalışır, circular dependency check, idempotent
   - **Tahmin:** 6 saat | **Gerçek:** <1.5 saat
   - **Bağımlılıklar:** #1
   - **Durum:** ✅ Tamamlandı (295 satır)
     - createNode() - conflict detection
     - getNode(), getAllNodes(), getNodesByParent()
     - updateNode() - partial update + auto-timestamp
     - deleteNode() - recursive delete with descendants
     - moveNode() - circular dependency validation
     - getNodePath() - breadcrumb array
     - Content ops: setContent(), getContent(), deleteContent()

3. ✅ **Create VFS store slice with tree operations**
   - **Amaç:** Dosya ağacını bellekte yönet, CRUD API'leri expose et
   - **Çıktı:** `src/os/store/vfsSlice.ts` (Real IndexedDB integration)
   - **Kabul Kriteri:** Parent-child referansları tutarlı, circular reference koruması
   - **Tahmin:** 5 saat | **Gerçek:** <1 saat
   - **Bağımlılıklar:** #2
   - **Durum:** ✅ Tamamlandı (311 satır)
     - Optimistic updates (UI hemen güncelle, DB async)
     - Rollback on error (DB fail → state revert)
     - In-memory cache (Record<id, VFSNode>)
     - loadVFS() - seed + load from DB
     - All CRUD operations with error handling
     - Helper: getAllDescendants() for recursive deletes

4. ✅ **Implement seed data initialization (default desktop icons)**
   - **Amaç:** İlk yüklemede CV.pdf, GitHub.lnk, Games/, Trash/ vb. oluştur
   - **Çıktı:** `src/os/vfs/seed.ts` (seedDefaultDesktop)
   - **Kabul Kriteri:** Boş DB'de ilk yüklemede 8 default ikon oluşur, idempotent
   - **Tahmin:** 3 saat | **Gerçek:** <45 dk
   - **Bağımlılıklar:** #3
   - **Durum:** ✅ Tamamlandı (158 satır)
     - 8 default nodes: root, home, projects, cv-pdf, games, trash, linkedin-link, github-link
     - Idempotent seeding (isDBEmpty() check)
     - getDefaultIconLayout() for grid positions

5. ⏳ **Add export/import VFS as JSON functionality**
   - **Amaç:** Kullanıcı tüm sistemini yedekleyip geri yükleyebilir
   - **Çıktı:** `exportVFS()`, `importVFS(json)` fonksiyonları
   - **Kabul Kriteri:** Export→Import birebir aynı tree yapısı, collision handling
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #3
   - **Durum:** ⏳ Sonraki sprint (Settings app'te implement edilecek)

6. ⏳ **Implement folder navigation and breadcrumb logic**
   - **Amaç:** Dosya gezgininde klasörlerde gezinme
   - **Çıktı:** Breadcrumb component + navigation hooks
   - **Kabul Kriteri:** 5 seviye iç içe klasör gezintisi, back/forward
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #3
   - **Durum:** ⏳ Sonraki sprint (File Explorer app'te implement edilecek)
     - Not: getNodePath() zaten slice'ta mevcut

---

### Sınama & Çıkarma (Hardening)

**Güvenlik:**
- [ ] localStorage/IndexedDB size limit test (quotaExceeded hatası yakalama)
- [ ] XSS test: Markdown/HTML içeriklerine `<script>` inject denemesi (DOMPurify sonrası temiz)
- [ ] CSP violation manual test (console'da hata yok)

**Performans:**
- [ ] LCP p95 < 2.5s (initial desktop render)
- [ ] INP p95 < 100ms (window drag, icon move)
- [ ] CLS p95 < 0.1 (layout shifts none)
- [ ] JS bundle gzip < 180KB (initial load)

**Hata Bütçesi:**
- Crash-free rate > 99.5%
- IndexedDB operation failure rate < 0.1%

**Gözlemlenebilirlik:**
- [ ] Console error/warning loglama (production'da structured JSON)
- [ ] Performance mark/measure kritik işlemlerde

---

### 📊 MVP Faz 1 - İlerleme Özeti

**Tamamlanan (2025-10-20):**
- ✅ Epik-1: Legacy Build Pipeline (6/6 task, 1-2 saat)
- ✅ Epik-2: State Management (5/6 task, 2-3 saat)
- 🔄 Epik-4: VFS Core (4/6 task, 3-4 saat)
- 🔄 Epik-3: Desktop Shell (placeholder, ~1 saat)

**Toplam Çalışma Süresi:** ~7-10 saat (Tahmin: ~88 saat - efficiency gain 8-9x!)

**Sonraki Sprint Hedefi:**
1. Epik-3 tamamlama (Window Manager tam implementasyonu)
2. Epik-4 son 2 task (export/import, navigation)
3. İlk end-to-end test: Icon double-click → Window açılır → PDF render

**Kritik Başarılar:**
- Bundle size 59.69KB (hedef <180KB, %67 altında)
- TypeScript 0 error
- Real IndexedDB integration (no mocks)
- Production build <4s
- Middleware stack efficiency (devtools+persist+immer)

**Teknik Borç:** Yok - tüm pattern'ler temiz, test edilebilir, dokümante edilmiş

---

### Kısa Gerekçeler (Rationale)

1. **Kapsam Kesintisi:** MVP'de mobil UX, PWA, tüm uygulamalar yok - yalnızca core masaüstü, pencere yönetimi, VFS. Bu sayede 2-3 haftada test edilebilir uçtan uca akış sağlanır.

2. **Build Pipeline Önceliği:** Eski siteyi arşivlemeden yeni kod yazılmaz; build sistemi olmadan hiçbir kod çalışmaz. Bu nedenle Epik-1 critical path başlangıcı.

3. **State Management Erken:** Zustand store'ları hemen kurulur çünkü tüm UI bileşenleri buna bağımlı. Geç kurulursa refactor maliyeti yüksek.

4. **Window Manager Performansı:** Transform-based positioning ve RAF kullanımı INP < 100ms hedefine ulaşmak için zorunlu. Layout thrashing'den kaçınmak kritik.

5. **VFS Idempotency:** Seed data ve import işlemleri idempotent olmalı ki kullanıcı birden fazla import yapsa bile tree bozulmasın, duplicate oluşmasın.

6. **Güvenlik Temeli:** MVP'de CSP, DOMPurify kurulumu minimal ama zorunlu - ileriki fazlarda Markdown render varsa güvenlik zafiyeti olmamalı.

---

## 2) V1.0 (Faz 2)

**Hedef:** Tüm uygulamaları (PDF, GitHub, Browser, Games), mobil UX'i, PWA'i, tema sistemini tamamlayıp Cloudflare Pages'e production deploy etmek - kullanıcı her cihazda portfolyoyu tam özelliklerle kullanabilir.

### Makro Görevler (Epikler)

#### Epik-5: Application Framework & Launcher

**Mikro Görevler:**

1. **Design app manifest schema and registration system**
   - **Amaç:** Uygulamaların system'e kendini tanıtması için standart
   - **Çıktı:** `src/apps/types.ts` (AppManifest: id, name, icon, component, defaultSize, capabilities)
   - **Kabul Kriteri:** 5 app manifest tanımlanır, registry'de listelenebilir
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

2. **Create lazy-loading app loader with code-splitting**
   - **Amaç:** App açılınca ilgili chunk download edilsin
   - **Çıktı:** `src/apps/appLoader.ts` (React.lazy wrapper, suspense fallback)
   - **Kabul Kriteri:** Vite build'de her app ayrı chunk, ilk yüklemede yalnızca loader kodu var (< 5KB)
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #1

3. **Implement app lifecycle hooks (onMount, onUnmount, onFocus, onBlur)**
   - **Amaç:** App'ler window events'e react edebilsin (pause game, cleanup)
   - **Çıktı:** Lifecycle context/hooks, window store ile entegrasyon
   - **Kabul Kriteri:** Oyun window minimize olunca pause, focus dönünce resume
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #2, MVP Epik-2#3

4. **Create file extension → app association system**
   - **Amaç:** .pdf dosyası açılınca PdfViewer, .md açılınca TextEditor
   - **Çıktı:** Mime-type mapping, default app resolver
   - **Kabul Kriteri:** 5 farklı extension doğru app'i tetikler, user override tercih edilebilir
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #1

5. **Build app-to-app communication API (postMessage pattern)**
   - **Amaç:** Browser app içinden file:// linkler TextEditor'ü açabilsin
   - **Çıktı:** EventBus üzerinden typed messages (OPEN_FILE, NAVIGATE_TO)
   - **Kabul Kriteri:** App A'dan App B'ye message gönderilir, B doğru react eder, mesaj loop yok
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #1, MVP Epik-2#5

---

#### Epik-6: Individual Applications

**Mikro Görevler:**

1. **Implement PdfViewer with PDF.js lazy-load**
   - **Amaç:** CV.pdf'i window içinde göster, indirilebilir yap
   - **Çıktı:** `src/apps/pdf-viewer/PdfViewer.tsx`, zoom/page navigation, download button
   - **Kabul Kriteri:** 5MB PDF ilk render p95 < 1200ms, zoom 50%-200%, keyboard navigation (PgUp/PgDn)
   - **Tahmin:** 8 saat
   - **Bağımlılıklar:** Epik-5#2

2. **Build GithubViewer with public repos list**
   - **Amaç:** GitHub API'den public repos çek, kartlar halinde listele
   - **Çıktı:** `src/apps/github-viewer/GithubViewer.tsx`, repo card grid, "Open on GitHub" link
   - **Kabul Kriteri:** API call < 3s, ETag header kullanılır, rate-limit aşımında cache-first + retry button
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** Epik-5#2

3. **Add README preview modal with Markdown render + DOMPurify**
   - **Amaç:** Repo kartına tıklayınca README sanitize edilip gösterilir
   - **Çıktı:** Modal component, marked.js + DOMPurify, syntax highlight (highlight.js)
   - **Kabul Kriteri:** `<script>` tag'leri strip edilir, external images yüklenir (CORS bypass via proxy yok ise fallback), code blocks highlight
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #2

4. **Implement Browser app with iframe + fallback logic**
   - **Amaç:** URL gir → iframe göster; X-Frame-Options varsa preview + new tab
   - **Çıktı:** `src/apps/browser/Browser.tsx`, address bar, load status, error handling
   - **Kabul Kriteri:** Gömülebilen site iframe'de açılır, gömülemeyenler preview + button, sandbox="allow-scripts allow-same-origin"
   - **Tahmin:** 7 saat
   - **Bağımlılıklar:** Epik-5#2

5. **Create LinkedInCard preview component (no embed)**
   - **Amaç:** LinkedIn iframe gömülemez, kart + "Open in new tab" göster
   - **Çıktı:** `src/apps/linkedin/LinkedInCard.tsx`, profil bilgisi hardcoded, CTA button
   - **Kabul Kriteri:** Tıklama `window.open(url, '_blank', 'noopener,noreferrer')`
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Epik-5#2

6. **Build Games folder with Snake game (canvas)**
   - **Amaç:** Retro oyun, pause/resume, skor localStorage
   - **Çıktı:** `src/apps/games/snake/Snake.tsx`, keyboard control, collision detection
   - **Kabul Kriteri:** 60fps, focus kaybında pause, high score persist edilir
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** Epik-5#2,#3

7. **Add 2048 game to Games folder**
   - **Amaç:** İkinci oyun, farklı mekanik
   - **Çıktı:** `src/apps/games/2048/Game2048.tsx`, swipe/arrow input, win condition (2048 tile)
   - **Kabul Kriteri:** Animasyonlar smooth, undo button, high score persist
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** Epik-5#2,#3

8. **Implement Trash app with old-site iframe easter egg**
   - **Amaç:** Çöp kutusunda old-site.webp, açınca `/legacy/` iframe
   - **Çıktı:** `src/apps/trash/Trash.tsx`, iframe `/legacy/index.html`, CSP check
   - **Kabul Kriteri:** Eski site iframe'de açılır, frame-ancestors başarısız ise yeni sekmede fallback
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** MVP Epik-1#3, Epik-5#2

9. **Build Settings app (theme, mode, wallpaper)**
   - **Amaç:** Kullanıcı tema/mod değiştirsin, wallpaper seçsin
   - **Çıktı:** `src/apps/settings/Settings.tsx`, radio buttons, color picker, wallpaper grid
   - **Kabul Kriteri:** Değişiklik anında uygulanır, localStorage persist edilir
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** MVP Epik-2#4, Epik-5#2

---

#### Epik-7: Theme System & Visual Polish

**Mikro Görevler:**

1. **Define Ubuntu×XP token sets (CSS variables)**
   - **Amaç:** Renk, shadow, border-radius, font varyantlarını CSS custom properties olarak tanımla
   - **Çıktı:** `src/themes/tokens.css` (--color-primary, --shadow-window, --radius-lg)
   - **Kabul Kriteri:** 3 tema (light, dark, high-contrast) tanımlanır, değişken değiştirince tüm UI güncellenir
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

2. **Create theme switcher logic**
   - **Amaç:** Runtime'da tema değiştirme, localStorage persist
   - **Çıktı:** `src/os/theme.ts` (applyTheme, listenSystemPreference)
   - **Kabul Kriteri:** Tema değişimi < 50ms, system dark mode detect edilir (prefers-color-scheme)
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #1, MVP Epik-2#4

3. **Design window chrome (titlebar, borders, shadows)**
   - **Amaç:** XP-style butonlar + Ubuntu yuvarlak köşeler
   - **Çıktı:** `src/ui/Window.module.css`, hover/active states, focus ring
   - **Kabul Kriteri:** 3 temada da okunabilir, accessibility contrast ratio > 4.5:1
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #1

4. **Implement wallpaper system (image, color, gradient)**
   - **Amaç:** Masaüstü arkaplan özelleştirme
   - **Çıktı:** Wallpaper component, 5 preset + custom upload (FileReader)
   - **Kabul Kriteri:** Image lazy-load, 4K wallpaper < 2MB, CSS background-size: cover
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** MVP Epik-2#4

5. **Add icon pack system (default + alternatives)**
   - **Amaç:** Kullanıcı ikon setini değiştirebildi (Ubuntu-style vs XP-style)
   - **Çıktı:** Icon registry, SVG sprite, settings'den seçim
   - **Kabul Kriteri:** İkon değişimi anında yansır, SVG sprite < 100KB
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #1

6. **Polish animations (window open/close, minimize/restore)**
   - **Amaç:** Smooth transitions, micro-interactions
   - **Çıktı:** CSS transitions + JS FLIP animations
   - **Kabul Kriteri:** Animasyonlar 60fps, prefers-reduced-motion uyumlu
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** MVP Epik-3#3

---

#### Epik-8: Mobile UX & Responsive Design

**Mikro Görevler:**

1. **Detect device mode (touch vs pointer, screen size)**
   - **Amaç:** Viewport < 768px ise mobil mod, touch device ise gesture support
   - **Çıktı:** `src/os/device.ts` (useDeviceMode hook)
   - **Kabul Kriteri:** Tablet/phone'da mobil mod aktif, desktop'ta masaüstü mod, rotate edince re-detect
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

2. **Build mobile Launcher grid (replaces desktop icons)**
   - **Amaç:** Mobilede ikonlar grid layout, kaydırılabilir
   - **Çıktı:** `src/ui/mobile/Launcher.tsx`, long-press context menu
   - **Kabul Kriteri:** 40 ikon grid'de, long-press 500ms sonra menü, swipe scroll smooth
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** #1

3. **Create mobile Sheet component (fullscreen app container)**
   - **Amaç:** Uygulamalar mobilde sheet olarak açılır, alttan yukarı swipe ile dismiss
   - **Çıktı:** `src/ui/mobile/Sheet.tsx`, gesture handling (react-use-gesture)
   - **Kabul Kriteri:** Swipe down > 100px ise close, haptic feedback (vibrate API), backdrop blur
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #1

4. **Implement mobile app switcher (bottom drawer)**
   - **Amaç:** Açık uygulamalar arasında geçiş (Android-style recents)
   - **Çıktı:** `src/ui/mobile/AppSwitcher.tsx`, horizontal scroll, thumbnail snapshots
   - **Kabul Kriteri:** 10 app thumbnail < 5s oluşturulur (html2canvas lazy), swipe dismiss app
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** #3

5. **Adapt context menus to mobile (bottom sheet menu)**
   - **Amaç:** Long-press menü mobilde bottom sheet olarak açılır
   - **Çıktı:** Mobil-specific menu rendering, touch-friendly button size (min 44px)
   - **Kabul Kriteri:** Menu items tappable, sheet animasyonu smooth
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #3

6. **Add mobile icon reordering (drag-and-drop in launcher)**
   - **Amaç:** Kullanıcı launcher'da ikonları sürükleyip sıralayabilir
   - **Çıktı:** react-beautiful-dnd entegrasyonu, position persist
   - **Kabul Kriteri:** Sürükleme 60fps, pozisyon localStorage'a kaydedilir
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #2

---

#### Epik-9: PWA & Offline Support

**Mikro Görevler:**

1. **Create manifest.webmanifest with icons**
   - **Amaç:** PWA install promptu tetikle
   - **Çıktı:** `public/manifest.webmanifest`, 192x192 + 512x512 PNG icons
   - **Kabul Kriteri:** Lighthouse PWA audit geçer, "Add to Home Screen" Chrome'da görünür
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

2. **Implement Service Worker with Workbox**
   - **Amaç:** Offline fallback, static asset cache
   - **Çıktı:** `src/sw.ts`, precache static files, runtime cache strategies
   - **Kabul Kriteri:** Offline modda app shell açılır, dinamik API call'lar graceful fail
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** #1

3. **Add SW update notification**
   - **Amaç:** Yeni sürüm geldiğinde kullanıcıya bildir
   - **Çıktı:** Toast notification, "Reload to update" button
   - **Kabul Kriteri:** SW güncelleme algılanır, button tıklanınca skipWaiting + reload
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #2

4. **Implement offline data sync (IndexedDB queue)**
   - **Amaç:** Offline'da VFS değişiklikleri queue'ya alınıp online olunca sync
   - **Çıktı:** Sync queue, background sync API (optional), retry logic
   - **Kabul Kriteri:** 10 offline operation queue'ya alınır, online olunca sırayla işlenir
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #2, MVP Epik-4#2

5. **Add install prompt UI**
   - **Amaç:** Kullanıcıya PWA install banner göster
   - **Çıktı:** beforeinstallprompt event handler, custom install button
   - **Kabul Kriteri:** Banner 3. ziyarette gösterilir (localStorage counter), dismiss edince 7 gün sonra tekrar
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #1

---

#### Epik-10: Cloudflare Pages Deployment & CI/CD

**Mikro Görevler:**

1. **Setup Cloudflare Pages project**
   - **Amaç:** GitHub repo'yu Cloudflare'e bağla
   - **Çıktı:** Cloudflare dashboard'da proje, build settings
   - **Kabul Kriteri:** Git push ile otomatik deploy tetiklenir
   - **Tahmin:** 1 saat
   - **Bağımlılıklar:** MVP Epik-1#5

2. **Configure build command and environment variables**
   - **Amaç:** Build parametrelerini ayarla (NODE_VERSION, npm run build:all)
   - **Çıktı:** Build settings, env vars (ör. VITE_API_BASE_URL)
   - **Kabul Kriteri:** Build başarılı tamamlanır (< 5 min), dist/ publish edilir
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** #1

3. **Add _headers file for CSP and security headers**
   - **Amaç:** Production'da güvenlik başlıkları serve et
   - **Çıktı:** `public/_headers` (CSP, X-Frame-Options, Permissions-Policy)
   - **Kabul Kriteri:** securityheaders.com A+ skor, CSP violation yok
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

4. **Add _redirects for SPA routing**
   - **Amaç:** Tüm route'lar index.html'e fallback
   - **Çıktı:** `public/_redirects` (`/*  /index.html  200`)
   - **Kabul Kriteri:** /about gibi route'lar 404 yerine SPA içinde handle edilir
   - **Tahmin:** 1 saat
   - **Bağımlılıklar:** Yok

5. **Setup preview deployments for PRs**
   - **Amaç:** Her PR için unique URL
   - **Çıktı:** Cloudflare preview ayarı, PR comment ile link
   - **Kabul Kriteri:** PR açılınca 2 dk içinde preview URL mevcut
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** #1

6. **Configure custom domain and SSL**
   - **Amaç:** yamacinbezirgan.dev gibi domain'e bağla
   - **Çıktı:** DNS records, HTTPS redirect
   - **Kabul Kriteri:** Domain açılınca site yüklenir, HTTPS zorunlu, HSTS header
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** #1

---

### Operasyonelleştirme

**CI/CD Olgunluğu:**
- [ ] Automated tests run on PR (unit + integration)
- [ ] Lighthouse CI checks (LCP, INP, CLS thresholds)
- [ ] Bundle size budget enforcement (< 180KB gzip)

**Feature Flags/Canary:**
- [ ] LaunchDarkly veya custom flag system (opsiyonel - V1.1'de)
- [ ] Canary deployment: %10 traffic yeni sürüme

**SLO Gözden Geçirme:**
- [ ] Uptime > 99.9% (Cloudflare Pages SLA)
- [ ] API success rate > 99.5% (GitHub API)
- [ ] Client error rate < 1%

**Maliyet Sınama:**
- [ ] Cloudflare Pages Free Tier limits (500 build/month, 100GB bandwidth)
- [ ] IndexedDB quota monitoring (10% doluluğunda uyarı)

---

### Kısa Gerekçeler (Rationale)

1. **App Framework Önce:** Tüm uygulamalar Epik-5'teki framework'e bağımlı. Erken kurmazsak her app için tekrar wheel invent ederiz.

2. **Mobil UX Ayrı Epik:** Desktop ve mobile ayrı düşünülmeli, responsive değil adaptive yaklaşım. Bu nedence ayrı UI component'leri (Launcher, Sheet, AppSwitcher).

3. **PWA Kritik:** Offline support ve install prompt modern portfolyo için must-have. IndexedDB zaten var, SW ekleyince sıfır maliyetle PWA olur.

4. **Cloudflare Pages Seçimi:** Serversiz, Git-based, global CDN, ücretsiz SSL, preview deployment - tüm gereksinimler karşılanır.

5. **Güvenlik Headers Erken:** CSP ve security headers production'a gitmeden önce ayarlanmalı, sonradan eklemek breaking change riski taşır.

6. **Tema Sistemi Esneklik:** CSS variables kullanarak runtime tema değişimi hem performanslı hem de JavaScript'siz (future-proof).

---

## 3) V1.1 (Faz 3)

**Hedef:** Performans optimizasyonu, analytics entegrasyonu, gelişmiş özellikler (ör. dosya arama, klavye kısayolları, accessibility iyileştirmeleri) ve son polish - portfolyo production-ready ve ölçeklenebilir.

### Makro Görevler (Epikler)

#### Epik-11: Performance Optimization & Bundle Analysis

**Mikro Görevler:**

1. **Run Lighthouse audit and identify bottlenecks**
   - **Amaç:** Performans zayıf noktalarını ölç
   - **Çıktı:** Lighthouse rapor (JSON), actionable items listesi
   - **Kabul Kriteri:** LCP, INP, CLS ölçümleri baseline olarak kaydedilir
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

2. **Implement image optimization pipeline (AVIF/WebP + responsive)**
   - **Amaç:** Görselleri modern formatlarla serve et
   - **Çıktı:** Vite plugin (vite-imagetools), `<picture>` tag'leri
   - **Kabul Kriteri:** PNG/JPEG yerine AVIF+WebP fallback, dosya boyutu 60% azalır
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

3. **Add resource hints (preconnect, dns-prefetch, preload)**
   - **Amaç:** Kritik kaynakları erken yükle (GitHub API, font)
   - **Çıktı:** `<link rel="preconnect">` index.html'de, critical CSS inline
   - **Kabul Kriteri:** LCP 200ms iyileşir
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

4. **Implement code-splitting for heavy modules (PDF.js, games)**
   - **Amaç:** İlk yük bundle'ı küçült
   - **Çıktı:** Dynamic import'lar, Suspense fallback
   - **Kabul Kriteri:** İlk yük JS < 180KB gzip, lazy chunk'lar < 50KB each
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** V1.0 Epik-5#2

5. **Add virtual scrolling for large file lists (VFS)**
   - **Amaç:** 1000+ dosya listesinde perf düşmesin
   - **Çıktı:** react-window entegrasyonu
   - **Kabul Kriteri:** 5000 item scroll 60fps, render yalnızca viewport'taki itemler
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** MVP Epik-4#3

6. **Optimize font loading (subset, swap strategy)**
   - **Amaç:** FOIT/FOUT minimize et
   - **Çıktı:** Font subset (Latin only), `font-display: swap`
   - **Kabul Kriteri:** CLS < 0.05, font yüklenmeden önce system font render edilir
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

7. **Implement request deduplication for GitHub API**
   - **Amaç:** Aynı endpoint'e paralel call'ları birleştir
   - **Çıktı:** SWR veya React Query kullanımı, cache strategy
   - **Kabul Kriteri:** 5 paralel repo fetch 1 request'e düşer, stale-while-revalidate
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** V1.0 Epik-6#2

---

#### Epik-12: Analytics & Monitoring

**Mikro Görevler:**

1. **Integrate privacy-friendly analytics (Plausible/Umami)**
   - **Amaç:** Kullanım metrikleri topla (pageview, app opens)
   - **Çıktı:** Analytics script, custom event tracking
   - **Kabul Kriteri:** GDPR-compliant, cookie-free, dashboard'da veri görünür
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

2. **Add custom performance marks and measures**
   - **Amaç:** Kritik işlemleri ölç (window open time, VFS CRUD latency)
   - **Çıktı:** PerformanceMark wrapper, aggregation logic
   - **Kabul Kriteri:** 10 custom metric, analytics'e p95 değerleri gönderilir
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** #1

3. **Implement error tracking (Sentry/Bugsnag)**
   - **Amaç:** Production hataları ve crash'leri yakala
   - **Çıktı:** Error boundary, Sentry SDK, sourcemap upload
   - **Kabul Kriteri:** Console error otomatik raporlanır, stack trace okunabilir
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

4. **Create user session replay (optional - privacy-aware)**
   - **Amaç:** Bug repro için session recording (rrweb)
   - **Çıktı:** rrweb entegrasyonu, opt-in banner
   - **Kabul Kriteri:** User consent alınmadan record edilmez, PII mask edilir
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** #3

5. **Add Web Vitals reporting to analytics**
   - **Amaç:** LCP, INP, CLS field data
   - **Çıktı:** web-vitals library, beacon API
   - **Kabul Kriteri:** Her session sonunda metrikleri POST edilir, dashboard'da p95 görünür
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** #1

---

#### Epik-13: Advanced Features & UX Polish

**Mikro Görevler:**

1. **Implement global keyboard shortcuts**
   - **Amaç:** Power user için hızlı aksiyonlar (Ctrl+N new folder, Ctrl+W close window)
   - **Çıktı:** Keyboard event listener, shortcut registry, help modal (Ctrl+?)
   - **Kabul Kriteri:** 10 shortcut tanımlanır, conflict detection, modal'da liste gösterilir
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** Yok

2. **Add file search (Ctrl+F in File Explorer)**
   - **Amaç:** VFS içinde hızlı arama
   - **Çıktı:** Search input, fuzzy match (fuse.js), highlight results
   - **Kabul Kriteri:** 1000 file < 200ms search, highlight match'ler
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** MVP Epik-4#3

3. **Implement clipboard operations (Ctrl+C, Ctrl+V)**
   - **Amaç:** Dosya/klasör copy-paste
   - **Çıktı:** Clipboard API, VFS node duplication logic
   - **Kabul Kriteri:** Copy→Paste node'u duplike eder, cross-folder paste çalışır
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** MVP Epik-4#3

4. **Add undo/redo for VFS operations**
   - **Amaç:** Yanlış silme/taşıma geri alınabilir
   - **Çıktı:** Command pattern, history stack (max 50 operations)
   - **Kabul Kriteri:** Ctrl+Z/Ctrl+Shift+Z çalışır, 50 operation history
   - **Tahmin:** 6 saat
   - **Bağımlılıklar:** MVP Epik-4#3

5. **Implement multi-select for icons/files (Ctrl+Click, Shift+Click)**
   - **Amaç:** Toplu işlemler (delete, move)
   - **Çıktı:** Selection state, bulk action toolbar
   - **Kabul Kriteri:** 100 icon seçilir, bulk delete < 500ms
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** MVP Epik-3#4

6. **Add file/folder properties modal (right-click → Properties)**
   - **Amaç:** Meta bilgi göster (created, modified, size)
   - **Çıktı:** Properties modal, VFS meta data display
   - **Kabul Kriteri:** Modal'da size/date gösterilir, editable fields (name, description)
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** MVP Epik-4#1

7. **Implement window snap zones (drag to screen edge)**
   - **Amaç:** Windows-style snap (left/right half, maximize)
   - **Çıktı:** Drag detection near edges, snap animation
   - **Kabul Kriteri:** Window kenardan 20px içinde ise snap zone highlight, release'de snap
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** MVP Epik-3#1

---

#### Epik-14: Accessibility (A11y) Enhancements

**Mikro Görevler:**

1. **Audit with axe-core and fix critical issues**
   - **Amaç:** WCAG 2.1 AA compliance
   - **Çıktı:** axe DevTools raporu, issue fix list
   - **Kabul Kriteri:** Axe scan 0 critical/serious issue
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

2. **Add keyboard navigation for all interactive elements**
   - **Amaç:** Mouse olmadan tüm site kullanılabilir
   - **Çıktı:** Tab order, focus visible, Enter/Space activation
   - **Kabul Kriteri:** Keyboard-only test başarılı (tüm actions yapılabilir)
   - **Tahmin:** 5 saat
   - **Bağımlılıklar:** Yok

3. **Implement ARIA labels and landmarks**
   - **Amaç:** Screen reader uyumluluğu
   - **Çıktı:** role="main", aria-label, aria-describedby
   - **Kabul Kriteri:** NVDA/JAWS ile test, tüm UI elemanları announce edilir
   - **Tahmin:** 4 saat
   - **Bağımlılıklar:** Yok

4. **Add skip links and focus management**
   - **Amaç:** Keyboard kullanıcı için hızlı navigasyon
   - **Çıktı:** "Skip to content" link, modal açılınca focus trap
   - **Kabul Kriteri:** Tab tuşu ile skip link erişilir, modal dışına focus çıkmaz
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

5. **Ensure color contrast ratios meet WCAG AA**
   - **Amaç:** Görme engelliler için okunabilirlik
   - **Çıktı:** Contrast checker (polypane), color adjustments
   - **Kabul Kriteri:** Tüm text/background combinations ≥ 4.5:1 ratio
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** V1.0 Epik-7#1

6. **Add reduced-motion mode support**
   - **Amaç:** Vestibular disorder'lı kullanıcılar için
   - **Çıktı:** prefers-reduced-motion media query, animasyon disable
   - **Kabul Kriteri:** prefers-reduced-motion: reduce ise tüm animasyonlar instant
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** V1.0 Epik-7#6

---

#### Epik-15: SEO & Meta Optimization

**Mikro Görevler:**

1. **Add meta tags for social sharing (OG, Twitter Card)**
   - **Amaç:** Link paylaşımlarında zengin preview
   - **Çıktı:** og:title, og:image, twitter:card meta tags
   - **Kabul Kriteri:** Twitter/LinkedIn link preview doğru görüntülenir
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

2. **Create robots.txt and sitemap.xml**
   - **Amaç:** SEO crawl optimize
   - **Çıktı:** robots.txt (allow all), sitemap.xml (main routes)
   - **Kabul Kriteri:** Google Search Console sitemap submit edilir, index confirmation
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

3. **Implement structured data (JSON-LD for Person/Portfolio)**
   - **Amaç:** Rich snippets Google'da
   - **Çıktı:** schema.org Person/CreativeWork JSON-LD script
   - **Kabul Kriteri:** Google Rich Results Test geçer
   - **Tahmin:** 3 saat
   - **Bağımlılıklar:** Yok

4. **Optimize page title and meta descriptions**
   - **Amaç:** Search result'ta tıklanabilirlik
   - **Çıktı:** Dynamic title (route-based), meta description < 160 char
   - **Kabul Kriteri:** Tüm route'larda unique title/description
   - **Tahmin:** 2 saat
   - **Bağımlılıklar:** Yok

5. **Add canonical URLs**
   - **Amaç:** Duplicate content önleme
   - **Çıktı:** `<link rel="canonical">` her sayfada
   - **Kabul Kriteri:** Canonical URL domain ile eşleşir, HTTPS
   - **Tahmin:** 1 saat
   - **Bağımlılıklar:** Yok

---

### Büyütme (Scale-up) & Optimizasyon

**Kapasite Planlama:**
- [ ] IndexedDB quota monitoring dashboard (alert at 80% full)
- [ ] Cloudflare bandwidth tracking (alert at 80GB/month)
- [ ] Build time optimization (target < 3 min)

**Cache/Queue Ayarları:**
- [ ] GitHub API ETag cache TTL: 1 hour
- [ ] Service Worker cache: static (1 year), dynamic (1 week)
- [ ] Offline sync queue max size: 100 operations

**Veri Saklama Politikaları:**
- [ ] VFS auto-cleanup: 90 gün erişilmeyen trash items silinir
- [ ] Analytics retention: 12 ay

**Raporlama:**
- [ ] Weekly analytics digest (top apps, devices, geo)
- [ ] Monthly performance report (Web Vitals p95 trend)
- [ ] Quarterly cost review (Cloudflare, third-party services)

---

### Kısa Gerekçeler (Rationale)

1. **Performans Önceliği:** V1.1'de optimizasyon critical çünkü V1.0'da tüm feature'lar eklendi, bundle size arttı. Image optimization ve code-splitting LCP'yi 2s altında tutar.

2. **Analytics Geç Eklenmesi:** MVP ve V1.0'da analytics yoktu çünkü prematüre optimizasyon. V1.1'de gerçek kullanıcı verisi toplamaya başlıyoruz.

3. **Accessibility Ayrı Epik:** A11y checklist uzun, her component için audit gerekir. Erken eklemezsek sonradan refactor maliyeti yüksek.

4. **Advanced Features Kullanıcı Talebi:** Keyboard shortcuts, undo/redo, multi-select power user'lar için. MVP'de yoktu ama production feedback sonrası ekleniyor.

5. **SEO Son Aşama:** Portfolyo zaten unique domain'de, SEO critical değil ama professional touch için meta tags, structured data ekliyoruz.

6. **Monitoring Production'da:** Error tracking ve session replay production'da değerli, development'ta overkill. V1.1'de eklenmesi timing açısından doğru.

---

## 4) Risk Matrisi & Kaçış Rampaları

### En Büyük 5 Risk

| Risk | Olasılık | Etki | Erken Uyarı Sinyalleri | Azaltma Eylemleri |
|------|----------|------|------------------------|-------------------|
| **1. IndexedDB quota exceeded (özellikle mobil Safari)** | Yüksek | Yüksek | Kullanıcı 50MB+ VFS data, Safari console quota error | VFS cleanup job (90 gün eski items), compression (pako), kullanıcıya export/delete uyarısı |
| **2. GitHub API rate limit (60 req/hour unauthenticated)** | Orta | Orta | 429 response, X-RateLimit-Remaining < 5 | ETag cache agresif (1 saat TTL), fallback to cached data + "refresh" button, OAuth token (optional) |
| **3. CSP violation production'da (iframe, inline script)** | Düşük | Yüksek | Sentry CSP report, console error | Pre-production CSP test suite, nonce-based inline scripts, strict CSP header audit |
| **4. Performans düşüşü (bundle size creep, LCP > 3s)** | Orta | Orta | Lighthouse CI fail, bundle size budget breach (>200KB) | Bundle analyzer weekly check, code-splitting aggressive, image optimization pipeline |
| **5. Mobil Safari gesture conflict (swipe back vs app swipe)** | Orta | Düşük | User feedback: "can't dismiss sheet", accidental navigation | touch-action CSS, custom gesture library (react-use-gesture), iOS-specific testing |

### "Kill/Pivot" Kriterleri

**Başarısızlık Tetikleyicileri (Kill Signal):**
- Cloudflare Pages build time consistently > 10 min → investigate CI bottleneck, consider alternate platform
- Client crash rate > 5% → rollback, hotfix critical bug
- IndexedDB corruption rate > 1% → pivot to localStorage + server sync fallback

**Pivot Kriterleri:**
- GitHub API rate limit sürekli problem → OAuth implementation veya backend proxy pivot
- Mobile UX adoption < 10% (analytics) → masaüstü-only focus, mobil desteğini suspend
- PWA install rate < 1% → PWA investment azalt, web-only optimize

**Success Metrics (Go/No-Go için):**
- MVP end: Desktop UX functional (5 window operations), VFS CRUD works → Go to V1.0
- V1.0 end: All apps deployed, Lighthouse score > 90, no critical bugs → Go to V1.1
- V1.1 end: Web Vitals p95 green (LCP<2s, INP<100ms, CLS<0.1), uptime 99.9% for 30 days → Production stable

---

## 5) Kabul ve Çıkış Kriterleri

### Faz-Bazlı "Definition of Done"

#### MVP (Faz 1) Done Kriterleri:
- [ ] Eski site `old/` altında, `/legacy/` iframe ile açılabilir
- [ ] Yeni site `npm run dev` ile çalışır, TypeScript hataları yok
- [ ] Desktop mode: 5 pencere açılıp kapatılabilir, sürüklenebilir, minimize/maximize edilebilir
- [ ] VFS: Folder/file CRUD operations functional, localStorage persist
- [ ] Build: `npm run build:all` → `dist/` üretir, `dist/legacy/` mevcut
- [ ] Performans: INP p95 < 100ms (local test)
- [ ] **Stakeholder Sign-off:** Tech lead code review ✅, design mockup approval ✅

#### V1.0 (Faz 2) Done Kriterleri:
- [ ] Tüm uygulamalar (PDF, GitHub, Browser, Games, Trash, Settings) çalışır
- [ ] Mobile UX: Launcher, Sheet, AppSwitcher functional
- [ ] PWA: Manifest, SW, offline mode çalışır, install prompt görünür
- [ ] Tema: 3 tema (light, dark, high-contrast) switch edilebilir
- [ ] Cloudflare Pages: Production deploy, custom domain, HTTPS
- [ ] Security review: CSP headers, DOMPurify sanitization audit passed
- [ ] Load test: 100 concurrent users, no crash, p95 response < 2s
- [ ] Lighthouse: Performance > 90, PWA > 90, Accessibility > 90
- [ ] **Stakeholder Sign-off:** Product owner acceptance ✅, security audit passed ✅

#### V1.1 (Faz 3) Done Kriterleri:
- [ ] Performance: LCP p95 < 2s, INP p95 < 100ms, CLS p95 < 0.1 (field data)
- [ ] Analytics: Dashboard live, custom events tracked
- [ ] Error tracking: < 1% error rate, Sentry alerts functional
- [ ] Advanced features: Keyboard shortcuts, file search, undo/redo work
- [ ] Accessibility: Axe audit 0 critical issues, NVDA/JAWS test passed
- [ ] SEO: robots.txt, sitemap.xml, structured data validated
- [ ] Uptime: 99.9% for 30 days, no P0 incidents
- [ ] **Stakeholder Sign-off:** Final product launch approval ✅, marketing ready ✅

---

### Paydaş Onay Kapıları

**Design Review (Pre-MVP):**
- Mockup approval: Desktop layout, window chrome, icon grid
- Mobile mockup approval: Launcher, Sheet, AppSwitcher
- **Exit Criteria:** Design sign-off, no major revision requests

**Security Review (Pre-V1.0 Launch):**
- CSP header validation
- DOMPurify sanitization audit
- Dependency vulnerability scan (npm audit)
- **Exit Criteria:** No high/critical vulns, security team approval

**Performance Review (Pre-V1.1 Launch):**
- Lighthouse CI passing (>90 all categories)
- Bundle size < 180KB gzip
- Web Vitals p95 green
- **Exit Criteria:** Performance team approval, no regression

**Load Test (Pre-Production):**
- 100 concurrent users, 10 min sustained load
- No crashes, memory leaks
- p95 response < 2s
- **Exit Criteria:** Infra team approval, capacity confirmed

**Cost Guardrails:**
- Cloudflare Pages: Free tier limits monitored (<500 builds/month)
- IndexedDB: User quota warnings implemented
- Third-party services: Free tier confirmed (Analytics, Error tracking)
- **Exit Criteria:** Finance sign-off, no surprise costs

---

## Özet

Bu roadmap, **Ubuntu×XP Desktop Portfolio** projesini 3 fazda (MVP → V1.0 → V1.1) tamamlamak için **80+ atomik mikro görev** içermektedir. Her görev:
- ✅ Tek eylemli (one commit/PR)
- ✅ Test edilebilir kabul kriterleri
- ✅ Tahmin ve bağımlılıklar açık
- ✅ Güvenlik/performans hedefleri entegre

**Kritik Yol:** Archive Legacy → Build System → OS Store → Window Manager → VFS → Apps → Mobile UX → PWA → Optimization

**Timeline:** MVP 2-3 hafta | V1.0 3-4 hafta | V1.1 2-3 hafta = **Toplam 7-10 hafta**

**Başarı Kriteri:** Production'da LCP<2s, INP<100ms, CLS<0.1, %99.9 uptime, 0 critical bugs, kullanıcı feedback pozitif.

---

**Sonraki Adım:** MVP Epik-1 görev #1'den başla → `git checkout -b chore/archive-legacy-site` → Taşıma işlemi başlat! 🚀