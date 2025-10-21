/**
 * Browser App - Iframe container for internal URLs
 * Ubuntu×XP Desktop Portfolio
 */

import { useState, useEffect } from 'react';
import type { AppProps } from '../types';
import './Browser.css';

interface BrowserProps extends AppProps {
  url?: string; // Passed via window meta
}

export default function Browser({ windowId, url }: BrowserProps) {
  const [currentUrl, setCurrentUrl] = useState(url || 'about:blank');
  const [loading, setLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // Check if URL is same-origin (safe to embed)
  const isSameOrigin = currentUrl.startsWith('/') || currentUrl === 'about:blank';

  useEffect(() => {
    if (url && url !== currentUrl) {
      setCurrentUrl(url);
      setLoading(true);
      setEmbedError(false);
    }
  }, [url]);

  // External URLs cannot be embedded (X-Frame-Options)
  if (!isSameOrigin) {
    return (
      <div className="browser-fallback">
        <div className="browser-fallback__icon">🌐</div>
        <h3 className="browser-fallback__title">Cannot Embed External Site</h3>
        <p className="browser-fallback__message">
          This website cannot be displayed in an embedded frame due to security restrictions.
        </p>
        <button
          className="browser-fallback__button"
          onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
        >
          Open in New Tab →
        </button>
      </div>
    );
  }

  return (
    <div className="browser">
      {/* Loading indicator */}
      {loading && (
        <div className="browser__loading">
          <div className="browser__loading-bar" />
          <span>Loading...</span>
        </div>
      )}

      {/* Iframe container */}
      {!embedError && (
        <iframe
          src={currentUrl}
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer"
          title="Embedded Browser"
          className="browser__iframe"
          onLoad={() => setLoading(false)}
          onError={() => {
            setEmbedError(true);
            setLoading(false);
          }}
        />
      )}

      {/* Error state */}
      {embedError && (
        <div className="browser-error">
          <div className="browser-error__icon">⚠️</div>
          <h3>Failed to Load</h3>
          <p>The page could not be loaded. It may have been removed or is temporarily unavailable.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )}
    </div>
  );
}
