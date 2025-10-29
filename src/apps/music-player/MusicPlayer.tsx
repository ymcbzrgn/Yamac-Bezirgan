/**
 * Music Player App
 * HTML5 Audio-based music player
 */

import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

interface MusicPlayerProps {
  windowId: string;
  nodeId?: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

// Sample playlist (replace with actual audio files)
const SAMPLE_PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Sample Track 1',
    artist: 'Demo Artist',
    url: '', // Placeholder - would be actual mp3 URL
  },
  {
    id: 'track-2',
    title: 'Sample Track 2',
    artist: 'Demo Artist',
    url: '', // Placeholder
  },
  {
    id: 'track-3',
    title: 'Sample Track 3',
    artist: 'Demo Artist',
    url: '', // Placeholder
  },
];

export default function MusicPlayer({ windowId }: MusicPlayerProps) {
  const [playlist] = useState<Track[]>(SAMPLE_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    // Auto-play next track
    nextTrack();
  };

  // Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Note: In a real app, we'd check if URL exists
      if (currentTrack.url) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        alert('No audio file available. This is a demo placeholder.');
      }
    }
  };

  // Stop
  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Previous track
  const prevTrack = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Next track
  const nextTrack = () => {
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-app">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Album Art Placeholder */}
      <div className="music-player-app__artwork">
        <div className="music-player-app__artwork-placeholder">
          🎵
        </div>
      </div>

      {/* Track Info */}
      <div className="music-player-app__info">
        <div className="music-player-app__title">{currentTrack.title}</div>
        <div className="music-player-app__artist">{currentTrack.artist}</div>
      </div>

      {/* Progress Bar */}
      <div className="music-player-app__progress-section">
        <span className="music-player-app__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="music-player-app__progress"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
        />
        <span className="music-player-app__time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="music-player-app__controls">
        <button
          onClick={prevTrack}
          className="music-player-app__button music-player-app__button--control"
          title="Previous"
        >
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="music-player-app__button music-player-app__button--play"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={stop}
          className="music-player-app__button music-player-app__button--control"
          title="Stop"
        >
          ⏹
        </button>

        <button
          onClick={nextTrack}
          className="music-player-app__button music-player-app__button--control"
          title="Next"
        >
          ⏭
        </button>
      </div>

      {/* Volume Control */}
      <div className="music-player-app__volume">
        <span className="music-player-app__volume-icon">🔊</span>
        <input
          type="range"
          className="music-player-app__volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
        />
        <span className="music-player-app__volume-value">{volume}%</span>
      </div>

      {/* Playlist */}
      <div className="music-player-app__playlist">
        <div className="music-player-app__playlist-header">Playlist</div>
        {playlist.map((track, index) => (
          <div
            key={track.id}
            className={`music-player-app__playlist-item ${
              index === currentTrackIndex ? 'music-player-app__playlist-item--active' : ''
            }`}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          >
            <span className="music-player-app__playlist-number">{index + 1}</span>
            <div className="music-player-app__playlist-info">
              <div className="music-player-app__playlist-title">{track.title}</div>
              <div className="music-player-app__playlist-artist">{track.artist}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Notice */}
      <div className="music-player-app__notice">
        ℹ️ Demo mode - Audio files not included
      </div>
    </div>
  );
}
