'use client';

import { usePlayer } from '@/lib/playerContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, ChevronDown, MoreVertical, Plus, Shuffle, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NowPlayingBar() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, progress, volume, currentTime, duration, setProgress, setVolume, addToQueue, isShuffle, isRepeat, toggleShuffle, toggleRepeat } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const isGradient = currentSong.cover.startsWith('linear-gradient') || currentSong.cover.startsWith('from-');

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <AnimatePresence>
      {!isExpanded && (
        <motion.div
          key="minimized-player"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="glass-strong border-t border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
              {/* Song info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-2xl shrink-0 group">
                  {isGradient ? (
                    <div className="w-full h-full" style={{ background: currentSong.cover }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentSong.cover}
                      alt={currentSong.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate leading-tight">{currentSong.title}</p>
                  <p className="text-sm text-white/40 truncate mt-1">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls & Progress */}
              <div className="flex flex-col items-center gap-2 flex-1 max-w-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-6">
                  <button onClick={prevSong} className="p-2 text-white/40 hover:text-white transition-colors">
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>
                  <motion.button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl hover:shadow-purple-500/20 transition-all"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 text-black" fill="black" /> : <Play className="w-6 h-6 text-black ml-1" fill="black" />}
                  </motion.button>
                  <button onClick={nextSong} className="p-2 text-white/40 hover:text-white transition-colors">
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="w-full flex items-center gap-3">
                  <span className="text-[10px] font-mono text-white/30 w-10 text-right">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-4 flex items-center relative group">
                    <div className="w-full h-1.5 bg-white/5 rounded-full relative overflow-hidden pointer-events-none">
                      <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="absolute h-3 w-3 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ left: `calc(${progress}% - 6px)` }} />
                    <input type="range" min="0" max="100" step="0.1" value={progress || 0} onChange={(e) => setProgress(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 w-10">{formatTime(duration || 0)}</span>
                </div>
              </div>

              {/* Volume & Actions */}
              <div className="hidden lg:flex items-center justify-end gap-4 flex-1" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 w-32 group">
                  <Volume2 className="w-4 h-4 text-white/30 group-hover:text-purple-400 transition-colors" />
                  <div className="flex-1 h-4 flex items-center relative group">
                    <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-purple-500 transition-all" style={{ width: `${volume}%` }} />
                    </div>
                    <div className="absolute h-3 w-3 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ left: `calc(${volume}% - 6px)` }} />
                    <input type="range" min="0" max="100" step="0.1" value={volume || 0} onChange={(e) => setVolume(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isExpanded && (
        <motion.div
          key="expanded-player"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black"
        >
          {/* Full Screen Background Layer */}
          <div className="absolute inset-0 z-0">
            {isGradient ? (
              <div className="w-full h-full opacity-60" style={{ background: currentSong.cover }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover opacity-60 scale-110 blur-xl"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* Foreground Layer */}
          <div className="relative z-10 flex flex-col h-full bg-transparent px-6 py-8">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-3 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">Playing From Search</p>
                <p className="text-sm font-medium text-white/90">"{currentSong.title}"</p>
              </div>
              <div className="w-12 h-12" />
            </div>

            {/* Bottom Content Area */}
            <div className="flex flex-col justify-end flex-1 max-w-lg mx-auto w-full pb-8">
              {/* Song Title and Add Button */}
              <div className="flex items-end justify-between mb-8 gap-4 px-2">
                <div className="flex items-center gap-5 min-w-0 flex-1">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
                    {isGradient ? (
                      <div className="w-full h-full" style={{ background: currentSong.cover }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-white truncate drop-shadow-lg mb-1">{currentSong.title}</h2>
                    <p className="text-xl md:text-2xl text-white/70 truncate drop-shadow-md">{currentSong.artist}</p>
                  </div>
                </div>
                <button 
                  onClick={() => addToQueue(currentSong)}
                  className="p-3 shrink-0 rounded-full border border-white/20 hover:bg-white/10 transition-colors bg-black/20 backdrop-blur-md"
                  title="Add to Queue"
                >
                  <Plus className="w-7 h-7 text-white" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-2 mb-8">
                <div className="w-full flex items-center relative group h-6 cursor-pointer">
                  <div className="w-full h-2 bg-white/20 rounded-full relative overflow-hidden pointer-events-none transition-all group-hover:h-3">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div 
                    className="absolute h-4 w-4 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress || 0}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-mono text-white/60">{formatTime(currentTime)}</span>
                  <span className="text-sm font-mono text-white/60">{formatTime(duration || 0)}</span>
                </div>
              </div>

              {/* Main Controls Row */}
              <div className="flex items-center justify-between px-2 pb-8">
                <button 
                  onClick={toggleShuffle}
                  className={`p-3 transition-colors ${isShuffle ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-white/50 hover:text-white'}`}
                >
                  <Shuffle className="w-7 h-7" />
                </button>
                <button onClick={prevSong} className="p-4 text-white hover:scale-110 transition-transform">
                  <SkipBack className="w-10 h-10 fill-current" />
                </button>
                <motion.button
                  onClick={togglePlay}
                  className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-black fill-black" />
                  ) : (
                    <Play className="w-10 h-10 text-black fill-black ml-2" />
                  )}
                </motion.button>
                <button onClick={nextSong} className="p-4 text-white hover:scale-110 transition-transform">
                  <SkipForward className="w-10 h-10 fill-current" />
                </button>
                <button 
                  onClick={toggleRepeat}
                  className={`p-3 transition-colors ${isRepeat ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-white/50 hover:text-white'}`}
                >
                  <Repeat className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
