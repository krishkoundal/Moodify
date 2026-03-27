'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useMood } from '@/lib/moodContext';

const languages = [
  { id: 'Hindi', name: 'Hindi', native: 'हिन्दी', icon: '🇮🇳' },
  { id: 'English', name: 'English', native: 'English', icon: '🇺🇸' },
  { id: 'Punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', icon: '🌾' },
  { id: 'Tamil', name: 'Tamil', native: 'தமிழ்', icon: '🛕' },
  { id: 'Telugu', name: 'Telugu', native: 'తెలుగు', icon: '🕌' },
  { id: 'Kannada', name: 'Kannada', native: 'ಕನ್ನಡ', icon: '🏖️' },
  { id: 'Malayalam', name: 'Malayalam', native: 'മലയാളം', icon: '🌴' },
  { id: 'Bengali', name: 'Bengali', native: 'বাংলা', icon: '🐯' },
  { id: 'Marathi', name: 'Marathi', native: 'मराठी', icon: '🚩' },
  { id: 'Gujarati', name: 'Gujarati', native: 'ગુજરાતી', icon: '💎' },
  { id: 'Urdu', name: 'Urdu', native: 'اردو', icon: '🌙' },
  { id: 'Bhojpuri', name: 'Bhojpuri', native: 'भोजपुरी', icon: '🎭' },
  { id: 'Haryanvi', name: 'Haryanvi', native: 'हरियाणवी', icon: '🚜' },
  { id: 'Korean', name: 'Korean', native: '한국어', icon: '🇰🇷' },
  { id: 'Japanese', name: 'Japanese', native: '日本語', icon: '🇯🇵' },
  { id: 'Spanish', name: 'Spanish', native: 'Español', icon: '🇪🇸' },
  { id: 'French', name: 'French', native: 'Français', icon: '🇫🇷' },
];

export default function LanguagePreferenceOverlay() {
  const { languagePreference, setLanguagePreference } = useMood();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already set, don't show
  if (languagePreference !== null) return null;

  const toggleLanguage = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selected.length === 0) return;
    setIsSubmitting(true);
    // Add a slight delay for "premium" feel
    setTimeout(() => {
      setLanguagePreference(selected);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-strong rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        <div className="flex flex-col items-center text-center space-y-6 overflow-hidden">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="relative shrink-0"
          >
            <Logo className="w-16 h-16" showText={false} />
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-bounce" />
          </motion.div>

          <div className="space-y-1 shrink-0">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vibe</span>
            </h2>
            <p className="text-white/40 text-xs md:text-sm max-w-xs mx-auto">
              Select languages to personalize your emotional journey.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full pt-4 overflow-y-auto pr-2 custom-scrollbar max-h-[40vh] md:max-h-[50vh]">
            {languages.map((lang, idx) => {
              const isActive = selected.includes(lang.id);
              return (
                <motion.button
                  key={lang.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleLanguage(lang.id)}
                  className={`relative flex flex-col items-center p-4 rounded-[1.2rem] transition-all duration-500 border group ${
                    isActive 
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-neon-purple' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{lang.icon}</div>
                  <span className="text-xs font-bold text-white truncate w-full">{lang.name}</span>
                  <span className="text-[9px] text-white/40">{lang.native}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="check"
                      className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="w-full pt-4 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={selected.length === 0 || isSubmitting}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 ${
                selected.length > 0 
                  ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Get Started</span>
                </>
              )}
            </motion.button>
            <p className="mt-4 text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
              You can change this anytime in settings
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
