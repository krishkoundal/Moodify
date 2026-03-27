'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Music, Loader2, Play, Pause } from 'lucide-react';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { generatedLyrics, moods } from '@/lib/mockData';
import { useMood } from '@/lib/moodContext';
import { usePlayer } from '@/lib/playerContext';
import Image from 'next/image';

type GenerationStatus = 'idle' | 'generating' | 'complete';

export default function SoulTrackPage() {
  const [name, setName] = useState('Krish');
  const [mood, setMood] = useState('Calm');
  const [context, setContext] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [aiMessage, setAiMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLyricLine, setActiveLyricLine] = useState(0);
  const [generatedTrack, setGeneratedTrack] = useState<any>(null);

  const { languagePreference } = useMood();
  const { playSong, currentSong, isPlaying: isGlobalPlaying, togglePlay } = usePlayer();

  const contexts = ['Study', 'Gym', 'Heartbreak', 'Road Trip', 'Late Night', 'Morning Coffee', 'Meditation', 'Party'];

  const handleGenerate = async () => {
    setStatus('generating');
    setAiMessage('Crafting your soul track...');

    // Visual sequence
    setTimeout(() => setAiMessage('Writing lyrics based on your mood...'), 1500);
    setTimeout(() => setAiMessage('Composing melody...'), 3000);
    setTimeout(() => setAiMessage('Adding the finishing touches...'), 4500);
    
    try {
      // Build dynamic AI-like query
      const langQuery = languagePreference?.length 
        ? languagePreference.join(' ') 
        : 'Hindi English';
      const q = `top hit ${mood} song for ${context} ${langQuery}`;
      
      const fetchPromise = fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&limit=1`).then(r => r.json());
      const minimumDelayPromise = new Promise(resolve => setTimeout(resolve, 5500));
      
      // Wait for both the minimum cool UI delay and the actual API fetch
      const [data] = await Promise.all([fetchPromise, minimumDelayPromise]);
      
      if (data.tracks && data.tracks.length > 0) {
        setGeneratedTrack(data.tracks[0]);
      }
    } catch (err) {
      console.error("Failed to generate track", err);
    }

    setStatus('complete');
    setAiMessage('Your SoulTrack is ready! ✨');
  };

  // Auto-scroll lyrics when playing
  useEffect(() => {
    if (!isPlaying || status !== 'complete') return;
    const interval = setInterval(() => {
      setActiveLyricLine(prev => (prev + 1) % generatedLyrics.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neon-glow-purple">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">SoulTrack™</h1>
          <p className="text-white/40 text-sm">AI-generated songs, just for you</p>
        </div>
        <span className="ml-auto text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-semibold">
          AI POWERED
        </span>
      </div>

      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Form */}
          <div className="glass rounded-2xl p-6 space-y-5">
            {/* Name input */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-purple-500/50 text-sm border border-white/5"
                placeholder="Enter your name"
              />
            </div>

            {/* Mood selection */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Your Mood</label>
              <div className="flex gap-2 flex-wrap">
                {moods.map(m => (
                  <button
                    key={m.name}
                    onClick={() => setMood(m.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                      mood === m.name
                        ? 'bg-white/15 text-white ring-1 ring-white/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Vibe / Context</label>
              <div className="flex gap-2 flex-wrap">
                {contexts.map(c => (
                  <button
                    key={c}
                    onClick={() => setContext(context === c ? '' : c)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                      context === c
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <motion.button
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-base shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}
            whileTap={{ scale: 0.99 }}
          >
            <Sparkles className="w-5 h-5" />
            Generate My SoulTrack
          </motion.button>
        </motion.div>
      )}

      {/* Generating state */}
      {status === 'generating' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-12 flex flex-col items-center gap-6"
        >
          {/* Animated spinner */}
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-purple-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={aiMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/70 text-center"
            >
              {aiMessage}
            </motion.p>
          </AnimatePresence>

          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Complete state */}
      {status === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Song card */}
          <div className="glass rounded-2xl overflow-hidden shadow-2xl">
            {/* Cover */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
              {generatedTrack && generatedTrack.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={generatedTrack.cover} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
              ) : null}
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative text-center z-10 w-full px-4">
                <p className="text-white/80 text-xs mb-2 font-bold uppercase tracking-widest drop-shadow-md">SoulTrack™ for {name}</p>
                <h2 className="text-2xl md:text-3xl font-black text-white truncate drop-shadow-lg">
                  {generatedTrack ? generatedTrack.title : `Soul of ${name}`}
                </h2>
                <p className="text-purple-300 text-sm mt-2 font-medium drop-shadow-md">
                  {generatedTrack ? generatedTrack.artist : `${mood} • ${context || 'Freestyle'}`}
                </p>
              </div>
              {/* Decorative notes */}
              <motion.span
                className="absolute top-6 right-8 text-2xl opacity-30"
                animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎵
              </motion.span>
              <motion.span
                className="absolute bottom-8 left-8 text-2xl opacity-30"
                animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎶
              </motion.span>
            </div>

            {/* Play controls */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-white truncate">{generatedTrack ? generatedTrack.title : `Soul of ${name}`}</h3>
                  <p className="text-xs text-purple-400 font-medium">✨ AI Curated exclusively for you</p>
                </div>
                <motion.button
                  onClick={() => {
                    if (generatedTrack) {
                      if (currentSong?.id === generatedTrack.id) {
                        togglePlay();
                        setIsPlaying(!isGlobalPlaying);
                      } else {
                        playSong(generatedTrack, [generatedTrack]);
                        setIsPlaying(true);
                      }
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {(currentSong?.id === generatedTrack?.id ? isGlobalPlaying : isPlaying) ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  )}
                </motion.button>
              </div>

              <WaveformVisualizer isPlaying={isPlaying} color="#a855f7" barCount={60} height={40} />
            </div>
          </div>

          {/* Animated lyrics */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Lyrics</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
              {generatedLyrics.map((line, idx) => (
                <motion.p
                  key={idx}
                  className={`text-sm transition-all duration-500 ${
                    idx === activeLyricLine
                      ? 'text-white text-base font-semibold neon-text-purple scale-105 origin-left'
                      : Math.abs(idx - activeLyricLine) <= 2
                      ? 'text-white/50'
                      : 'text-white/20'
                  }`}
                  animate={idx === activeLyricLine ? { x: 8 } : { x: 0 }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Generate another */}
          <motion.button
            onClick={() => {
              setStatus('idle');
              setIsPlaying(false);
              setActiveLyricLine(0);
            }}
            className="w-full py-3 rounded-2xl glass text-white/60 text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Sparkles className="w-4 h-4" />
            Generate Another SoulTrack
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
