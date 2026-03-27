'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, User, LogOut, Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/soultrack', label: 'SoulTrack™', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <Logo className="w-10 h-10" showText={true} textSize="text-xl" />
        <div className="hidden sm:block -ml-2">
          <p className="text-[10px] text-white/40 tracking-wider uppercase mt-4">Understand your flow</p>
        </div>
      </Link>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : ''}`} />
                <span className="text-sm font-semibold">{label}</span>
                {label === 'SoulTrack™' && (
                  <span className="ml-1 text-[8px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full font-black">
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Right Side: User & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {/* User profile section */}
        <div className="hidden sm:flex items-center gap-3 bg-white/5 pl-2 pr-1 py-1 rounded-2xl border border-white/5 pr-3">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-8 h-8 rounded-full border border-purple-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
              <User className="w-4 h-4 text-white/40" />
            </div>
          )}
          <div className="hidden lg:block min-w-[60px]">
            <p className="text-xs font-bold text-white truncate">{session?.user?.name || 'User'}</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 transition-all group"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl z-50 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link 
                    key={href} 
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive ? 'bg-purple-600/20 text-white border border-purple-500/20' : 'text-white/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-purple-400' : ''}`} />
                    <span className="text-lg font-bold">{label}</span>
                  </Link>
                );
              })}
              <div className="mt-4 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/20">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-bold text-white">{session?.user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
