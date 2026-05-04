'use client';
import React from 'react';
import { Home, Search, Upload, User, Trophy } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { TabId } from '@/app/page';

const ITEMS: { id: TabId; key: string; Icon: React.ElementType }[] = [
  { id: 'home',        key: 'home',        Icon: Home   },
  { id: 'search',      key: 'search',      Icon: Search },
  { id: 'upload',      key: 'upload',      Icon: Upload },
  { id: 'profile',     key: 'profile',     Icon: User   },
  { id: 'leaderboard', key: 'leaderboard', Icon: Trophy },
];

interface Props { activeTab: TabId; setTab: (t: TabId) => void; }

export default function BottomNav({ activeTab, setTab }: Props) {
  const { t } = useLang();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8F5E9] shadow-[0_-4px_20px_rgba(46,125,50,0.08)]">
      <div className="flex safe-bottom">
        {ITEMS.map(({ id, key, Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative">
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${active ? 'bg-[#E8F5E9] scale-110' : ''}`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-[#2E7D32]' : 'text-[#9CA3AF]'}/>
              </div>
              <span className={`text-[9px] font-semibold ${active ? 'text-[#2E7D32]' : 'text-[#9CA3AF]'}`}>
                {t(key)}
              </span>
              {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#4CAF50] rounded-full"/>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
