'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getRecipesByAuthor, deleteRecipe, Recipe, avgRating } from '@/services/recipes';

export default function ProfileSection() {
  const { user, appUser, refreshUser, signInWithGoogle } = useAuth();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<'recipes' | 'favorites'>('recipes');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getRecipesByAuthor(user.uid).then((data) => {
      setMyRecipes(data);
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Delete this recipe?')) return;
    await deleteRecipe(recipeId);
    setMyRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  if (!user || !appUser) {
    return (
      <section id="profile" className="py-20 leaf-bg">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="font-display text-4xl font-bold text-[#1B3A1F] mb-4">Your Profile</h2>
          <p className="text-[#5C7A61] mb-8">Sign in to see your profile, recipes, and favorites.</p>
          <button
            onClick={signInWithGoogle}
            className="green-gradient text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  const favCount = appUser.favorites?.length ?? 0;

  return (
    <section id="profile" className="py-20 leaf-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-[#4CAF50] tracking-wide uppercase">Your Space</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1B3A1F] mt-2">My Profile</h2>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8F5E9] mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || ''}
                  width={80}
                  height={80}
                  className="rounded-full ring-4 ring-[#A5D6A7]"
                />
              ) : (
                <div className="w-20 h-20 green-gradient rounded-full flex items-center justify-center text-3xl text-white font-bold ring-4 ring-[#A5D6A7]">
                  {appUser.name?.[0] || 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#4CAF50] rounded-full flex items-center justify-center text-sm border-2 border-white">
                ✓
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-[#1B3A1F]">{appUser.name}</h3>
              <p className="text-[#5C7A61] text-sm">{appUser.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Recipes', value: myRecipes.length, icon: '🍳' },
              { label: 'Points', value: appUser.points, icon: '⭐' },
              { label: 'Favorites', value: favCount, icon: '❤️' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#F1F8F4] rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display text-2xl font-bold text-[#2E7D32]">{stat.value}</div>
                <div className="text-xs text-[#5C7A61]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border border-[#E8F5E9] rounded-2xl overflow-hidden mb-6 shadow-sm">
          {(['recipes', 'favorites'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === t ? 'bg-[#4CAF50] text-white' : 'text-[#5C7A61] hover:bg-[#F1F8F4]'
              }`}
            >
              {t === 'recipes' ? `🍳 My Recipes (${myRecipes.length})` : `❤️ Favorites (${favCount})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="bg-[#F1F8F4] rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : tab === 'recipes' ? (
          myRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E8F5E9]">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="text-[#5C7A61]">No recipes yet. Upload your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl px-5 py-4 border border-[#E8F5E9] flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-[#1B3A1F]">{recipe.name}</div>
                    <div className="text-xs text-[#5C7A61] mt-0.5 flex gap-3">
                      <span>{recipe.category}</span>
                      <span>⏱ {recipe.cookingTime}m</span>
                      <span>⭐ {avgRating(recipe) || '—'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(recipe.id!)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          favCount === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E8F5E9]">
              <div className="text-5xl mb-3">💚</div>
              <p className="text-[#5C7A61]">No favorites yet. Heart recipes you love!</p>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-3xl border border-[#E8F5E9]">
              <div className="text-4xl mb-3">❤️</div>
              <p className="text-[#5C7A61]">{favCount} recipe{favCount !== 1 ? 's' : ''} saved to favorites</p>
              <p className="text-xs text-[#5C7A61] mt-1">Browse recipes to manage your favorites</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
