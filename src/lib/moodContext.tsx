'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Mood = 'Happy' | 'Sad' | 'Angry' | 'Calm' | 'Energetic' | null;

interface MoodContextType {
  currentMood: Mood;
  setCurrentMood: (mood: Mood) => void;
  languagePreference: string[] | null;
  setLanguagePreference: (langs: string[]) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<Mood>(null);
  const [languagePreference, setLanguagePreferenceState] = useState<string[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moodify_languages');
    if (saved) {
      try {
        setLanguagePreferenceState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse language preferences', e);
      }
    }
  }, []);

  const setLanguagePreference = (langs: string[]) => {
    setLanguagePreferenceState(langs);
    localStorage.setItem('moodify_languages', JSON.stringify(langs));
  };

  return (
    <MoodContext.Provider value={{ 
      currentMood, 
      setCurrentMood, 
      languagePreference, 
      setLanguagePreference 
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
