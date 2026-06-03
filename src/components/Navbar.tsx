'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Recipes', href: '#recipes' },
  { label: 'Categories', href: '#categories' },
  { label: 'Upload', href: '#upload' },
  { label: 'Leaderboard', href: '#leaderboard' },
];

export default function Navbar() {
  const { user, appUser, signInWithGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // Active section detection
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md shadow-green-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 green-gradient rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🌿</span>
            </div>
            <span className="font-display font-bold text-xl text-[#2E7D32]">RecipeCloud</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === link.href.slice(1)
                    ? 'bg-[#E8F5E9] text-[#2E7D32] font-semibold'
                    : 'text-[#5C7A61] hover:text-[#2E7D32] hover:bg-[#F1F8F4]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-[#E8F5E9] rounded-full px-3 py-1.5 hover:bg-[#C8E6C9] transition-colors"
                >
                  {appUser?.avatarUrl || user.user_metadata?.avatar_url ? (
                    <Image 
                      src={appUser?.avatarUrl || user.user_metadata.avatar_url} 
                      alt={appUser?.name || user.user_metadata.full_name || ''} 
                      width={28} 
                      height={28} 
                      className="rounded-full w-7 h-7 object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#4CAF50] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {appUser?.name?.[0] || user.user_metadata?.full_name?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#2E7D32] max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0]}
                  </span>
                  <span className="text-xs text-[#8BC34A] font-semibold">⭐ {appUser?.points ?? 0}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#C8E6C9] overflow-hidden z-50">
                    <button
                      onClick={() => { scrollTo('#profile'); setDropOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-[#2E7D32] hover:bg-[#F1F8F4] transition-colors"
                    >
                      👤 My Profile
                    </button>
                    <button
                      onClick={() => { scrollTo('#upload'); setDropOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-[#2E7D32] hover:bg-[#F1F8F4] transition-colors"
                    >
                      📤 Upload Recipe
                    </button>
                    <hr className="border-[#E8F5E9]" />
                    <button
                      onClick={() => { logout(); setDropOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-[#4CAF50] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#2E7D32] transition-colors shadow-md shadow-green-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-[#2E7D32]"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round" />
                  <line x1="4" y1="16" x2="20" y2="16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8F5E9] px-4 py-4 shadow-lg">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left py-3 text-[#2E7D32] font-medium border-b border-[#F1F8F4] last:border-0"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3">
            {user ? (
              <button onClick={logout} className="text-red-500 text-sm font-medium">Sign Out</button>
            ) : (
              <button onClick={signInWithGoogle} className="w-full bg-[#4CAF50] text-white py-2.5 rounded-xl font-semibold">
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
