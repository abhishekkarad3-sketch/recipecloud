'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Users, Star, TrendingUp } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailModal from '@/components/RecipeDetailModal';
import { Recipe, subscribeToRecipes } from '@/services/recipes';
import { useAuth } from '@/context/AuthContext';
import { AppUser } from '@/services/users';
import type { TabId } from '@/app/page';

const STATS = [
  { icon: Sparkles, label: 'recipes', value: '2.4k+', color: 'text-[#4CAF50]' },
  { icon: Users, label: 'points', value: '890+', color: 'text-[#8BC34A]' },
  { icon: Star, label: 'Avg Rating', value: '4.8', color: 'text-amber-500' },
  { icon: TrendingUp, label: 'This Week', value: '+124', color: 'text-[#2E7D32]' },
];

interface Props { setTab: (t: TabId) => void; onViewUser?: (user: AppUser) => void; }

export default function HomeTab({ setTab, onViewUser }: Props) {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const unsub = subscribeToRecipes(data => {
      setRecipes(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const featured = recipes.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* HERO */}
      <section className="relative overflow-hidden 
        bg-white dark:bg-[#1B2A1F] 
        rounded-[2rem] 
        border border-[#E8F5E9] dark:border-[#2E7D32] 
        shadow-xl shadow-green-900/5 anim-up">

        {/* 🌿 FLOATING EMOJIS BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🥑','🍅','🥦','🌽','🫐','🍋'].map((e, i) => (
            <span
              key={i}
              className="absolute text-4xl opacity-10 dark:opacity-5 anim-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="relative px-8 py-16 sm:py-24 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F8F4] dark:bg-[#2E3D2F] border border-[#C8E6C9] dark:border-[#4CAF50]/30 text-[#2E7D32] dark:text-[#A5D6A7] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} />
            {t('tagline')}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black 
            text-[#1B3A1F] dark:text-[#E0F2E9] mb-6 leading-tight">
            {t('appName')}
          </h1>

          <p className="text-lg sm:text-xl text-[#5C7A61] dark:text-[#9DB5A3] mb-10 max-w-xl mx-auto">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setTab('search')}
              className="green-gradient text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/20 hover:scale-105 transition-transform">
              {t('getStarted')} <ArrowRight size={18} />
            </button>

            {!user ? (
              <button
                onClick={signInWithGoogle}
                className="bg-white dark:bg-[#243526] 
                border-2 border-[#E8F5E9] dark:border-[#2E7D32]
                text-[#2E7D32] dark:text-[#A5D6A7] 
                px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {t('joinFree')}
              </button>
            ) : (
              <button
                onClick={() => setTab('upload')}
                className="bg-white dark:bg-[#243526] 
                border-2 border-[#E8F5E9] dark:border-[#2E7D32]
                text-[#2E7D32] dark:text-[#A5D6A7] 
                px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {t('uploadRecipe')}
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t 
          border-[#E8F5E9] dark:border-[#2E7D32] bg-gray-50/50 dark:bg-black/10">

          {STATS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center py-6 
              border-r border-[#E8F5E9] dark:border-[#2E7D32] last:border-0">

              <div className="flex justify-center mb-1">
                <Icon size={20} className={color} />
              </div>
              <div className={`text-xl font-black ${color}`}>{value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#5C7A61] dark:text-[#9DB5A3] opacity-60">
                {t(label)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="anim-up d-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-[#1B3A1F] dark:text-[#E0F2E9]">
            {t('featuredRecipes')}
          </h2>
          <button onClick={() => setTab('search')} className="text-[#2E7D32] dark:text-[#A5D6A7] font-bold flex items-center gap-1 hover:underline">
            {t('viewAll')} <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-3xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 
            bg-white dark:bg-[#1B2A1F] 
            border-2 border-dashed border-[#E8F5E9] dark:border-[#2E7D32] 
            rounded-[2rem]">

            <div className="text-5xl mb-4">🍳</div>
            <p className="text-lg font-medium text-[#5C7A61] dark:text-[#9DB5A3]">
              {t('noRecipes')}
            </p>

            <button
              onClick={() => setTab('upload')}
              className="mt-6 green-gradient text-white px-8 py-3 rounded-xl font-bold">
              {t('uploadRecipe')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(r => (
              <RecipeCard key={r.id} recipe={r} onViewDetails={setSelectedRecipe} onViewUser={onViewUser} />
            ))}
          </div>
        )}
      </section>

      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}

      {/* CATEGORIES */}
      <section className="anim-up d-2">
        <h2 className="text-3xl font-black text-[#1B3A1F] dark:text-[#E0F2E9] mb-8">
          {t('browseCategories')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {[
            { e: '🍳', l: 'Breakfast' },
            { e: '🥗', l: 'Salads' },
            { e: '🍰', l: 'Desserts' },
            { e: '🍔', l: 'Fast Food' },
            { e: '🍕', l: 'Italian' },
            { e: '🍜', l: 'Asian' },
            { e: '🥙', l: 'Healthy' },
            { e: '🍩', l: 'Snacks' }
          ].map((c, i) => (
            <button key={i}
              className="bg-white dark:bg-[#243526] 
              border border-[#E8F5E9] dark:border-[#2E7D32] 
              rounded-2xl p-6 flex flex-col items-center gap-3
              hover:border-[#4CAF50] hover:shadow-lg hover:shadow-green-900/10 transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">{c.e}</span>
              <span className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3]">{c.l}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="green-gradient text-white p-12 rounded-[2rem] text-center shadow-xl shadow-green-900/20 anim-up d-3">
          <h2 className="text-3xl font-black mb-4">{t('joinCommunity')}</h2>
          <p className="mb-8 opacity-90 max-w-md mx-auto">{t('joinDesc')}</p>
          <button
            onClick={signInWithGoogle}
            className="bg-white text-[#2E7D32] px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
            {t('signIn')}
          </button>
        </section>
      )}

    </div>
  );
}
