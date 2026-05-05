'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChefHat, Trash2, Star, Clock, Heart, Trophy, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { getRecipesByAuthor, deleteRecipe, Recipe, avgRating } from '@/services/recipes';
import NutritionPanel from '@/components/NutritionPanel';

type Tab = 'recipes' | 'favorites';

export default function ProfileTab() {
  const { user, appUser, refreshUser, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<Tab>('recipes');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getRecipesByAuthor(user.id).then(data => { setMyRecipes(data); setLoading(false); });
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this recipe?')) return;
    await deleteRecipe(id);
    setMyRecipes(prev => prev.filter(r => r.id !== id));
  };

  if (!user || !appUser) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-[#E8F5E9] rounded-3xl flex items-center justify-center mx-auto mb-5">
        <ChefHat size={36} className="text-[#4CAF50]" />
      </div>
      <h2 className="font-display text-3xl font-bold text-[#1B3A1F] mb-3">{t('myProfile')}</h2>
      <p className="text-[#5C7A61] mb-7 text-sm">Sign in to see your profile, recipes and favorites.</p>
      <button onClick={signInWithGoogle} className="green-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
        {t('signInGoogle')}
      </button>
    </div>
  );

  const favCount = appUser.favorites?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h2 className="font-display text-3xl font-bold text-[#1B3A1F]">{t('myProfile')}</h2>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E8F5E9] shadow-sm overflow-hidden">
        {/* Green banner */}
        <div className="green-gradient h-20 relative">
          <div className="absolute -bottom-8 left-6">
            {user.user_metadata?.avatar_url ? (
              <Image src={user.user_metadata.avatar_url} alt="" width={64} height={64}
                className="rounded-2xl ring-4 ring-white shadow-lg" unoptimized />
            ) : (
              <div className="w-16 h-16 green-gradient rounded-2xl ring-4 ring-white flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {appUser.name?.[0]||'U'}
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 pb-6 px-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1B3A1F]">{appUser.name}</h3>
              <p className="text-sm text-[#5C7A61]">{appUser.email}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Trophy size={14} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{appUser.points} pts</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: BookOpen, label: t('recipes'),   val: myRecipes.length, color: 'text-[#4CAF50]', bg: 'bg-[#E8F5E9]' },
              { icon: Trophy,   label: t('points'),    val: appUser.points,   color: 'text-amber-500',  bg: 'bg-amber-50'  },
              { icon: Heart,    label: t('favorites'), val: favCount,          color: 'text-red-400',    bg: 'bg-red-50'    },
            ].map(({ icon: Icon, label, val, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 text-center border border-white`}>
                <Icon size={18} className={`${color} mx-auto mb-1`} />
                <div className={`font-display text-2xl font-black ${color}`}>{val}</div>
                <div className="text-xs text-[#5C7A61] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-[#E8F5E9] rounded-2xl overflow-hidden shadow-sm">
        {([['recipes', BookOpen, `${t('myRecipes')} (${myRecipes.length})`],
           ['favorites', Heart, `${t('favorites')} (${favCount})`]] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              tab === id ? 'bg-[#4CAF50] text-white' : 'text-[#5C7A61] hover:bg-[#F1F8F4]'
            }`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'recipes' && (
        loading ? (
          <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-20 rounded-2xl"/>)}</div>
        ) : myRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8F5E9]">
            <ChefHat size={40} className="text-[#A5D6A7] mx-auto mb-3"/>
            <p className="text-[#5C7A61] text-sm">{t('noRecipes')}. Upload your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-2xl border border-[#E8F5E9] shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E8F5E9] shrink-0">
                    {recipe.imageUrl ? (
                      <Image src={recipe.imageUrl} alt={recipe.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ChefHat size={22} className="text-[#A5D6A7]"/></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1B3A1F] truncate">{recipe.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#5C7A61]">
                      <span className="flex items-center gap-1"><Clock size={10}/>{recipe.cookingTime}m</span>
                      <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-medium">{recipe.category}</span>
                      <span className="flex items-center gap-1"><Star size={10} className="text-amber-400"/>{avgRating(recipe)||'—'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {recipe.nutrition && (
                      <button onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id!)}
                        className="text-xs font-semibold text-[#4CAF50] bg-[#E8F5E9] px-3 py-1.5 rounded-lg hover:bg-[#C8E6C9] transition-colors">
                        🧪 Nutrition
                      </button>
                    )}
                    <button onClick={() => handleDelete(recipe.id!)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>
                {expanded === recipe.id && recipe.nutrition && (
                  <div className="px-5 pb-5 anim-scale">
                    <NutritionPanel data={recipe.nutrition} perServing />
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'favorites' && (
        favCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8F5E9]">
            <Heart size={40} className="text-[#A5D6A7] mx-auto mb-3"/>
            <p className="text-[#5C7A61] text-sm">No favorites yet. Heart recipes you love!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F5E9] p-6 text-center">
            <Heart size={32} className="text-red-400 mx-auto mb-2"/>
            <p className="font-semibold text-[#1B3A1F]">{favCount} favorited recipe{favCount!==1?'s':''}</p>
            <p className="text-xs text-[#5C7A61] mt-1">Find them in the Search tab.</p>
          </div>
        )
      )}
    </div>
  );
}
