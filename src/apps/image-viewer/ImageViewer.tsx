/**
 * ImageViewer Component
 * Image viewer with zoom and pan capabilities
 * Supports PNG, JPG, WebP, SVG formats
 */

import { useState, useEffect, useRef } from 'react';
import { useVFSNodes } from '../../os/store';
import './ImageViewer.css';

interface ImageViewerProps {
  windowId: string;
  nodeId?: string;
}

export default function ImageViewer({ nodeId }: ImageViewerProps) {
  const nodes = useVFSNodes();
  const file = nodeId ? nodes[nodeId] : null;

  const [scale, setScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const imageUrl = file?.targetUrl;

  // Load image and get dimensions
  useEffect(() => {
    if (!imageUrl) {
      setError('No image provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setLoading(false);
    };
    img.onerror = () => {
      setError('Failed to load image');
      setLoading(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => {
    setScale(1.0);
    setPan({ x: 0, y: 0 });
  };

  const fitToWindow = () => {
    if (!containerRef.current || !imageDimensions.width) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight - 48; // Subtract toolbar height

    const scaleX = containerWidth / imageDimensions.width;
    const scaleY = containerHeight / imageDimensions.height;
    const newScale = Math.min(scaleX, scaleY, 1.0); // Don't zoom in beyond 100%

    setScale(newScale);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers (desktop mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1.0) return; // Only pan when zoomed
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Pan handlers (mobile touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1.0 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsPanning(true);
    setPanStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - panStart.x,
      y: touch.clientY - panStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  if (!file) {
    return (
      <div className="image-viewer">
        <div className="image-viewer__error">No image file provided</div>
      </div>
    );
  }

  return (
    <div className="image-viewer" ref={containerRef}>
      {/* Toolbar */}
      <div className="image-viewer__toolbar">
        <span className="image-viewer__toolbar-icon">🖼️</span>
        <span className="image-viewer__toolbar-title">{file.name}</span>
        {imageDimensions.width > 0 && (
          <span className="image-viewer__toolbar-info">
            {imageDimensions.width} × {imageDimensions.height}
          </span>
        )}
        <div className="image-viewer__toolbar-spacer"></div>
        <button
          className="image-viewer__toolbar-button"
          onClick={fitToWindow}
          title="Fit to window"
        >
          Fit
        </button>
        <button
          className="image-viewer__toolbar-button"
          onClick={resetZoom}
          title="Reset zoom (100%)"
        >
          Reset
        </button>
        <button
          className="image-viewer__toolbar-button"
          onClick={zoomOut}
          title="Zoom out"
          disabled={scale <= 0.5}
        >
          −
        </button>
        <span className="image-viewer__toolbar-zoom">{Math.round(scale * 100)}%</span>
        <button
          className="image-viewer__toolbar-button"
          onClick={zoomIn}
          title="Zoom in"
          disabled={scale >= 3.0}
        >
          +
        </button>
      </div>

      {/* Image Container */}
      <div
        className={`image-viewer__content ${isPanning ? 'image-viewer__content--panning' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && (
          <div className="image-viewer__loading">
            <div className="image-viewer__spinner"></div>
            <p>Loading image...</p>
          </div>
        )}

        {error && (
          <div className="image-viewer__error">
            <p>⚠️ {error}</p>
            <small>{imageUrl}</small>
          </div>
        )}

        {!loading && !error && imageUrl && (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={file.name}
            className="image-viewer__image"
            style={{
              transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
              cursor: scale > 1.0 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
