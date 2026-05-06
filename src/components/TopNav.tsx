'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Cloud, CheckCircle, LogOut, ChevronDown, Globe,
  Moon, Sun
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useLang, LANGUAGES } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import AuthModal from '@/components/AuthModal';
import type { TabId } from '@/app/page';

const TABS: { id: TabId; key: string }[] = [
  { id: 'home', key: 'home' },
  { id: 'search', key: 'search' },
  { id: 'upload', key: 'upload' },
  { id: 'profile', key: 'profile' },
  { id: 'leaderboard', key: 'leaderboard' },
];

interface Props {
  activeTab: TabId;
  setTab: (t: TabId) => void;
}

export default function TopNav({ activeTab, setTab }: Props) {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();

  const [langDrop, setLangDrop] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 
        bg-white/80 dark:bg-[#1B2A1F]/80 backdrop-blur-md
        border-b border-[#E8F5E9] dark:border-[#2E7D32] 
        shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <button onClick={() => setTab('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 green-gradient rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <span className="text-white text-xl">🌿</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#2E7D32] dark:text-[#A5D6A7]">
                {t('appName')}
              </span>
            </button>

            {/* Tabs */}
            <nav className="hidden md:flex gap-1 flex-1 ml-4">
              {TABS.map(({ id, key }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-[#E8F5E9] dark:bg-[#2E7D32]/30 text-[#2E7D32] dark:text-[#A5D6A7]'
                      : 'text-[#5C7A61] dark:text-[#9DB5A3] hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {t(key)}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* Cloud Sync */}
              <div className="hidden lg:flex items-center gap-2 
                bg-[#F1F8F4] dark:bg-[#2E3D2F] 
                border border-[#C8E6C9] dark:border-[#4CAF50]/30
                px-3 py-1.5 rounded-full">
                <Cloud size={14} className="text-[#4CAF50]" />
                <span className="text-xs font-medium text-[#2E7D32] dark:text-[#A5D6A7]">
                  {t('cloudSync')}
                </span>
                <CheckCircle size={14} className="text-[#4CAF50]" />
              </div>

              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangDrop(!langDrop)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                    bg-[#F1F8F4] dark:bg-[#2E3D2F] 
                    border border-[#C8E6C9] dark:border-[#4CAF50]/30
                    text-[#2E7D32] dark:text-[#A5D6A7] hover:bg-[#E8F5E9] dark:hover:bg-[#384d3a] transition-colors"
                >
                  <Globe size={16} />
                  <span className="text-sm font-medium uppercase">{lang}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${langDrop ? 'rotate-180' : ''}`} />
                </button>

                {langDrop && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1B2A1F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-xl shadow-xl py-2 anim-scale z-50">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangDrop(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          lang === l.code
                            ? 'bg-[#F1F8F4] dark:bg-[#2E7D32]/30 text-[#2E7D32] dark:text-[#A5D6A7] font-bold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span>{l.label}</span>
                        {lang === l.code && <CheckCircle size={14} className="ml-auto text-[#4CAF50]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggle}
                className="w-10 h-10 flex items-center justify-center 
                  bg-[#F1F8F4] dark:bg-[#2E3D2F] 
                  border border-[#C8E6C9] dark:border-[#4CAF50]/30
                  rounded-xl hover:bg-[#E8F5E9] dark:hover:bg-[#384d3a] transition-colors text-[#2E7D32] dark:text-[#A5D6A7]">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Auth */}
              <div className="h-8 w-[1px] bg-[#E8F5E9] dark:bg-[#2E7D32] mx-1 hidden sm:block" />
              
              {user ? (
                <div className="flex items-center gap-3 pl-1">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-[#2E7D32] dark:text-[#A5D6A7] leading-none">
                      {user.user_metadata?.full_name}
                    </span>
                    <span className="text-[10px] text-[#5C7A61] dark:text-[#9DB5A3] mt-1">
                      Chef Member
                    </span>
                  </div>
                  {user.user_metadata?.avatar_url && (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[#4CAF50] p-0.5"
                    />
                  )}
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('signOut')}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="green-gradient text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-green-900/20 hover:opacity-90 transition-opacity"
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
