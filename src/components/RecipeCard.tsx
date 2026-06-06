'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Clock, Star, Heart, ChefHat, Flame, User, Bookmark } from 'lucide-react';
import { Recipe, avgRating, rateRecipe } from '@/services/recipes';
import { toggleFavorite, toggleBookmark, getUser, AppUser } from '@/services/users';
// import UserProfileModal from '@/components/UserProfileModal';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

interface Props { recipe: Recipe; size?: 'sm' | 'md'; onViewDetails?: (recipe: Recipe) => void; onViewUser?: (user: AppUser) => void; }

const DIFF: Record<string, string> = {
  Easy:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Medium: 'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400',
  Hard:   'bg-red-100     text-red-600     dark:bg-red-900/30     dark:text-red-400',
};

export default function RecipeCard({ recipe, size = 'md', onViewDetails, onViewUser }: Props) {
  const { user, appUser, refreshUser } = useAuth();
  const { t } = useLang();
  const [showStars, setShowStars] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [justRated, setJustRated] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AppUser | null>(null);

  const isFav   = appUser?.favorites?.includes(recipe.id!) ?? false;
  const isBookmarked = appUser?.bookmarks?.includes(recipe.id!) ?? false;
  const hasRated = user ? recipe.usersWhoRated?.includes(user.id) ?? false : false;
  const avg      = avgRating(recipe);
  const imgH     = size === 'sm' ? 'h-40' : 'h-52';

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await toggleFavorite(user.id, recipe.id!, isFav);
    await refreshUser();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await toggleBookmark(user.id, recipe.id!, isBookmarked);
    await refreshUser();
  };

  const handleRate = async (stars: number) => {
    if (!user || hasRated || justRated) return;
    await rateRecipe(
      recipe.id!, 
      user.id, 
      stars, 
      '', 
      appUser?.name, 
      appUser?.avatarUrl || user.user_metadata?.avatar_url
    );
    setJustRated(true);
    setShowStars(false);
  };

  const handleViewAuthor = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const author = await getUser(recipe.authorId);
    if (author) {
      if (onViewUser) {
        onViewUser(author);
      } else {
        setSelectedAuthor(author);
      }
    }
  };

  return (
    <div 
      onClick={() => onViewDetails?.(recipe)}
      className="recipe-card bg-white dark:bg-[#1B2A1F] rounded-3xl overflow-hidden border border-[#E8F5E9] dark:border-[#2E7D32] shadow-sm group hover:shadow-xl hover:shadow-green-900/5 transition-all cursor-pointer"
    >
      {/* Image */}
      <div className={`relative ${imgH} bg-[#F1F8F4] dark:bg-[#2E3D2F] overflow-hidden`}>
        {recipe.imageUrl ? (
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
            unoptimized 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ChefHat size={48} className="text-[#A5D6A7] opacity-50" />
            <span className="text-[10px] font-bold text-[#A5D6A7] uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Fav and Bookmark */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button 
            onClick={handleBookmark} 
            className="w-9 h-9 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Bookmark recipe"
          >
            <Bookmark 
              size={18} 
              className={isBookmarked ? 'fill-amber-500 stroke-amber-500' : 'stroke-gray-600 dark:stroke-white/70'} 
            />
          </button>
          <button 
            onClick={handleFav} 
            className="w-9 h-9 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Add to favorites"
          >
            <Heart 
              size={18} 
              className={isFav ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600 dark:stroke-white/70'} 
            />
          </button>
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3 bg-[#2E7D32] text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider">
          {recipe.category}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[#1B3A1F] dark:text-[#E0F2E9] text-lg leading-tight line-clamp-1 group-hover:text-[#2E7D32] dark:group-hover:text-[#A5D6A7] transition-colors">
              {recipe.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${DIFF[recipe.difficulty] || DIFF.Medium}`}>
              {recipe.difficulty}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-wider">
              <Clock size={12} className="text-[#4CAF50]" />
              {recipe.cookingTime} {t('minRead')}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-white/5">
          <button 
            onClick={handleViewAuthor}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full bg-[#E8F5E9] dark:bg-[#2E7D32] flex items-center justify-center text-[10px] font-bold text-[#2E7D32] dark:text-[#A5D6A7]">
              {recipe.authorName[0]}
            </div>
            <span className="text-xs font-medium text-[#5C7A61] dark:text-[#9DB5A3] flex items-center gap-1">
              {recipe.authorName.split(' ')[0]}
              <User size={10} className="text-[#4CAF50]" />
            </span>
          </button>
          
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
            <Star size={12} className="fill-amber-400 stroke-amber-400" />
            <span className="font-bold text-xs text-amber-700 dark:text-amber-400">
              {avg > 0 ? avg.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        {/* Rate button */}
        {user && !hasRated && !justRated && (
          <div className="pt-1">
            {!showStars ? (
              <button 
                onClick={() => setShowStars(true)} 
                className="w-full text-xs text-[#2E7D32] dark:text-[#A5D6A7] font-bold py-2 bg-[#F1F8F4] dark:bg-[#2E3D2F] hover:bg-[#E8F5E9] dark:hover:bg-[#384d3a] rounded-xl transition-all border border-[#C8E6C9] dark:border-[#4CAF50]/30"
              >
                + {t('submit')}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-1 bg-[#F1F8F4] dark:bg-[#2E3D2F] rounded-xl border border-[#C8E6C9] dark:border-[#4CAF50]/30 anim-scale">
                {[1,2,3,4,5].map(s => (
                  <button key={s}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => handleRate(s)}
                    className="transition-transform hover:scale-125 p-1"
                  >
                    <Star 
                      size={20} 
                      className={s <= (hoverStar || 0) ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300 dark:stroke-gray-600'} 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {(hasRated || justRated) && (
          <div className="text-center py-2 bg-[#F1F8F4] dark:bg-[#2E3D2F] rounded-xl text-xs text-[#4CAF50] font-bold uppercase tracking-widest border border-[#C8E6C9] dark:border-[#4CAF50]/30">
            ✓ {t('addedPoints')}
          </div>
        )}
      </div>
      {/* {selectedAuthor && (
        <UserProfileModal user={selectedAuthor} onClose={() => setSelectedAuthor(null)} />
      )} */}
    </div>
  );
}
