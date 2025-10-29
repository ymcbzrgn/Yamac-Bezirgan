/**
 * Photo Gallery App
 * Slideshow viewer with VFS integration
 */

import { useState, useEffect } from 'react';
import { useVFSNodes } from '../../os/store';
import type { VFSNode } from '../../os/types';
import './PhotoGallery.css';

interface PhotoGalleryProps {
  windowId: string;
  nodeId?: string;
}

export default function PhotoGallery({ windowId }: PhotoGalleryProps) {
  const [images, setImages] = useState<VFSNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvanceInterval, setAutoAdvanceInterval] = useState<number | null>(null);

  const vfsNodesRecord = useVFSNodes();
  const vfsNodes = Object.values(vfsNodesRecord);

  // Load images from VFS (Pictures folder and all image files)
  useEffect(() => {
    const imageNodes = vfsNodes.filter(
      (node: VFSNode) =>
        node.type === 'file' &&
        node.mimeType?.startsWith('image/')
    );

    setImages(imageNodes);

    return () => {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
      }
    };
  }, [vfsNodes]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPlaying && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000); // 5 seconds

      setAutoAdvanceInterval(interval);

      return () => clearInterval(interval);
    } else if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      setAutoAdvanceInterval(null);
    }
  }, [isPlaying, images.length]);

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  if (images.length === 0) {
    return (
      <div className="photo-gallery-app">
        <div className="photo-gallery-app__empty">
          <div className="photo-gallery-app__empty-icon">🖼️</div>
          <h3>No Images Found</h3>
          <p>Add image files to your Pictures folder to view them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-gallery-app">
      {/* Main Image Display */}
      <div className="photo-gallery-app__viewer">
        {currentImage && (
          <>
            <img
              src={currentImage.targetUrl || ''}
              alt={currentImage.name}
              className="photo-gallery-app__image"
            />
            <div className="photo-gallery-app__overlay">
              <div className="photo-gallery-app__filename">{currentImage.name}</div>
              <div className="photo-gallery-app__counter">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </>
        )}

        {/* Navigation Arrows */}
        <button
          className="photo-gallery-app__nav photo-gallery-app__nav--prev"
          onClick={goToPrevious}
          title="Previous"
        >
          ◀
        </button>
        <button
          className="photo-gallery-app__nav photo-gallery-app__nav--next"
          onClick={goToNext}
          title="Next"
        >
          ▶
        </button>
      </div>

      {/* Controls */}
      <div className="photo-gallery-app__controls">
        <button
          onClick={goToPrevious}
          className="photo-gallery-app__button"
          title="Previous"
        >
          ⏮ Prev
        </button>

        <button
          onClick={togglePlayPause}
          className="photo-gallery-app__button photo-gallery-app__button--play"
          title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={goToNext}
          className="photo-gallery-app__button"
          title="Next"
        >
          Next ⏭
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="photo-gallery-app__thumbnails">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`photo-gallery-app__thumbnail ${
              index === currentIndex ? 'photo-gallery-app__thumbnail--active' : ''
            }`}
            onClick={() => goToImage(index)}
            title={image.name}
          >
            <img
              src={image.targetUrl || ''}
              alt={image.name}
              className="photo-gallery-app__thumbnail-image"
            />
            {index === currentIndex && (
              <div className="photo-gallery-app__thumbnail-indicator">●</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
