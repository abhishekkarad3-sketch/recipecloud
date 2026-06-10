'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Trophy, BookOpen, Heart, ChefHat, Clock, Star } from 'lucide-react';
import { AppUser, getUserRecipes } from '@/services/users';
import { Recipe, avgRating } from '@/services/recipes';
import { useLang } from '@/context/LangContext';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailModal from '@/components/RecipeDetailModal';

interface Props {
  user: AppUser;
  onClose: () => void;
}

export default function UserProfileModal({ user, onClose }: Props) {
  const { t } = useLang();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getUserRecipes(user.uid).then(data => {
      setRecipes(data.map(d => ({
        id: d.id,
        name: d.name,
        ingredients: d.ingredients,
        instructions: d.instructions,
        cookingTime: d.cooking_time,
        category: d.category,
        difficulty: d.difficulty,
        imageUrl: d.image_url,
        authorId: d.author_id,
        authorName: d.author_name,
        createdAt: d.created_at,
        ratingTotal: d.rating_total,
        ratingCount: d.rating_count,
        usersWhoRated: d.users_who_rated || [],
        comments: d.comments || [],
        nutrition: d.nutrition,
        dietaryType: d.dietary_type || 'veg',
        updatedAt: d.updated_at,
      })));
      setLoading(false);
    });
  }, [user.uid]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm anim-fade">
      <div className="bg-[#F1F8F4] dark:bg-[#121A14] w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col anim-scale">
        {/* Header */}
        <div className="relative h-32 sm:h-48 green-gradient">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all z-10"
          >
            <X size={20} />
          </button>
          
          <div className="absolute -bottom-12 left-8 flex items-end gap-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] overflow-hidden ring-8 ring-[#F1F8F4] dark:ring-[#121A14] shadow-xl bg-white">
              {user.avatarUrl || user.photoURL ? (
                <Image src={user.avatarUrl || user.photoURL} alt={user.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#4CAF50]">
                  {user.name[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#1B3A1F] dark:text-[#E0F2E9]">{user.name}</h2>
              <p className="text-[#5C7A61] dark:text-[#9DB5A3] font-medium">{user.email}</p>
              {user.bio && <p className="mt-2 text-sm text-[#5C7A61] dark:text-[#9DB5A3] italic max-w-xl">"{user.bio}"</p>}
            </div>
            
            <div className="flex gap-3">
              <div className="bg-white dark:bg-[#1B2A1F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-5 py-3 text-center shadow-sm">
                <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Points</div>
                <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <Trophy size={18} /> {user.points}
                </div>
              </div>
              <div className="bg-white dark:bg-[#1B2A1F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-5 py-3 text-center shadow-sm">
                <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Recipes</div>
                <div className="text-xl font-black text-[#4CAF50] flex items-center justify-center gap-1">
                  <BookOpen size={18} /> {recipes.length}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E8F5E9] dark:border-[#2E7D32] pt-8">
            <h3 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-6 flex items-center gap-2">
              <ChefHat className="text-[#4CAF50]" /> Recipes by {user.name.split(' ')[0]}
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton h-64 rounded-3xl" />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1B2A1F] rounded-3xl border-2 border-dashed border-[#E8F5E9] dark:border-[#2E7D32]">
                <p className="text-[#5C7A61] dark:text-[#9DB5A3]">No recipes uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recipes
                    .slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage)
                    .map(r => (
                      <RecipeCard key={r.id} recipe={r} onViewDetails={setSelectedRecipe} />
                    ))}
                </div>
                {recipes.length > recipesPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#E8F5E9] dark:border-[#2E7D32]">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-[#1B2A1F] border border-[#E8F5E9] dark:border-[#2E7D32] text-[#2E7D32] dark:text-[#A5D6A7] font-bold disabled:opacity-50 hover:bg-[#F1F8F4] dark:hover:bg-[#2E3D2F] transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-bold text-[#5C7A61] dark:text-[#9DB5A3]">
                      Page {currentPage} of {Math.ceil(recipes.length / recipesPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(recipes.length / recipesPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(recipes.length / recipesPerPage)}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-[#1B2A1F] border border-[#E8F5E9] dark:border-[#2E7D32] text-[#2E7D32] dark:text-[#A5D6A7] font-bold disabled:opacity-50 hover:bg-[#F1F8F4] dark:hover:bg-[#2E3D2F] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
