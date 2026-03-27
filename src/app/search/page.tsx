'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Play, X, Music, Loader2, ListPlus } from 'lucide-react';
import { Song, songs, genres } from '@/lib/mockData';
import { usePlayer } from '@/lib/playerContext';
import Image from 'next/image';

function isUrl(str: string): boolean {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/'));
}


export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState<Song[]>([]);
  const [youtubeResults, setYoutubeResults] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { playSong, addToQueue, currentSong, isPlaying } = usePlayer();

  const handleAddToQueue = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    addToQueue(song);
    setToastMessage(`Added "${song.title}" to queue`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch trending on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/youtube/search?q=trending+music+top+hits');
        const data = await res.json();
        if (data && data.tracks) {
          setTrendingSongs(data.tracks.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setIsTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSpotifyResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch from both sources
        const [spotifyRes, youtubeRes] = await Promise.all([
          fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
        ]);

        const spotifyData = await spotifyRes.json();
        const youtubeData = await youtubeRes.json();

        if (spotifyData.error && !youtubeData.tracks) {
          setError(spotifyData.error || 'Failed to search');
        } else {
          setSpotifyResults(spotifyData.tracks || []);
          setYoutubeResults(youtubeData.tracks || []);
        }
      } catch (err) {
        setError('Failed to search');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-5xl mx-auto pb-24"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Search</h1>
        <p className="text-white/40 text-sm">Discover popular tracks from Moodify</p>
      </div>

      {/* Search bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
        <div className="relative">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full glass-strong rounded-2xl pl-14 pr-14 py-5 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-base border border-white/5"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
            {query && !isLoading && (
              <button
                onClick={() => setQuery('')}
                className="text-white/30 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3"
          >
            <X className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search results */}
      {query.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* YouTube Results - Priority for Unlimited songs */}
          {youtubeResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <h2 className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                    Full Songs
                  </h2>
                </div>
                <p className="text-[10px] text-white/20 uppercase font-medium">
                  {youtubeResults.length} tracks found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {youtubeResults.map((song, idx) => (
                  <motion.button
                    key={song.id}
                    onClick={() => playSong(song, youtubeResults)}
                    className="flex items-center gap-4 glass-strong rounded-2xl p-3 hover:bg-white/10 transition-all group text-left border border-white/5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg bg-neutral-800">
                      {isUrl(song.cover) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : song.cover ? (
                        <div className="w-full h-full group-hover:scale-110 transition-transform duration-500" style={{ background: song.cover }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{song.title}</p>
                      <p className="text-xs text-white/40 truncate mt-0.5">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-3 pr-2">
                      <div 
                        role="button"
                        onClick={(e) => handleAddToQueue(e, song)}
                        className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Add to Queue"
                      >
                        <ListPlus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-white/30 tabular-nums">{song.duration}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Spotify Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                Moodify Results (Previews)
              </h2>
              <p className="text-[10px] text-white/20 uppercase font-medium">
                {spotifyResults.length} tracks found
              </p>
            </div>

            {!isLoading && spotifyResults.length === 0 && youtubeResults.length === 0 && !error ? (
              <div className="glass rounded-3xl p-12 text-center border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/60 font-medium">No results found for &quot;{query}&quot;</p>
                <p className="text-xs text-white/30 mt-2">Try searching for popular artists or songs</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {spotifyResults.map((song, idx) => {
                  const isCurrent = currentSong?.id === song.id;
                  return (
                    <motion.button
                      key={song.id}
                      onClick={() => playSong(song, spotifyResults)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group text-left ${
                        isCurrent ? 'bg-purple-500/10 border border-purple-500/20' : 'border border-transparent'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg bg-neutral-800">
                        {isUrl(song.cover) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : song.cover ? (
                          <div className="w-full h-full group-hover:scale-110 transition-transform duration-500" style={{ background: song.cover }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-6 h-6 text-white/20" />
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-400' : 'text-white/90'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{song.artist} • {song.album}</p>
                      </div>
                      {!song.url && (
                        <span className="text-[10px] text-white/20 uppercase font-black px-2 py-1 bg-white/5 rounded-md">
                          Preview N/A
                        </span>
                      )}
                      <div className="flex items-center gap-3 pr-2">
                        <div 
                          role="button"
                          onClick={(e) => handleAddToQueue(e, song)}
                          className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Add to Queue"
                        >
                          <ListPlus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono text-white/30 tabular-nums">{song.duration}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Browse categories / Trending (when not searching) */}
      {!query.trim() && (
        <div className="space-y-10">
          {/* Recent Picks */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-black text-white tracking-tight">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isTrendingLoading ? (
                Array(6).fill(0).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 glass-strong rounded-2xl p-4 border border-white/5 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : trendingSongs.map((song, idx) => (
                <motion.button
                  key={song.id}
                  onClick={() => playSong(song, trendingSongs)}
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
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-white truncate">{song.title}</p>
                    <p className="text-xs text-white/40 truncate mt-1">{song.artist}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white" fill="white" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h2 className="text-xl font-black text-white mb-6 px-1">Browse Genres</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {genres.map((genre, idx) => (
                <motion.button
                  key={genre.name}
                  onClick={() => {
                    setQuery(`${genre.name} top songs`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative h-36 overflow-hidden rounded-3xl p-6 text-left bg-gradient-to-br ${genre.gradient} shadow-xl`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <span className="text-4xl block transform group-hover:scale-125 transition-transform duration-500 origin-left">
                      {genre.emoji}
                    </span>
                    <p className="text-lg font-black text-white tracking-tight">{genre.name}</p>
                  </div>
                  <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 font-black rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    {genre.emoji}
                  </div>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <ListPlus className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

