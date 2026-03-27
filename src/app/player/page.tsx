'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Share2, Volume2, ListMusic } from 'lucide-react';
import { usePlayer } from '@/lib/playerContext';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { songs } from '@/lib/mockData';
import { useEffect } from 'react';

export default function PlayerPage() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, progress, setProgress, volume, setVolume } = usePlayer();
  const { playSong } = usePlayer();

  // If no song is selected, pick the first one
  useEffect(() => {
    if (!currentSong) {
      playSong(songs[0]);
    }
  }, [currentSong, playSong]);

  const song = currentSong || songs[0];

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(Math.min(100, progress + 0.3));
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying, progress, setProgress]);

  const formatTime = (pct: number) => {
    const totalSeconds = Math.floor((pct / 100) * 225); // ~3:45
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center max-w-lg mx-auto px-4"
    >
      {/* Blurred background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30 blur-[120px]"
          style={{ background: song.cover }}
        />
      </div>

      <div className="relative z-10 w-full space-y-8">
        {/* Album art */}
        <motion.div
          className="mx-auto w-64 h-64 md:w-72 md:h-72 rounded-3xl shadow-2xl overflow-hidden relative"
          animate={{ rotate: isPlaying ? [0, 360] : 0 }}
          transition={isPlaying ? { duration: 30, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: song.cover }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm border-4 border-white/10" />
          </div>
        </motion.div>

        {/* Song info */}
        <div className="text-center space-y-2">
          <motion.h1
            key={song.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {song.title}
          </motion.h1>
          <p className="text-white/50">{song.artist}</p>
          <p className="text-xs text-white/30">{song.album}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6">
          <motion.button whileTap={{ scale: 0.9 }} className="text-white/40 hover:text-pink-400 transition-colors">
            <Heart className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="text-white/40 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="text-white/40 hover:text-white transition-colors">
            <ListMusic className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Waveform */}
        <div className="px-4">
          <WaveformVisualizer isPlaying={isPlaying} color={song.color} barCount={50} height={48} />
        </div>

        {/* Progress */}
        <div className="space-y-2 px-2">
          <div
            className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(pct);
            }}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(to right, ${song.color}80, ${song.color})`,
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-white/30">
            <span>{formatTime(progress)}</span>
            <span>{song.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={prevSong}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </motion.button>
          
          <motion.button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-black" fill="black" />
            ) : (
              <Play className="w-7 h-7 text-black ml-1" fill="black" />
            )}
          </motion.button>
          
          <motion.button
            onClick={nextSong}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Repeat className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-center gap-3 px-12">
          <Volume2 className="w-4 h-4 text-white/30" />
          <div
            className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer max-w-48"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setVolume(pct);
            }}
          >
            <div
              className="h-full bg-white/40 rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
