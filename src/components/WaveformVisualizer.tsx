'use client';

import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
  height?: number;
}

export default function WaveformVisualizer({ isPlaying, color = '#a855f7', barCount = 40, height = 64 }: WaveformVisualizerProps) {
  return (
    <div className="flex items-end justify-center gap-[2px]" style={{ height }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const baseHeight = Math.random() * 0.6 + 0.2;
        const delay = i * 0.05;
        
        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: Math.max(2, Math.floor(height / barCount)),
              background: `linear-gradient(to top, ${color}80, ${color})`,
              opacity: 0.8,
            }}
            animate={
              isPlaying
                ? {
                    height: [
                      `${baseHeight * 30}%`,
                      `${(baseHeight + 0.3) * 100}%`,
                      `${baseHeight * 50}%`,
                      `${(baseHeight + 0.5) * 80}%`,
                      `${baseHeight * 30}%`,
                    ],
                  }
                : { height: `${baseHeight * 30}%` }
            }
            transition={
              isPlaying
                ? {
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: delay % 1,
                  }
                : { duration: 0.5 }
            }
          />
        );
      })}
    </div>
  );
}
