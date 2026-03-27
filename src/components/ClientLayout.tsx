'use client';

import { PlayerProvider } from '@/lib/playerContext';
import Navbar from '@/components/Navbar';
import NowPlayingBar from '@/components/NowPlayingBar';
import VideoBackground from '@/components/VideoBackground';
import LanguagePreferenceOverlay from '@/components/LanguagePreferenceOverlay';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="h-screen flex flex-col overflow-hidden relative bg-black">
        {/* Live Wallpaper Background */}
        <VideoBackground />
        
        {/* Language Selection Overlay */}
        <LanguagePreferenceOverlay />

        {/* Navbar */}
        <Navbar />


        {/* Main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pt-20 pb-32 md:pb-24 mt-4">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>


        {/* Now playing bar */}
        <NowPlayingBar />
      </div>
    </PlayerProvider>
  );
}
