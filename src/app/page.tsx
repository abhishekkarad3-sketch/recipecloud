'use client';
import React, { useState } from 'react';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import HomeTab from '@/components/tabs/HomeTab';
import SearchTab from '@/components/tabs/SearchTab';
import UploadTab from '@/components/tabs/UploadTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import LeaderboardTab from '@/components/tabs/LeaderboardTab';
import UserProfileTab from '@/components/tabs/UserProfileTab';
import { AppUser } from '@/services/users';

export type TabId = 'home' | 'search' | 'upload' | 'profile' | 'leaderboard' | 'user-profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [previousTab, setPreviousTab] = useState<TabId>('home');

  const handleViewUser = (user: AppUser) => {
    setPreviousTab(activeTab);
    setSelectedUser(user);
    setActiveTab('user-profile');
  };

  const handleBackFromProfile = () => {
    setActiveTab(previousTab);
    setSelectedUser(null);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':        return <HomeTab setTab={setActiveTab} onViewUser={handleViewUser} />;
      case 'search':      return <SearchTab onViewUser={handleViewUser} />;
      case 'upload':      return <UploadTab />;
      case 'profile':     return <ProfileTab />;
      case 'leaderboard': return <LeaderboardTab />;
      case 'user-profile': return selectedUser ? <UserProfileTab user={selectedUser} onBack={handleBackFromProfile} /> : <HomeTab setTab={setActiveTab} />;
      default:            return <HomeTab setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen 
  bg-[#F1F8F4] dark:bg-[#121A14] 
  text-black dark:text-[#E0F2E9] 
  flex flex-col">
      <TopNav activeTab={activeTab === 'user-profile' ? previousTab : activeTab} setTab={setActiveTab} />
      <main className="flex-1 pb-20 md:pb-0">
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab === 'user-profile' ? previousTab : activeTab} setTab={setActiveTab} />
    </div>
  );
}
