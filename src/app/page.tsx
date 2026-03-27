'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Music } from 'lucide-react';
import { Play, TrendingUp, Clock } from 'lucide-react';
import MoodScanner from '@/components/MoodScanner';
import StoryFlow from '@/components/StoryFlow';
import { storyFlows, playlists } from '@/lib/mockData';
import { usePlayer } from '@/lib/playerContext';
import { useMood } from '@/lib/moodContext';

import { useSession } from 'next-auth/react';

function isUrl(str: string): boolean {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/'));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const { currentMood: selectedMood, setCurrentMood: setSelectedMood, languagePreference } = useMood();
  const { playSong } = usePlayer();

  const [madeForYouSongs, setMadeForYouSongs] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!selectedMood) {
      setMadeForYouSongs([]);
      return;
    }

    const generateMadeForYou = async () => {
      setIsGenerating(true);
      try {
        const langQuery = languagePreference?.length 
          ? languagePreference.join(' ') 
          : 'Hindi English Punjabi';
        const q = `top hit ${selectedMood} mood songs ${langQuery}`;
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&limit=18`);
        const data = await res.json();
        if (data.tracks) {
          setMadeForYouSongs(data.tracks);
        }
      } catch (err) {
        console.error("Failed to generate made for you:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    generateMadeForYou();
  }, [selectedMood, languagePreference]);

  // Filter logic for playlists and storyFlows
  const filterSongs = (songsToFilter: any[]) => {
    if (!languagePreference || languagePreference.length === 0) return songsToFilter;
    return songsToFilter.filter(s => s.language && languagePreference.includes(s.language));
  };

  const filteredPlaylists = playlists.map(p => ({
    ...p,
    songs: filterSongs(p.songs)
  })).filter(p => p.songs.length > 0);

  const getFilteredStoryFlow = (mood: string) => {
    const data = storyFlows[mood];
    if (!data) return null;

    // Dynamically inject our freshly fetched YouTube songs into the phases
    // We fetched 18 songs, so 18 / 3 phases = 6 real, dynamic songs per phase!
    if (madeForYouSongs.length >= 6) {
      const perPhase = Math.floor(madeForYouSongs.length / data.phases.length);
      return {
        ...data,
        phases: data.phases.map((phase, idx) => ({
          ...phase,
          songs: madeForYouSongs.slice(idx * perPhase, (idx + 1) * perPhase)
        }))
      };
    }

    // Fallback to static mockData if not loaded yet
    return {
      ...data,
      phases: data.phases.map(phase => ({
        ...phase,
        songs: filterSongs(phase.songs)
      })).filter(phase => phase.songs.length > 0)
    };
  };

  const currentStoryFlow = selectedMood ? getFilteredStoryFlow(selectedMood) : null;


  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center neon-glow-purple animate-pulse">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
        </div>
        <p className="text-purple-400/50 uppercase tracking-[0.2em] text-[10px] font-bold animate-pulse">
          Synchronizing with Moodify...
        </p>
      </div>
    );
  }


  const userName = session?.user?.name?.split(' ')[0] || 'Friend';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="pt-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {getGreeting()}, <span className="text-purple-400">{userName}</span> 🎧
        </h1>
        <p className="text-white/40 mt-2 text-sm">Let&apos;s find the perfect soundtrack for your moment.</p>
      </motion.div>



      {/* Mood Scanner Section */}
      <motion.div variants={itemVariants}>
        <MoodScanner onMoodSelect={(mood) => setSelectedMood(mood as any)} selectedMood={selectedMood} />
      </motion.div>


      {/* StoryFlow - conditionally shown based on mood */}
      {selectedMood && currentStoryFlow && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* AI message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 border border-purple-500/20"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <p className="text-sm text-white/70">
              Building your emotional journey...
              <span className="text-purple-400 ml-1 font-medium">✨ StoryFlow ready</span>
            </p>
          </motion.div>

          <StoryFlow data={currentStoryFlow} />
        </motion.div>
      )}

      {/* Recently Played */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white/40" />
            <h2 className="text-lg font-bold text-white">Recently Played</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredPlaylists.slice(0, 4).map((playlist, idx) => (
            <motion.button
              key={playlist.id}
              onClick={() => playSong(playlist.songs[0], playlist.songs)}
              className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all group text-left border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="relative w-14 h-14 rounded-xl shrink-0 shadow-lg overflow-hidden bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{playlist.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{playlist.songs.length} tracks</p>
              </div>
            </motion.button>
          ))}
        </div>

      </motion.div>

      {/* Recommended Playlists */}
      <motion.div variants={itemVariants}>
        {selectedMood && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-white/40" />
                <h2 className="text-lg font-bold text-white">Your Custom Mix</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {isGenerating ? (
                Array(12).fill(0).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 glass-strong rounded-2xl p-4 border border-white/5 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : madeForYouSongs.map((song, idx) => (
                <motion.button
                  key={song.id + idx}
                  onClick={() => playSong(song, madeForYouSongs)}
                  className="flex items-center gap-4 glass-strong rounded-2xl p-4 hover:bg-white/10 transition-all group text-left border border-white/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="relative w-16 h-16 rounded-xl shrink-0 shadow-2xl overflow-hidden bg-neutral-800">
                    {isUrl(song.cover) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    ) : song.cover ? (
                      <div className="w-full h-full" style={{ background: song.cover }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-500/20">
                        <Music className="w-6 h-6 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 xl:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Play className="w-6 h-6 text-white fill-white shadow-neon-purple" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">{song.title}</p>
                    <p className="text-xs text-white/40 truncate mt-1">{song.artist}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3 text-white" fill="white" />
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

      </motion.div>
    </motion.div>
  );
}
