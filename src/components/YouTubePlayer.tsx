'use client';

import React, { useEffect, useState, memo, useRef } from 'react';
import ReactPlayer from 'react-player';

interface Props {
  src: string;
  playing: boolean;
  volume: number;
  onProgress: (state: any) => void;
  onDuration: (duration: number) => void;
  onEnded: () => void;
  onReady: (player: any) => void;
}

const YouTubePlayer = memo(({ src, playing, volume, onProgress, onDuration, onEnded, onReady }: Props) => {
  const [hasMounted, setHasMounted] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const ReactPlayerAny = ReactPlayer as any;

  const handleTimeUpdate = (e: any) => {
    const player = e.target;
    if (player && player.duration) {
      onProgress({
        played: player.currentTime / player.duration,
        playedSeconds: player.currentTime,
        loaded: 0,
        loadedSeconds: 0
      });
    }
  };

  const handleDurationChange = (e: any) => {
    const player = e.target;
    if (player && player.duration) {
      onDuration(player.duration);
    }
  };

  const handleLoadedMetadata = (e: any) => {
    const player = e.target;
    if (player && player.duration) {
      onDuration(player.duration);
    }
  };

  return (
    <div style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <ReactPlayerAny
        ref={playerRef}
        src={src}
        playing={playing}
        volume={volume / 100}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        onReady={() => {
          console.log("YouTubePlayer Ready via Internal Component");
          // Initialize duration on ready if possible
          if (playerRef.current) {
            if (playerRef.current.duration) {
              onDuration(playerRef.current.duration);
            }
            onReady(playerRef.current);
          }
        }}
        config={{
          youtube: {
            playerVars: { 
              autoplay: 1, 
              controls: 0, 
              origin: typeof window !== 'undefined' ? window.location.origin : '',
              enablejsapi: 1,
              modestbranding: 1
            }
          }
        }}
      />
    </div>
  );
}, (prev, next) => {
  // Only re-render if URL or volume changes. 
  // We handle playing prop changes via ReactPlayer's own prop diffing or manual ref if needed.
  // This prevents onProgress -> setState -> re-render loop from breaking the player.
  return prev.src === next.src && prev.volume === next.volume && prev.playing === next.playing;
});

export default YouTubePlayer;
