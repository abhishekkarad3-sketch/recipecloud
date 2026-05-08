'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { X, Clock, Star, Heart, ChefHat, Flame, Leaf, AlertCircle, MessageSquare, Send, User } from 'lucide-react';
import { Recipe, avgRating, rateRecipe } from '@/services/recipes';
import { toggleFavorite, getUser, AppUser } from '@/services/users';
import UserProfileModal from '@/components/UserProfileModal';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

const DIFF: Record<string, string> = {
  Easy:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Medium: 'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400',
  Hard:   'bg-red-100     text-red-600     dark:bg-red-900/30     dark:text-red-400',
};

const DIETARY_ICONS: Record<string, string> = {
  veg: '🥬',
  'non-veg': '🍗',
  vegan: '🌱',
};

export default function RecipeDetailModal({ recipe, onClose }: Props) {
  const { user, appUser, refreshUser } = useAuth();
  const { t } = useLang();
  const [showStars, setShowStars] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [justRated, setJustRated] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AppUser | null>(null);

  const isFav = appUser?.favorites?.includes(recipe.id!) ?? false;
  const userRating = recipe.comments?.find(c => c.userId === user?.id);
  const hasRated = !!userRating;
  const avg = avgRating(recipe);
  const dietaryType = (recipe as any).dietaryType || 'veg';

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await toggleFavorite(user.id, recipe.id!, isFav);
    await refreshUser();
  };

  const handleRate = async (stars: number) => {
    if (!user || isSubmittingRating) return;
    setIsSubmittingRating(true);
    try {
      await rateRecipe(
        recipe.id!, 
        user.id, 
        stars, 
        commentText, 
        appUser?.name, 
        appUser?.avatarUrl || user.user_metadata?.avatar_url
      );
      setJustRated(true);
      setShowStars(false);
      setCommentText('');
      // In a real app, we'd refresh the recipe data here
    } catch (error) {
      console.error('Error rating recipe:', error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleViewAuthor = async () => {
    const author = await getUser(recipe.authorId);
    if (author) {
      setSelectedAuthor(author);
    }
  };

  const startEditingRating = () => {
    if (userRating) {
      setCommentText(userRating.text);
      setHoverStar(userRating.rating);
      setShowStars(true);
      setJustRated(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1B2A1F] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header with image and close button */}
        <div className="relative h-80 bg-[#F1F8F4] dark:bg-[#2E3D2F] overflow-hidden">
          {recipe.imageUrl ? (
            <Image 
              src={recipe.imageUrl} 
              alt={recipe.name} 
              fill 
              className="object-cover" 
              unoptimized 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ChefHat size={64} className="text-[#A5D6A7] opacity-50" />
              <span className="text-sm font-bold text-[#A5D6A7] uppercase tracking-widest">No Image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
          >
            <X size={20} className="text-[#1B3A1F] dark:text-white" />
          </button>

          {/* Favorite button */}
          <button 
            onClick={handleFav}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Heart 
              size={20} 
              className={isFav ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600 dark:stroke-white/70'} 
            />
          </button>

          {/* Category and dietary badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-[#2E7D32] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
              {recipe.category}
            </div>
            {dietaryType && (
              <div className="bg-[#4CAF50] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1">
                <span>{DIETARY_ICONS[dietaryType] || '🥬'}</span>
                {dietaryType === 'non-veg' ? 'Non-Veg' : dietaryType.charAt(0).toUpperCase() + dietaryType.slice(1)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Title and meta */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-[#1B3A1F] dark:text-[#E0F2E9]">
              {recipe.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className={`text-sm px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider ${DIFF[recipe.difficulty] || DIFF.Medium}`}>
                {recipe.difficulty}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-wider">
                <Clock size={16} className="text-[#4CAF50]" />
                {recipe.cookingTime} min
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                <Star size={16} className="fill-amber-400 stroke-amber-400" />
                <span className="font-bold text-sm text-amber-700 dark:text-amber-400">
                  {avg > 0 ? avg.toFixed(1) : '—'} ({recipe.ratingCount} {recipe.ratingCount === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
            </div>

            {/* Author */}
            <button 
              onClick={handleViewAuthor}
              className="flex items-center gap-3 pt-2 border-t border-[#E8F5E9] dark:border-[#2E7D32] w-full text-left hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] dark:bg-[#2E7D32] flex items-center justify-center text-xs font-bold text-[#2E7D32] dark:text-[#A5D6A7]">
                {recipe.authorName[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1B3A1F] dark:text-[#E0F2E9] flex items-center gap-1">
                  {recipe.authorName}
                  <User size={12} className="text-[#4CAF50]" />
                </p>
                <p className="text-xs text-[#5C7A61] dark:text-[#9DB5A3]">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                  {recipe.updatedAt && (
                    <span className="ml-2 italic opacity-75">
                      (Updated: {new Date(recipe.updatedAt).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#4CAF50] uppercase tracking-widest">View Profile</div>
            </button>
          </div>

          {/* Rating section */}
          {user && (
            <div className="pt-4 border-t border-[#E8F5E9] dark:border-[#2E7D32] space-y-4">
              {!showStars && !justRated && (
                <button 
                  onClick={() => hasRated ? startEditingRating() : setShowStars(true)} 
                  className="w-full text-sm text-[#2E7D32] dark:text-[#A5D6A7] font-bold py-3 bg-[#F1F8F4] dark:bg-[#2E3D2F] hover:bg-[#E8F5E9] dark:hover:bg-[#384d3a] rounded-xl transition-all border border-[#C8E6C9] dark:border-[#4CAF50]/30"
                >
                  {hasRated ? '✏️ Edit your rating' : '⭐ Rate this recipe'}
                </button>
              )}

              {showStars && (
                <div className="space-y-3 bg-[#F1F8F4] dark:bg-[#2E3D2F] p-4 rounded-2xl border border-[#C8E6C9] dark:border-[#4CAF50]/30 anim-scale">
                  <div className="flex items-center justify-center gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s}
                        onMouseEnter={() => setHoverStar(s)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setHoverStar(s)}
                        className="transition-transform hover:scale-125 p-1"
                      >
                        <Star 
                          size={28} 
                          className={s <= (hoverStar || 0) ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300 dark:stroke-gray-600'} 
                        />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment (optional)..."
                      className="w-full p-3 bg-white dark:bg-[#1B2A1F] border border-[#C8E6C9] dark:border-[#2E7D32] rounded-xl text-sm resize-none h-20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRate(hoverStar)}
                      disabled={hoverStar === 0 || isSubmittingRating}
                      className="flex-1 green-gradient text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingRating ? 'Saving...' : 'Submit Rating'}
                    </button>
                    <button 
                      onClick={() => { setShowStars(false); setJustRated(hasRated); }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {justRated && (
                <div className="flex items-center justify-between px-4 py-3 bg-[#F1F8F4] dark:bg-[#2E3D2F] rounded-xl border border-[#C8E6C9] dark:border-[#4CAF50]/30">
                  <span className="text-sm text-[#4CAF50] font-bold uppercase tracking-widest">✓ Thanks for rating!</span>
                  <button 
                    onClick={startEditingRating}
                    className="text-xs font-bold text-[#2E7D32] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          <div className="pt-4 border-t border-[#E8F5E9] dark:border-[#2E7D32]">
            <h2 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-4 flex items-center gap-2">
              <Leaf size={20} className="text-[#4CAF50]" />
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#5C7A61] dark:text-[#9DB5A3]">
                  <span className="text-[#4CAF50] font-bold mt-1">✓</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="pt-4 border-t border-[#E8F5E9] dark:border-[#2E7D32]">
            <h2 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-4 flex items-center gap-2">
              <Flame size={20} className="text-[#FF6B6B]" />
              Instructions
            </h2>
            <div className="space-y-3">
              {Array.isArray(recipe.instructions) ? (
                recipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-[#5C7A61] dark:text-[#9DB5A3] leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#5C7A61] dark:text-[#9DB5A3] leading-relaxed whitespace-pre-wrap">
                  {recipe.instructions}
                </p>
              )}
            </div>
          </div>

          {/* Nutrition */}
          {recipe.nutrition && (
            <div className="pt-4 border-t border-[#E8F5E9] dark:border-[#2E7D32]">
              <h2 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-4">Nutrition Info</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
                  { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
                  { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g' },
                  { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="bg-[#F1F8F4] dark:bg-[#2E3D2F] rounded-lg p-3 text-center border border-[#C8E6C9] dark:border-[#4CAF50]/30">
                    <p className="text-xs font-semibold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-bold text-[#2E7D32] dark:text-[#A5D6A7]">{value}</p>
                    <p className="text-xs text-[#5C7A61] dark:text-[#9DB5A3]">{unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-4 border-t border-[#E8F5E9] dark:border-[#2E7D32]">
            <h2 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-[#4CAF50]" />
              Comments ({recipe.comments?.length || 0})
            </h2>
            <div className="space-y-4">
              {recipe.comments && recipe.comments.length > 0 ? (
                recipe.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-[#2E3D2F] p-4 rounded-2xl border border-[#E8F5E9] dark:border-[#2E7D32]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8F5E9] dark:bg-[#1B2A1F] flex items-center justify-center text-[10px] font-bold text-[#2E7D32]">
                          {comment.userAvatar ? (
                            <Image src={comment.userAvatar} alt="" width={24} height={24} className="rounded-full" unoptimized />
                          ) : (
                            comment.userName[0]
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#1B3A1F] dark:text-[#E0F2E9]">{comment.userName}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < comment.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#5C7A61] dark:text-[#9DB5A3]">{comment.text || <span className="italic opacity-50">No comment provided</span>}</p>
                    <p className="text-[10px] text-[#5C7A61] dark:text-[#9DB5A3] mt-2 opacity-70">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-[#2E3D2F] rounded-2xl border border-dashed border-[#E8F5E9] dark:border-[#2E7D32]">
                  <p className="text-sm text-[#5C7A61] dark:text-[#9DB5A3]">No comments yet. Be the first to rate!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedAuthor && (
        <UserProfileModal user={selectedAuthor} onClose={() => setSelectedAuthor(null)} />
      )}
    </div>
  );
}
