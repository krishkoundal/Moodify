import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Song, songs } from './mockData';
import dynamic from 'next/dynamic';

import YouTubePlayer from '@/components/YouTubePlayer';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Song[];
  userQueue: Song[];
  currentIndex: number;
  duration: number;
  currentTime: number;
  isFetchingNext?: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
}

interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  addToQueue: (song: Song) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playerRef, setPlayerRef] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    progress: 0,
    volume: 75,
    queue: songs,
    userQueue: [],
    currentIndex: 0,
    duration: 0,
    currentTime: 0,
    isFetchingNext: false,
    isShuffle: false,
    isRepeat: false,
  });

  const lastTrackedSongId = useRef<string | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onProgress = (progress: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    setState(prev => ({
      ...prev,
      progress: progress.played * 100,
      currentTime: progress.playedSeconds
    }));
  };

  const onDuration = (duration: number) => {
    setState(prev => ({ ...prev, duration }));
  };

  const onEnded = () => {
    // If repeat is enabled, simply loop the current song
    if (state.isRepeat && playerRef) {
      if (typeof playerRef.seekTo === 'function') {
        playerRef.seekTo(0);
      } else {
        playerRef.currentTime = 0;
      }
      setState(prev => ({ ...prev, progress: 0, isPlaying: true }));
      return;
    }
    nextSong();
  };

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    const q = queue || songs;
    const idx = q.findIndex(s => s.id === song.id);
    
    setState(prev => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
      progress: 0,
      queue: q,
      userQueue: [],
      currentIndex: idx >= 0 ? idx : 0,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setState(prev => {
      if (!prev.currentSong) {
        return {
          ...prev,
          currentSong: song,
          isPlaying: true,
          queue: [song],
          userQueue: [],
          currentIndex: 0,
          progress: 0,
        };
      }
      return {
        ...prev,
        userQueue: [...prev.userQueue, song]
      };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({ ...prev, isRepeat: !prev.isRepeat }));
  }, []);

  const nextSong = useCallback(() => {
    setState(prev => {
      // 1. User queued songs take priority
      if (prev.userQueue.length > 0) {
        const nextUserSong = prev.userQueue[0];
        const remainingUserQueue = prev.userQueue.slice(1);
        return {
          ...prev,
          currentSong: nextUserSong,
          userQueue: remainingUserQueue,
          progress: 0,
          isPlaying: true,
        };
      }

      // 2. Base queue continuation
      if (prev.queue.length === 0) return prev;
      
      const isAtEnd = prev.currentIndex === prev.queue.length - 1;
      if (isAtEnd && prev.currentSong && !prev.isShuffle) {
        return { ...prev, isFetchingNext: true };
      }

      const nextIdx = prev.isShuffle 
        ? Math.floor(Math.random() * prev.queue.length)
        : (prev.currentIndex + 1) % prev.queue.length;
        
      return {
        ...prev,
        currentSong: prev.queue[nextIdx],
        currentIndex: nextIdx,
        progress: 0,
        isPlaying: true,
      };
    });
  }, []);

  // Auto-play related song when reaching end of queue
  useEffect(() => {
    const fetchRelatedSong = async () => {
      if (!state.isFetchingNext || !state.currentSong) return;

      try {
        console.log(`Auto-fetching related song for: ${state.currentSong.title}`);
        const res = await fetch(`/api/youtube/related?artist=${encodeURIComponent(state.currentSong.artist)}&title=${encodeURIComponent(state.currentSong.title)}`);
        const data = await res.json();
        
        if (data && data.track) {
          setState(prev => {
            const newQueue = [...prev.queue, data.track];
            return {
              ...prev,
              queue: newQueue,
              currentSong: data.track,
              currentIndex: prev.queue.length,
              progress: 0,
              isPlaying: true,
              isFetchingNext: false,
            };
          });
        } else {
          // If no track found, just wrap around smoothly
          setState(prev => ({
            ...prev,
            currentSong: prev.queue[0],
            currentIndex: 0,
            progress: 0,
            isPlaying: true,
            isFetchingNext: false
          }));
        }
      } catch (err) {
        console.error("Related auto-play fetch error:", err);
        setState(prev => ({
          ...prev,
          isFetchingNext: false,
          isPlaying: false
        }));
      }
    };

    fetchRelatedSong();
  }, [state.isFetchingNext, state.currentSong]);

  const prevSong = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;
      const prevIdx = prev.currentIndex === 0 ? prev.queue.length - 1 : prev.currentIndex - 1;
      return {
        ...prev,
        currentSong: prev.queue[prevIdx],
        currentIndex: prevIdx,
        userQueue: [],
        progress: 0,
        isPlaying: true,
      };
    });
  }, []);
  // Effect to handle automatic YouTube URL fetching whenever song changes
  useEffect(() => {
    const fetchUrlForCurrentSong = async () => {
      const song = state.currentSong;
      if (!song) return;

      // Skip if it already has a valid YouTube URL
      if (song.url && (song.url.includes('youtube.com') || song.url.includes('youtu.be'))) {
        return;
      }

      try {
        console.log(`Auto-fetching YouTube URL for: ${song.title} ${song.artist}`);
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(`${song.title} ${song.artist}`)}`);
        const data = await res.json();
        
        if (data && data.tracks && data.tracks.length > 0) {
          const newUrl = data.tracks[0].url;
          // Only update if it's still the same song
          setState(prev => {
            if (prev.currentSong?.id === song.id) {
              return {
                ...prev,
                currentSong: { ...song, url: newUrl }
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Auto-fetch error:", err);
      }
    };

    fetchUrlForCurrentSong();
  }, [state.currentSong?.id]); // Watch individual song ID changes

  // Stats Tracking Effect
  useEffect(() => {
    if (!state.currentSong || !state.isPlaying) {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      return;
    }

    // 1. Track Song Played (if it's a new song)
    if (state.currentSong.id !== lastTrackedSongId.current) {
      const incrementSongsPlayed = async () => {
        try {
          await fetch('/api/user/stats', {
            method: 'POST',
            body: JSON.stringify({ incrementSongs: true })
          });
          lastTrackedSongId.current = state.currentSong?.id || null;
        } catch (err) {
          console.error('Failed to increment songs played:', err);
        }
      };
      incrementSongsPlayed();
    }

    // 2. Start Heartbeat for Listening Time
    if (!heartbeatRef.current) {
      heartbeatRef.current = setInterval(async () => {
        try {
          await fetch('/api/user/stats', {
            method: 'POST',
            body: JSON.stringify({ incrementTime: 30 }) // Increment by 30 seconds
          });
        } catch (err) {
          console.error('Failed to update listening time:', err);
        }
      }, 30000); // Every 30 seconds
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [state.currentSong?.id, state.isPlaying]);

  const setProgress = useCallback((p: number) => {
    if (playerRef) {
      const duration = playerRef.duration || state.duration;
      console.log(`Seek requested: ${p}%, Duration: ${duration}`);
      
      if (typeof playerRef.seekTo === 'function') {
        playerRef.seekTo(p / 100, 'fraction');
      } else if (duration > 0) {
        try {
          const targetTime = (p / 100) * duration;
          playerRef.currentTime = targetTime;
          console.log(`Custom seek to: ${targetTime}s`);
        } catch (err) {
          console.error("Seek error:", err);
        }
      } else {
        console.warn("Seek failed: Duration is 0");
      }
    } else {
      console.warn("Seek failed: playerRef is null");
    }
    setState(prev => ({ ...prev, progress: p }));
  }, [playerRef, state.duration]);

  const setVolume = useCallback((v: number) => {
    setState(prev => ({ ...prev, volume: v }));
  }, []);

  return (
    <PlayerContext.Provider value={{ ...state, playSong, togglePlay, nextSong, prevSong, setProgress, setVolume, addToQueue, toggleShuffle, toggleRepeat }}>
      {children}
      {isClient && state.currentSong?.url && (
        <YouTubePlayer 
          src={state.currentSong.url}
          playing={state.isPlaying}
          volume={state.volume}
          onProgress={onProgress}
          onDuration={onDuration}
          onEnded={onEnded}
          onReady={(player: any) => {
            console.log("YouTubePlayer Ready via Context");
            setPlayerRef(player);
          }}
        />
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}

