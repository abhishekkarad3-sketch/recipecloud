'use client';
import React, { useState } from 'react';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import HomeTab from '@/components/tabs/HomeTab';
import SearchTab from '@/components/tabs/SearchTab';
import UploadTab from '@/components/tabs/UploadTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import LeaderboardTab from '@/components/tabs/LeaderboardTab';

export type TabId = 'home' | 'search' | 'upload' | 'profile' | 'leaderboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home':        return <HomeTab setTab={setActiveTab} />;
      case 'search':      return <SearchTab />;
      case 'upload':      return <UploadTab />;
      case 'profile':     return <ProfileTab />;
      case 'leaderboard': return <LeaderboardTab />;
      default:            return <HomeTab setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen 
  bg-[#F1F8F4] dark:bg-[#121A14] 
  text-black dark:text-[#E0F2E9] 
  flex flex-col">
      <TopNav activeTab={activeTab} setTab={setActiveTab} />
      <main className="flex-1 pb-20 md:pb-0">
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}
