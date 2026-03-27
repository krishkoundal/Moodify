'use client';

import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { StoryFlowData } from '@/lib/mockData';
import { usePlayer } from '@/lib/playerContext';

interface StoryFlowProps {
  data: StoryFlowData;
}

export default function StoryFlow({ data }: StoryFlowProps) {
  const { playSong } = usePlayer();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">StoryFlow™</h2>
            <p className="text-xs text-white/40">Your emotional journey</p>
          </div>
        </div>
        <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
          {data.phases.length} phases
        </span>
      </div>

      {/* Horizontal timeline */}
      <div className="relative overflow-x-auto hide-scrollbar pb-4">
        <div className="flex gap-6 min-w-max px-1">
          {data.phases.map((phase, phaseIdx) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: phaseIdx * 0.15, duration: 0.5 }}
              className="w-72 shrink-0"
            >
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `${phase.color}20`, boxShadow: `0 0 20px ${phase.color}30` }}
                  >
                    {phase.emoji}
                  </div>
                  {/* Connector line */}
                  {phaseIdx < data.phases.length - 1 && (
                    <div className="absolute top-1/2 left-full w-[calc(100%+1.5rem)] h-px">
                      <div
                        className="h-full opacity-30"
                        style={{
                          background: `linear-gradient(to right, ${phase.color}, ${data.phases[phaseIdx + 1].color})`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{phase.name}</p>
                  <p className="text-[11px] text-white/40">Phase {phaseIdx + 1}</p>
                </div>
              </div>

              {/* Songs in phase */}
              <div className="glass rounded-2xl p-3 space-y-2">
                {phase.songs.map((song, songIdx) => (
                  <motion.button
                    key={song.id}
                    onClick={() => playSong(song, phase.songs)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: phaseIdx * 0.15 + songIdx * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={song.cover && !song.cover.startsWith('http') ? { background: song.cover } : { background: '#1f1f2e' }}
                    >
                      {song.cover && song.cover.startsWith('http') && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={song.cover} alt={song.title} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity relative z-10" fill="white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white/90 truncate">{song.title}</p>
                      <p className="text-[11px] text-white/40 truncate">{song.artist}</p>
                    </div>
                    <span className="text-[11px] text-white/30">{song.duration}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gradient edges */}
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a12] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
