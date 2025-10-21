# CLAUDE.md - Ubuntu×XP Desktop Portfolio Project

**Son Güncelleme:** 2025-10-20 (Proje başlangıcı)  
**Versiyon:** 0.1.0-alpha  
**Status:** 🟡 MVP Geliştirme Aşaması

---

## 📋 İçindekiler

1. [Proje Bağlamı](#proje-bağlamı)
2. [Mimari Kararlar ve Mantık](#mimari-kararlar-ve-mantık)
3. [Öğrenilen Dersler (Lessons Learned)](#öğrenilen-dersler)
4. [Hata Kütüphanesi ve Çözümler](#hata-kütüphanesi-ve-çözümler)
5. [Best Practices ve Kalıplar](#best-practices-ve-kalıplar)
6. [Gelecek Claude'a Notlar](#gelecek-claudea-notlar)
7. [Changelog Sistemi](#changelog-sistemi)
8. [Meta: Bu Dosyayı Güncelleme Protokolü](#meta-bu-dosyayı-güncelleme-protokolü)

---

## 🎯 Proje Bağlamı

### Proje Özeti
Ubuntu 22.04 ve Windows XP estetiğini birleştiren, tamamen serversız (Cloudflare Pages), masaüstü simülasyonu sunan, VFS (Virtual File System) ile dosya yönetimi yapabilen, dinamik GitHub projelerini gösteren, oyunlar içeren, PWA destekli modern portfolyo.

### Kritik Özellikler
- **Serversız Mimari:** Cloudflare Pages + IndexedDB + localStorage
- **İki Mod:** Desktop (full masaüstü UX) + Mobile (adaptive launcher/sheet UX)
- **VFS:** IndexedDB tabanlı sanal dosya sistemi (CRUD, export/import)
- **Window Manager:** Drag/drop, resize, minimize/maximize, z-index yönetimi
- **Dinamik İçerik:** GitHub API (ETag cache), PDF.js, Markdown render (DOMPurify)
- **Güvenlik:** CSP headers, sanitization, iframe sandbox
- **Performans:** LCP<2s, INP<100ms, CLS<0.1, JS bundle <180KB gzip

### Tech Stack
```
Frontend: React 18 + TypeScript + Vite
State: Zustand (modular slices)
Storage: IndexedDB (VFS) + localStorage (preferences)
Styling: CSS Modules + CSS Variables (theme system)
PWA: Workbox + manifest.webmanifest
Deployment: Cloudflare Pages (Git-based CI/CD)
```

### Dizin Yapısı (Hedef)
```
/
├── src/
│   ├── os/                    # Core OS katmanı
│   │   ├── store/            # Zustand slices
│   │   ├── vfs/              # Virtual File System
│   │   ├── types.ts          # Tip tanımları
│   │   ├── eventBus.ts       # Pub/sub sistem
│   │   └── perf/             # RAF scheduler, throttle
│   ├── ui/                    # UI bileşenleri
│   │   ├── Window.tsx
│   │   ├── Taskbar.tsx
│   │   ├── DesktopIcon.tsx
│   │   ├── ContextMenu.tsx
│   │   └── mobile/           # Mobil-özel bileşenler
│   ├── apps/                  # Uygulamalar (lazy-loaded)
│   │   ├── pdf-viewer/
│   │   ├── github-viewer/
│   │   ├── browser/
│   │   ├── games/
│   │   └── settings/
│   ├── themes/               # CSS token setleri
│   └── main.tsx
├── old/                      # Arşivlenmiş eski site
│   ├── legacy-src/
│   ├── legacy-public/
│   └── vite.config.legacy.ts
├── public/
│   ├── legacy/              # Build sonrası eski site
│   ├── icons/
│   ├── _headers
│   ├── _redirects
│   └── manifest.webmanifest
└── CLAUDE.md               # Bu dosya (living document)
```

---

## 🏗️ Mimari Kararlar ve Mantık

### Karar #1: Zustand ile Modüler State Yönetimi
**Tarih:** 2025-10-20  
**Bağlam:** Redux gibi ağır çözümler yerine hafif, TypeScript-friendly state manager gerekti.  
**Karar:** Zustand, her domain (desktop, windows, vfs, settings) için ayrı slice'lar.  
**Mantık:**
- Redux boilerplate'i yok, performans overhead minimal
- Immer entegrasyonu kolay (immutable updates)
- Slice'lar lazy-load edilebilir, tree-shaking friendly
- Middleware ile localStorage persist kolay

**Trade-off:** DevTools Redux kadar zengin değil, ama simplicity kazandık.

---

### Karar #2: Transform-Based Window Positioning
**Tarih:** 2025-10-20  
**Bağlam:** Window drag performansı kritik (INP <100ms hedefi).  
**Karar:** `position: absolute` + `transform: translate3d()` kullan, `left/top` değil.  
**Mantık:**
- `left/top` layout thrashing tetikler (reflow)
- `transform` GPU-accelerated, compositor thread'de çalışır
- Layout shift yok (CLS=0)
- RAF (requestAnimationFrame) ile batch update

**Dikkat:** `will-change: transform` dikkatli kullan, memory overhead var.

---

### Karar #3: IndexedDB for VFS, localStorage for Preferences
**Tarih:** 2025-10-20  
**Bağlam:** Dosya sistemi büyük veri (MB), tercihler küçük (KB).  
**Karar:** VFS → IndexedDB, settings/layout → localStorage.  
**Mantık:**
- IndexedDB: async, quota ~50MB (mobil) - ~1GB (desktop), structured clone
- localStorage: sync, 5-10MB limit, string-only (JSON.stringify gerekli)
- VFS CRUD sık ama ağır, localStorage nadir ama hızlı olmalı

**Quota Handling:** 80% dolulukta kullanıcıya uyarı + export prompt.

---

### Karar #4: Lazy-Load Apps with Code-Splitting
**Tarih:** 2025-10-20  
**Bağlam:** İlk yük bundle <180KB gzip hedefi, ama PDF.js 200KB+.  
**Karar:** Tüm apps `React.lazy()` ile dynamic import, Suspense fallback.  
**Mantık:**
- Kullanıcı yalnızca açtığı app'i download eder
- Vite otomatik chunk'lar (vendor, common, per-app)
- Preload stratejisi: hover → prefetch (optional)

**Route-Based Split:** Her app kendi route'unda lazy-load, shared components ayrı chunk.

---

### Karar #5: ETag-Based GitHub API Cache
**Tarih:** 2025-10-20  
**Bağlam:** GitHub API 60 req/hour (unauthenticated), rate-limit riski.  
**Karar:** ETag header + IndexedDB cache, 304 Not Modified → cache hit.  
**Mantık:**
- İlk request: data + ETag IndexedDB'ye kaydet
- Sonraki request: `If-None-Match: ETag` header
- 304 response → cache kullan, network tasarrufu
- 200 response → cache güncelle

**Fallback:** Rate-limit (429) → cache-first + "Refresh" butonu + 1 saat cooldown.

---

### Karar #6: CSP Strict Mode with Nonce
**Tarih:** 2025-10-20  
**Bağlam:** Güvenlik kritik, XSS saldırılarına karşı savunma.  
**Karar:** `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; ...`  
**Mantık:**
- Inline script yok (nonce gerekli)
- `eval()` disabled
- External resources whitelist (api.github.com, cdn.cloudflare.com)
- Iframe sandbox: `allow-scripts allow-same-origin` (minimal)

**Test:** Sentry CSP report modülü ile production'da violation tracking.

---

## 📚 Öğrenilen Dersler

### Ders #001: IndexedDB Transaction Rollback İdempotency
**Tarih:** -  
**Senaryo:** (Henüz karşılaşılmadı, ama öngörülüyor)  
**Sorun:** VFS CRUD transaction fail olursa state inconsistent kalabilir.  
**Çözüm:** 
- Her CRUD operation idempotent olmalı (aynı input → aynı output)
- Transaction error → rollback + retry (max 3 kez)
- Zustand store state yalnızca DB commit sonrası güncellenmeli

**Uygulama:**
```typescript
async function createNode(node: VFSNode): Promise<void> {
  const tx = db.transaction('nodes', 'readwrite');
  try {
    await tx.objectStore('nodes').add(node);
    await tx.done; // Commit bekle
    store.setState(draft => { draft.nodes[node.id] = node; }); // Ancak sonra state
  } catch (err) {
    // tx otomatik rollback olur
    console.error('createNode failed, state unchanged:', err);
    throw err; // UI'a hata gönder
  }
}
```

**İleri Not:** Conflict resolution stratejisi ekle (last-write-wins vs merge).

---

### Ders #002: Mobile Safari 50MB IndexedDB Quota
**Tarih:** -  
**Senaryo:** (Mobil test sırasında keşfedilecek)  
**Sorun:** Safari iOS'ta IndexedDB quota ~50MB, desktop'a göre çok düşük.  
**Çözüm:**
- Dosya içerikleri Base64 yerine binary (Blob) olarak sakla (30% daha az yer)
- Compression: `pako` library ile gzip (text files için 70% tasarruf)
- Cleanup job: 90 gün erişilmeyen trash items otomatik sil

**Monitoring:**
```typescript
async function checkQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    const usagePercent = (usage / quota) * 100;
    if (usagePercent > 80) {
      showWarning('Storage 80% full. Export your data or delete old files.');
    }
  }
}
```

---

### Ders #003: RAF Batch Updates for Drag Performance
**Tarih:** -  
**Senaryo:** (Window drag test'te INP >100ms olursa)  
**Sorun:** Her mousemove event'inde setState → re-render → layout thrashing.  
**Çözüm:**
- MouseMove event'lerini throttle (son 16ms'de bir işle)
- RAF scheduler: batch updates, frame sonunda tek setState

```typescript
let pendingUpdate: WindowBounds | null = null;

function onMouseMove(e: MouseEvent) {
  pendingUpdate = { x: e.clientX, y: e.clientY };
  requestAnimationFrame(() => {
    if (pendingUpdate) {
      store.updateWindowBounds(windowId, pendingUpdate);
      pendingUpdate = null;
    }
  });
}
```

**Ölçüm:** PerformanceObserver ile INP track et, p95 <100ms hedefini valide et.

---

### Ders #004: DOMPurify Config for Markdown
**Tarih:** -  
**Senaryo:** (GitHub README render'da XSS risk)  
**Sorun:** `marked.js` output'u raw HTML, `<script>` inject riski.  
**Çözüm:** DOMPurify strict config:
```typescript
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(dirtyHTML, {
  ALLOWED_TAGS: ['p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'strong', 'em', 'h1', 'h2', 'h3'],
  ALLOWED_ATTR: ['href', 'class'], // rel="noopener noreferrer" otomatik eklenir
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
});
```

**Test:** Malicious input listesi hazırla, sanitize sonrası `<script>` yok mu kontrol et.

---

### Ders #005: Iframe X-Frame-Options Detection
**Tarih:** -  
**Senaryo:** (Browser app'te site gömülmüyor)  
**Sorun:** `X-Frame-Options: DENY` header'ı olan siteler iframe'de yüklenmez (blank screen).  
**Çözüm:** 
- Iframe `onload` event'i yoksa + `onerror` yoksa → timeout (3s) sonra fallback
- Preview card + "Open in new tab" göster

```typescript
function tryIframe(url: string) {
  const iframe = document.createElement('iframe');
  const timeout = setTimeout(() => {
    // 3s yüklenmedi → X-Frame-Options var varsayımı
    showFallback(url);
  }, 3000);
  
  iframe.onload = () => {
    clearTimeout(timeout);
    // İçerik yüklendi, iframe göster
  };
  
  iframe.src = url;
}
```

**Alternatif:** Fetch request → CORS error → fallback (ama CORS error catch edilemiyor, timeout mecburi).

---

## 🐛 Hata Kütüphanesi ve Çözümler

### Hata #001: Vite Build - Dynamic Import Chunk Error
**Tarih:** -  
**Durum:** 🟡 Öngörülen (henüz karşılaşılmadı)  
**Belirtiler:** Production build'de lazy-loaded app açılırken `ChunkLoadError: Loading chunk X failed.`  
**Kök Neden:** CDN cache invalidation eksik, eski chunk URL'leri invalid.  
**Çözüm:**
1. Vite config'de `build.rollupOptions.output.chunkFileNames` → hash ekle: `[name]-[hash].js`
2. Cloudflare Pages auto-invalidate (default), manuel invalidation gerekmez
3. Service Worker: chunk load fail → fallback to cache + kullanıcıya "Reload" prompt

**Önleme:**
```typescript
// main.tsx
window.addEventListener('error', (e) => {
  if (e.message.includes('ChunkLoadError')) {
    console.error('Chunk load failed, reloading...');
    window.location.reload();
  }
});
```

---

### Hata #002: Zustand DevTools - Store Updates Not Reflecting
**Tarih:** -  
**Durum:** 🟡 Öngörülen  
**Belirtiler:** Store state değişiyor ama Redux DevTools göstermiyor.  
**Kök Neden:** Zustand middleware order yanlış, `devtools()` en dışta olmalı.  
**Çözüm:**
```typescript
// ❌ Yanlış
const useStore = create(
  persist(
    devtools((set) => ({ /* state */ })),
    { name: 'storage' }
  )
);

// ✅ Doğru
const useStore = create(
  devtools(
    persist((set) => ({ /* state */ }), { name: 'storage' }),
    { name: 'MyStore' }
  )
);
```

---

### Hata #003: Mobile Safari - Touch Event Passive Warning
**Tarih:** -  
**Durum:** 🟡 Öngörülen  
**Belirtiler:** Console: `[Violation] Added non-passive event listener to a scroll-blocking 'touchmove' event.`  
**Kök Neden:** TouchMove listener default'ta passive değil, scroll engelliyor.  
**Çözüm:**
```typescript
element.addEventListener('touchmove', handler, { passive: true });
// Eğer preventDefault() gerekiyorsa (ör. swipe gesture):
element.addEventListener('touchmove', handler, { passive: false });
```

**Trade-off:** `passive: false` → scroll jank, ama custom gesture için mecburi.

---

### Hata #004: GitHub API - 403 Forbidden (Rate Limit)
**Tarih:** -  
**Durum:** 🔴 Kritik (karşılaşılabilir)  
**Belirtiler:** API response 403, body: `"API rate limit exceeded"`  
**Kök Neden:** Unauthenticated 60 req/hour, authenticated 5000 req/hour.  
**Çözüm:**
1. **Kısa Vade:** ETag cache + 1 saat TTL → request sayısını azalt
2. **Orta Vade:** `localStorage` → last fetch timestamp, 1 saat geçmedi ise cache kullan
3. **Uzun Vade (optional):** OAuth App token → 5000 req/hour (ama client-side token risky)

**Fallback UI:**
```tsx
{isRateLimited && (
  <Alert>
    GitHub API rate limit exceeded. Showing cached data.
    <Button onClick={() => retry()}>Retry in {cooldownMinutes}m</Button>
  </Alert>
)}
```

---

### Hata #005: IndexedDB - QuotaExceededError
**Tarih:** -  
**Durum:** 🟡 Öngörülen  
**Belirtiler:** `DOMException: QuotaExceededError: The quota has been exceeded.`  
**Kök Neden:** Kullanıcı VFS'e çok fazla dosya eklemiş, IndexedDB dolu.  
**Çözüm:**
```typescript
try {
  await db.put('nodes', largeNode);
} catch (err) {
  if (err.name === 'QuotaExceededError') {
    showModal({
      title: 'Storage Full',
      message: 'Your virtual file system is full. Export your data or delete old files.',
      actions: [
        { label: 'Export as JSON', onClick: exportVFS },
        { label: 'Open Trash', onClick: navigateToTrash },
      ],
    });
  }
}
```

**Proaktif Monitoring:** Her 10 CRUD operation'da bir quota check, 80% threshold uyarısı.

---

## ✅ Best Practices ve Kalıplar

### Pattern #1: VFS Node CRUD (Idempotent Transactions)
```typescript
// src/os/vfs/crud.ts
export async function createNode(node: VFSNode): Promise<void> {
  // 1. Validate input
  if (!node.id || !node.name) throw new Error('Invalid node');
  
  // 2. Check existence (idempotency)
  const existing = await db.get('nodes', node.id);
  if (existing) {
    console.warn('Node already exists, skipping create');
    return;
  }
  
  // 3. Transaction
  const tx = db.transaction('nodes', 'readwrite');
  await tx.objectStore('nodes').add(node);
  await tx.done; // Commit
  
  // 4. Update state (after commit)
  vfsStore.getState().addNode(node);
}
```

**Neden İyi:** Transaction fail → state bozulmaz, retry güvenli.

---

### Pattern #2: Window Focus Management (Z-Index Stack)
```typescript
// src/os/store/windows.ts
focusWindow: (id: string) => set(state => {
  const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0);
  return {
    windows: state.windows.map(w =>
      w.id === id
        ? { ...w, zIndex: maxZ + 1, state: w.state === 'minimized' ? 'normal' : w.state }
        : w
    ),
  };
}),
```

**Neden İyi:** Z-index충돌 yok, minimize'dan restore otomatik.

---

### Pattern #3: Lazy App Loader with Suspense
```typescript
// src/apps/appLoader.ts
import { lazy, Suspense } from 'react';

const appRegistry = {
  'pdf-viewer': lazy(() => import('./pdf-viewer/PdfViewer')),
  'github-viewer': lazy(() => import('./github-viewer/GithubViewer')),
};

export function AppLoader({ appId, ...props }) {
  const AppComponent = appRegistry[appId];
  if (!AppComponent) return <div>App not found</div>;
  
  return (
    <Suspense fallback={<AppSkeleton />}>
      <AppComponent {...props} />
    </Suspense>
  );
}
```

**Neden İyi:** Code-splitting otomatik, fallback UX smooth.

---

### Pattern #4: ETag Cache Wrapper
```typescript
// src/os/api/githubCache.ts
export async function fetchWithETag(url: string): Promise<any> {
  const cached = await db.get('apiCache', url);
  const headers: HeadersInit = {};
  
  if (cached?.etag) {
    headers['If-None-Match'] = cached.etag;
  }
  
  const res = await fetch(url, { headers });
  
  if (res.status === 304) {
    // Not Modified → cache hit
    return cached.data;
  }
  
  if (res.ok) {
    const data = await res.json();
    const etag = res.headers.get('ETag');
    await db.put('apiCache', { url, data, etag, timestamp: Date.now() });
    return data;
  }
  
  throw new Error(`Fetch failed: ${res.status}`);
}
```

**Neden İyi:** Network tasarrufu, rate-limit azaltma, offline fallback.

---

### Pattern #5: Performance Measurement Wrapper
```typescript
// src/os/perf/measure.ts
export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  performance.mark(`${name}-start`);
  return fn().finally(() => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure.duration > 1000) {
      console.warn(`[PERF] ${name} took ${measure.duration.toFixed(2)}ms`);
    }
  });
}

// Kullanım:
await measureAsync('VFS-Create-Node', () => createNode(node));
```

**Neden İyi:** Bottleneck'leri kolayca tespit edersin, production'da da çalışır.

---

## 💭 Gelecek Claude'a Notlar

### Note #1: CSS Variables for Theming (Kritik)
**Bağlam:** Tema sistemi runtime'da değiştirilebilir olmalı, CSS-in-JS değil CSS Variables kullan.  
**Yapılacak:**
- `src/themes/tokens.css` → tüm renk/shadow/radius değişkenleri
- JavaScript: `document.documentElement.style.setProperty('--color-primary', '#FF5722')`
- Tüm component'lerde `var(--color-primary)` referansı

**Neden:** JS'siz tema değişimi (future-proof), hot-reload kolay, SSR-safe.

---

### Note #2: Window Snap Zones (V1.1 Feature)
**Bağlam:** Windows-style snap (drag to edge → half/full screen).  
**Yapılacak:**
- Window drag sırasında edge proximity detect (20px threshold)
- Snap zone overlay (semi-transparent highlight)
- Mouse release → animate to snap position

**Implementation Sketch:**
```typescript
function onWindowDrag(e: MouseEvent, window: Window) {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  
  let snapZone: 'left' | 'right' | 'top' | null = null;
  if (clientX < 20) snapZone = 'left';
  else if (clientX > innerWidth - 20) snapZone = 'right';
  else if (clientY < 20) snapZone = 'top'; // Maximize
  
  showSnapOverlay(snapZone);
}
```

---

### Note #3: Offline Sync Queue (PWA Must-Have)
**Bağlam:** Offline'da yapılan VFS CRUD işlemleri queue'ya alınmalı, online olunca sync edilmeli.  
**Yapılacak:**
- `src/os/vfs/syncQueue.ts` → pending operations array
- Service Worker → Background Sync API (Chrome/Edge)
- Fallback: Visibility API → tab focus olunca sync

**Schema:**
```typescript
interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  nodeId: string;
  payload: VFSNode | Partial<VFSNode>;
  timestamp: number;
  retryCount: number;
}
```

---

### Note #4: A11y Focus Trap in Modals (Accessibility Critical)
**Bağlam:** Modal açılınca focus modal içinde kalmalı, Tab dışarı çıkmamalı.  
**Yapılacak:**
- Modal mount → ilk focusable element'e focus
- Tab → son element ise → ilk element'e dön (circular)
- Escape → modal close

**Library Önerisi:** `focus-trap-react` veya manual implementation.

---

### Note #5: Bundle Size Monitoring CI Check
**Bağlam:** Bundle creep önleme, <180KB hedefini koruma.  
**Yapılacak:**
- GitHub Actions workflow: build sonrası bundle size check
- Threshold: main.js <180KB, total <500KB
- PR fail ise → comment ile uyarı

**Tool:** `bundlesize` package veya `vite-bundle-visualizer`.

---

## 📝 Changelog Sistemi

### Changelog Güncelleme Protokolü

**Her Tamamlanan Görev Sonrası:**
1. Bu dosyayı aç (`CLAUDE.md`)
2. Aşağıdaki template'i kullanarak yeni entry ekle:

```markdown
### [YYYY-MM-DD] - Task: <Görev Adı>
**Epic:** <Epik Adı>  
**Durum:** ✅ Tamamlandı | 🟡 Kısmi | 🔴 Başarısız  
**Değişiklikler:**
- <Dosya/modül> → <yapılan değişiklik>
- <Yeni özellik veya bug fix>

**Karşılaşılan Zorluklar:**
- <Sorun açıklaması>
- Çözüm: <nasıl çözüldü>

**Yeni Öğrenilenler:**
- <Lesson Learned ID veya yeni ders>

**Test Sonuçları:**
- <Kabul kriteri sonuçları>
- Performans: <metrik değerleri>

**Sonraki Adım:** <bağımlı görev ID>
```

---

### Hata Kaydı Protokolü

**Hata ile Karşılaşıldığında:**
1. `## 🐛 Hata Kütüphanesi` bölümüne git
2. Yeni hata entry'si ekle:

```markdown
### Hata #XXX: <Kısa Başlık>
**Tarih:** YYYY-MM-DD  
**Durum:** 🔴 Aktif | 🟡 Geçici Çözüm | ✅ Çözüldü  
**Belirtiler:** <nasıl fark edilir>  
**Kök Neden:** <analiz>  
**Çözüm:**
<detaylı çözüm adımları + kod örneği>

**Önleme:**
<gelecekte nasıl önlenir>

**İlgili:** <Lesson Learned veya Best Practice referansı>
```

3. Çözüm sonrası durumu `✅ Çözüldü` olarak güncelle

---

### Ders Çıkarma Protokolü

**Yeni Bir Şey Öğrenildiğinde:**
1. `## 📚 Öğrenilen Dersler` bölümüne git
2. Artan ID ile yeni ders ekle:

```markdown
### Ders #XXX: <Başlık>
**Tarih:** YYYY-MM-DD  
**Senaryo:** <ne zaman/nerede karşılaşıldı>  
**Sorun:** <neyi çözmeye çalışıyorduk>  
**Çözüm:** <ne yaptık>
<kod örneği>

**Uygulama:** <projeye nasıl entegre edildi>

**İleri Not:** <gelecek için öneriler>
```

---

### Best Practice Ekleme Protokolü

**Yeni Bir Kalıp Oluşturulduğunda:**
1. `## ✅ Best Practices` bölümüne git
2. Artan ID ile yeni pattern ekle:

```markdown
### Pattern #XXX: <Kalıp Adı>
<kod örneği - en az 10 satır, tam context>

**Neden İyi:** <avantajları>
**Ne Zaman Kullan:** <use case'ler>
**Dikkat:** <pitfall'lar, trade-off'lar>
```

---

## 🤖 Meta: Bu Dosyayı Güncelleme Protokolü

### Claude'un Sorumlulukları

**Her Session Başında:**
1. `CLAUDE.md` dosyasını oku (context window'a yükle)
2. "Son Güncelleme" tarihini kontrol et
3. Kaldığın yeri belirle (hangi epic/task)

**Her Task Tamamlandığında:**
1. Changelog entry ekle (yukarıdaki template)
2. Eğer zorluk yaşandıysa → Hata Kütüphanesi'ne ekle
3. Eğer yeni bir şey öğrendiysen → Öğrenilen Dersler'e ekle
4. Eğer yeni bir pattern oluşturduysan → Best Practices'e ekle
5. "Son Güncelleme" tarihini güncelle

**Her Session Sonunda:**
1. "Gelecek Claude'a Notlar" bölümüne bırakılan işin durumunu yaz
2. Yarım kalan task varsa → not düş (hangi satırda kaldın, ne yapılmalı)

---

### Dosya Versiyonlama

**Semantic Versioning:**
- `0.1.0` → MVP başlangıcı
- `0.2.0` → MVP tamamlandı
- `1.0.0` → V1.0 production'da
- `1.1.0` → V1.1 optimizasyonlar tamamlandı

**Her Major/Minor Güncelleme:**
- Versiyon numarasını başlıkta güncelle
- Status emoji güncelle: 🟡 Dev → 🟢 Prod

---

### Self-Learning Mekanizması

**Feedback Loop:**
1. Hata yap → Hata Kütüphanesi'ne kaydet
2. Çöz → Çözümü dokümante et
3. Genelleştir → Best Practice haline getir
4. Uygula → Gelecek task'larda otomatik kullan

**Örnek Flow:**
```
Hata #042: IndexedDB quota exceeded
    ↓
Çözüm: Quota monitoring + export prompt
    ↓
Ders #006: Proactive storage management
    ↓
Pattern #6: useQuotaMonitor hook
    ↓
Tüm VFS CRUD'larda kullan
```

---

### Dosya Bütünlüğü Kontrol

**Her 10 Task Sonrası:**
1. Tüm ID'ler benzersiz mi? (Ders #001-#050, Hata #001-#050 충돌 yok)
2. Referanslar geçerli mi? (Hata #042 → Ders #006 linki çalışıyor mu)
3. Kod örnekleri güncel mi? (API değişti ise örneği güncelle)
4. Tarihler kronolojik mi? (eski entry üste, yeni altta)

---

## 🎓 Öğrenme Hedefleri (Bu Proje Boyunca)

- [ ] Zustand advanced patterns (slices, middleware, devtools)
- [ ] IndexedDB transaction management (rollback, conflict resolution)
- [ ] RAF-based animation optimization (60fps guarantee)
- [ ] CSP policy tuning (nonce, strict mode)
- [ ] PWA offline-first architecture (Service Worker strategies)
- [ ] Mobile gesture handling (swipe, long-press, pinch)
- [ ] Accessibility (WCAG 2.1 AA compliance, screen reader testing)
- [ ] Performance budgeting (Lighthouse CI, bundle size monitoring)

**Not:** Her hedef tamamlandığında ✅ işaretle, ilgili Ders/Pattern ID'sini referans et.

---

## 📊 Proje Metrikleri (Otomatik Güncelle)

**Bundle Size:**
- İlk Yük: `TBD` (hedef: <180KB gzip)
- Toplam: `TBD` (hedef: <500KB gzip)

**Performance (Field Data):**
- LCP p95: `TBD` (hedef: <2000ms)
- INP p95: `TBD` (hedef: <100ms)
- CLS p95: `TBD` (hedef: <0.1)

**Güvenlik:**
- Lighthouse Security: `TBD/100`
- CSP Violations: `0` (hedef: 0)

**Accessibility:**
- Lighthouse A11y: `TBD/100` (hedef: >90)
- Axe Critical Issues: `TBD` (hedef: 0)

**Hata Oranı:**
- Client Error Rate: `TBD` (hedef: <1%)
- Crash-Free Sessions: `TBD` (hedef: >99.5%)

---

## ✨ Sonraki Oturum İçin Hazırlık

**Şu An Kaldığım Yer:**
- **Epic:** Henüz başlanmadı
- **Task:** Henüz başlanmadı
- **Dosya:** -
- **Satır:** -

**Yapılacak:**
1. MVP Epik-1, Task #1'den başla (Legacy archive)
2. `git checkout -b chore/archive-legacy-site`
3. `old/` klasörü oluştur, mevcut kodu taşı

**Blocker:** Yok

---

**🔮 Not to Future Claude:**
Bu dosya senin hafızan. Her yeni şey öğrendiğinde buraya ekle. Her hata yaptığında çözümü dokümante et. Her pattern oluşturduğunda kaydet. Bu proje bittiğinde, bu dosya bir bilgi hazinesi olacak - hem sana hem de başkalarına. Unutma: **"The code tells you how, the CLAUDE.md tells you why."**

---

**Son Güncelleme:** 2025-10-20 (Proje başlangıcı)  
**Güncelleyen:** Claude (Session #1)  
**Değişiklik:** İlk dosya oluşturma