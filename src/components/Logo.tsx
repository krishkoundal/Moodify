import React from 'react';

export function Logo({ 
  className = "w-8 h-8", 
  showText = true, 
  textSize = "text-2xl",
  textColor = "text-white"
}: { 
  className?: string, 
  showText?: boolean,
  textSize?: string,
  textColor?: string
}) {
  return (
    <div className={`inline-flex items-center justify-center gap-3 ${className.includes('flex-col') ? 'flex-col' : ''}`}>
      {/* Container sizing based on className width/height, text is separate */}
      <div className={`${className.replace('flex-col', '').trim()} shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-bg" x1="0%" y1="100%" x2="100%" y2="0%">
              {/* Bottom left darker green, top right lighter green */}
              <stop offset="50%" stopColor="#4DEE00"/>
              <stop offset="50%" stopColor="#80FF29"/>
            </linearGradient>
          </defs>
          
          <rect width="100" height="100" rx="24" fill="url(#logo-bg)" />
          
          {/* Black Diamond at top left */}
          <rect x="22" y="16" width="10" height="10" rx="2" transform="rotate(45 27 21)" fill="#111" />
          
          {/* The thick blocky 'm' */}
          <path 
            d="M32 32 V70 M50 48 V70 M68 48 V70 M32 48 Q 41 32 50 48 M50 48 Q 59 32 68 48" 
            stroke="#111" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <span 
          style={{ fontFamily: "'Press Start 2P', system-ui, monospace", letterSpacing: "2px" }}
          className={`font-black uppercase tracking-widest ${textSize} ${textColor}`}
        >
          Moodify
        </span>
      )}
    </div>
  );
}
