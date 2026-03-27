'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Music, Clock, TrendingUp, Calendar, Edit2, Check, X, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import { insights as mockInsights, moods } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEffect } from 'react';

const AVATAR_OPTIONS = [
  'micah', 'bottts', 'adventurer', 'avataaars', 'fun-emoji', 'lorelei'
];

const generateDiceBearUrl = (style: string, seed: string) => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
};

const moodColorMap: Record<string, string> = {
  Happy: '#facc15',
  Sad: '#3b82f6',
  Angry: '#ef4444',
  Calm: '#06b6d4',
  Energetic: '#a855f7',
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ songsPlayed: 0, listeningTime: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [moodRes, statsRes] = await Promise.all([
          fetch('/api/user/mood'),
          fetch('/api/user/stats')
        ]);

        const moodData = await moodRes.json();
        const statsData = await statsRes.json();

        if (moodData.moodHistory) {
          const formatted = moodData.moodHistory.map((h: any) => ({
            ...h,
            dateLabel: new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
          }));
          setMoodHistory(formatted);
        }

        if (statsData) {
          setStats({
            songsPlayed: statsData.songsPlayed || 0,
            listeningTime: statsData.listeningTime || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const moodCounts = moodHistory.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const chartData = moodHistory.map((entry) => ({
    date: entry.dateLabel || entry.date,
    score: entry.score,
    mood: entry.mood,
  }));

  const userName = session?.user?.name || 'User';
  const defaultSeed = userName.replace(/\\s+/g, '');

  const preGeneratedAvatars = AVATAR_OPTIONS.map(style => generateDiceBearUrl(style, defaultSeed));

  const handleSaveAvatar = async () => {
    const newAvatar = customAvatarUrl || selectedAvatar;
    if (!newAvatar) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newAvatar })
      });

      if (res.ok) {
        // Force next-auth session update
        await updateSession({ image: newAvatar });
        setIsModalOpen(false);
        setCustomAvatarUrl('');
        setSelectedAvatar(null);
      } else {
        console.error('Failed to update avatar:', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-5xl mx-auto pb-20"
    >
      {/* Profile header */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow-purple relative group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all shadow-xl hover:shadow-purple-500/50"
        >
          {session?.user?.image ? (
            <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-white" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1">
            <Edit2 className="w-5 h-5 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Edit</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-black text-white">{userName}</h1>
          <p className="text-white/50 text-sm mt-1">{session?.user?.email || 'Premium Member • Music Lover'}</p>
          <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
            <div className="flex items-center gap-1 text-xs text-white/30">
              <Music className="w-3 h-3" />
              <span>{stats.songsPlayed} songs played</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/30">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(stats.listeningTime / 3600)}h listening time</span>
            </div>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/40">Moodify Connected</span>
        </div>
      </div>

      {/* MindStats header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">MindStats™</h2>
          <p className="text-xs text-white/40">Your emotional analytics</p>
        </div>
      </div>

      {/* Mood chart */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-sm text-white/40">Syncing with your soul...</p>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white/60">Mood Over Time</h3>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <Calendar className="w-3 h-3" />
            <span>{moodHistory.length > 0 ? 'Real-time Stats' : 'No scans yet'}</span>
          </div>
        </div>
        <div className="h-64">
          {moodHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 15, 30, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/60 font-medium">Your Mood Journey Starts Here</p>
              <p className="text-white/30 text-xs mt-1 max-w-[200px]">Perform your first MoodScan™ on the home page to see your real-time analytics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood distribution */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {moods.map(m => {
          const count = moodCounts[m.name] || 0;
          const total = moodHistory.length;
          const pct = Math.round((count / total) * 100);

          return (
            <motion.div
              key={m.name}
              className="glass rounded-2xl p-4 text-center"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-2xl block mb-2">{m.emoji}</span>
              <p className="text-xs text-white/40 mb-1">{m.name}</p>
              <p className="text-xl font-bold text-white">{pct}%</p>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">AI Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(moodHistory.length > 3 ? [
            { text: `You've recorded ${moodHistory.length} moods recently!`, emoji: '📈', color: '#a855f7' },
            { text: `Your most frequent mood is ${Object.entries(moodCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'unknown'}.`, emoji: '🧠', color: '#60a5fa' },
            ...mockInsights.slice(0, 2)
          ] : mockInsights).map((insight: any, idx: number) => (
            <motion.div
              key={idx}
              className="glass rounded-2xl p-4 flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                style={{ background: `${insight.color}15` }}
              >
                {insight.emoji}
              </div>
              <div>
                <p className="text-sm text-white/80">{insight.text}</p>
                <p className="text-xs text-white/30 mt-1">Based on your listening patterns</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mood log */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Recent Mood Log</h3>
        <div className="glass rounded-2xl overflow-hidden min-h-[100px] relative">
          {isLoading && <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10" />}
          <div className="divide-y divide-white/5">
            {moodHistory.length > 0 ? moodHistory.slice().reverse().map((entry: any, idx: number) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: moodColorMap[entry.mood] || '#a855f7' }}
                />
                <div className="flex-1">
                  <p className="text-sm text-white/80">{entry.mood}</p>
                  <p className="text-xs text-white/30">
                    {entry.dateLabel || new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {entry.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white/60">{entry.score}/100</p>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-white/20 italic text-sm">
                No logs recorded yet. Start your first scan on the Home page.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-strong border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Customize Avatar
                </h2>
                <p className="text-white/50 text-sm mt-1">Pick a new vibe or link to a custom image.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {preGeneratedAvatars.map((url, idx) => {
                  const isSelected = selectedAvatar === url;
                  return (
                    <div 
                      key={idx}
                      onClick={() => { setSelectedAvatar(url); setCustomAvatarUrl(''); }}
                      className={`relative aspect-square rounded-2xl p-2 cursor-pointer transition-all duration-300 border-2 ${
                        isSelected ? 'border-purple-500 bg-purple-500/10 shadow-neon-purple scale-[1.02]' : 'border-transparent bg-white/5 hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt="Avatar option" className="w-full h-full object-cover rounded-xl" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-white/30" />
                </div>
                <input 
                  type="text" 
                  placeholder="Or paste an image URL..."
                  value={customAvatarUrl}
                  onChange={(e) => { setCustomAvatarUrl(e.target.value); setSelectedAvatar(null); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <button
                onClick={handleSaveAvatar}
                disabled={(!selectedAvatar && !customAvatarUrl) || isSaving}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex justify-center items-center transition-all ${
                  (!selectedAvatar && !customAvatarUrl) || isSaving
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  "Save New Avatar"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
