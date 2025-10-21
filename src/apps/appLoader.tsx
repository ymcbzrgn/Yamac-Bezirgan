/**
 * App Loader - Lazy loading system for apps
 * Ubuntu×XP Desktop Portfolio
 */

import { lazy, Suspense, ComponentType } from 'react';
import type { AppRegistry } from './types';

/**
 * App registry - Maps app IDs to lazy component loaders
 * Apps are code-split automatically by Vite
 */
const appRegistry: AppRegistry = {
  'pdf-viewer': () => import('./pdf-viewer/PdfViewer'),
  'browser': () => import('./browser/Browser'),
  // Future apps:
  // 'github-viewer': () => import('./github-viewer/GithubViewer'),
  // 'snake': () => import('./games/Snake'),
};

/**
 * Loading skeleton with animated bones
 */
function AppSkeleton() {
  return (
    <div className="app-skeleton">
      <div className="app-skeleton__header" />
      <div className="app-skeleton__content">
        <div className="app-skeleton__line app-skeleton__line--long" />
        <div className="app-skeleton__line app-skeleton__line--medium" />
        <div className="app-skeleton__line app-skeleton__line--short" />
        <div className="app-skeleton__line app-skeleton__line--medium" />
      </div>
      <style>{`
        .app-skeleton {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .app-skeleton__header {
          height: 40px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .app-skeleton__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-skeleton__line {
          height: 16px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .app-skeleton__line--long {
          width: 90%;
        }

        .app-skeleton__line--medium {
          width: 70%;
        }

        .app-skeleton__line--short {
          width: 50%;
        }

        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Error display for unknown or failed apps
 */
function AppError({ appId, error }: { appId: string; error?: string }) {
  return (
    <div className="app-error">
      <div className="app-error__icon">⚠️</div>
      <h3 className="app-error__title">App Error</h3>
      <p className="app-error__message">
        {error || `App not found: ${appId}`}
      </p>
      <p className="app-error__hint">
        Please try refreshing the page or contact support.
      </p>
      <style>{`
        .app-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 24px;
          text-align: center;
          color: var(--color-text-secondary, #666);
        }

        .app-error__icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .app-error__title {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text, #333);
          margin: 0 0 8px 0;
        }

        .app-error__message {
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .app-error__hint {
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

/**
 * App Loader Props
 */
interface AppLoaderProps {
  appId: string;
  [key: string]: any; // Forward all props to the app
}

/**
 * App Loader Component
 * Lazy loads apps and shows skeleton while loading
 */
export default function AppLoader({ appId, ...props }: AppLoaderProps) {
  const appImport = appRegistry[appId];

  // App not found in registry
  if (!appImport) {
    return <AppError appId={appId} />;
  }

  // Lazy load the app component
  const AppComponent = lazy(appImport);

  return (
    <Suspense fallback={<AppSkeleton />}>
      <AppComponent {...props} />
    </Suspense>
  );
}
