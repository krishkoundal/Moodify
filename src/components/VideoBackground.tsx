'use client';

import { usePathname } from 'next/navigation';
import { useMood } from '@/lib/moodContext';
import { useEffect, useState } from 'react';

const MOOD_VIDEOS = {
  Happy: "https://motionbgs.com/media/4149/a-sunny-day-in-your-name.1920x1080.mp4",
  Sad: "https://motionbgs.com/media/9088/solitary-reflection.1920x1080.mp4",
  Angry: "https://motionbgs.com/media/3961/tanjiro-thunder-breathing.1920x1080.mp4",
  Calm: "https://motionbgs.com/media/2404/house-on-island-spirited-away.1920x1080.mp4",
  Energetic: "https://motionbgs.com/media/5818/gear-5-technique.1920x1080.mp4",
};

export default function VideoBackground() {
  const pathname = usePathname();
  const { currentMood } = useMood();
  const [videoSrc, setVideoSrc] = useState("/celestial-veil.mp4");

  useEffect(() => {
    if (currentMood && MOOD_VIDEOS[currentMood as keyof typeof MOOD_VIDEOS]) {
      setVideoSrc(MOOD_VIDEOS[currentMood as keyof typeof MOOD_VIDEOS]);
    } else {
      setVideoSrc("/celestial-veil.mp4");
    }
  }, [currentMood]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <video
        key={videoSrc} // Force re-render/reload when src changes
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover opacity-80 mix-blend-screen transition-opacity duration-1000"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>


      
      {/* Overlays to ensure readability and "next-level" look */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      
      {/* Dynamic grain/noise effect for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
