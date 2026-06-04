'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trophy, BookOpen, ChefHat, ArrowLeft, Star, Calendar, Users, Award, MapPin } from 'lucide-react';
import { AppUser, getUserRecipes } from '@/services/users';
import { Recipe, avgRating } from '@/services/recipes';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailModal from '@/components/RecipeDetailModal';

interface Props {
  user: AppUser;
  onBack: () => void;
}

export default function UserProfileTab({ user, onBack }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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
        authorAvatar: d.author_avatar,
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

  // Compute stats
  const totalRatings = recipes.reduce((sum, r) => sum + (r.ratingCount || 0), 0);
  const overallAvg = recipes.length > 0
    ? recipes.reduce((sum, r) => sum + avgRating(r), 0) / recipes.filter(r => r.ratingCount > 0).length || 0
    : 0;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const genderEmoji = user.gender === 'male' ? '👨‍🍳' : user.gender === 'female' ? '👩‍🍳' : user.gender ? '🧑‍🍳' : '👤';

  const getBadge = () => {
    if (user.points >= 100) return { label: 'Master Chef', color: 'text-amber-500', bg: 'bg-amber-50', icon: '🏆' };
    if (user.points >= 50) return { label: 'Pro Chef', color: 'text-purple-500', bg: 'bg-purple-50', icon: '⭐' };
    if (user.points >= 20) return { label: 'Chef', color: 'text-blue-500', bg: 'bg-blue-50', icon: '🍳' };
    return { label: 'Member', color: 'text-green-600', bg: 'bg-green-50', icon: '🌱' };
  };

  const badge = getBadge();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#4CAF50] font-bold hover:underline"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1B2A1F] rounded-[2.5rem] shadow-xl overflow-hidden border border-[#E8F5E9] dark:border-[#2E7D32]">

        {/* Cover Banner */}
        <div className="relative h-36 sm:h-52 green-gradient">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />
          {/* Badge on cover */}
          <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 ${badge.bg} rounded-full shadow-md`}>
            <span>{badge.icon}</span>
            <span className={`text-xs font-bold ${badge.color}`}>{badge.label}</span>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-14 left-6 sm:left-8">
            <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden ring-4 ring-white dark:ring-[#1B2A1F] shadow-xl bg-white">
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

        {/* User Info */}
        <div className="pt-18 pb-6 px-6 sm:px-8 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-[#1B3A1F] dark:text-[#E0F2E9]">{user.name}</h2>
                {user.gender && (
                  <span className="text-lg">{genderEmoji}</span>
                )}
              </div>
              <p className="text-[#5C7A61] dark:text-[#9DB5A3] text-sm mt-0.5">{user.email}</p>
              {joinDate && (
                <div className="flex items-center gap-1 text-xs text-[#5C7A61] dark:text-[#9DB5A3] mt-1">
                  <Calendar size={12} />
                  <span>Member since {joinDate}</span>
                </div>
              )}
              {user.bio && (
                <p className="mt-3 text-sm text-[#5C7A61] dark:text-[#9DB5A3] italic max-w-lg bg-[#F1F8F4] dark:bg-[#2E3D2F] px-4 py-2 rounded-2xl">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#F1F8F4] dark:bg-[#2E3D2F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-4 py-3 text-center">
              <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Points</div>
              <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Trophy size={16} /> {user.points}
              </div>
            </div>
            <div className="bg-[#F1F8F4] dark:bg-[#2E3D2F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-4 py-3 text-center">
              <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Recipes</div>
              <div className="text-xl font-black text-[#4CAF50] flex items-center justify-center gap-1">
                <BookOpen size={16} /> {recipes.length}
              </div>
            </div>
            <div className="bg-[#F1F8F4] dark:bg-[#2E3D2F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-4 py-3 text-center">
              <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Avg Rating</div>
              <div className="text-xl font-black text-yellow-400 flex items-center justify-center gap-1">
                <Star size={16} fill="currentColor" /> {overallAvg > 0 ? overallAvg.toFixed(1) : '—'}
              </div>
            </div>
            <div className="bg-[#F1F8F4] dark:bg-[#2E3D2F] border border-[#E8F5E9] dark:border-[#2E7D32] rounded-2xl px-4 py-3 text-center">
              <div className="text-xs font-bold text-[#5C7A61] dark:text-[#9DB5A3] uppercase tracking-widest mb-1">Reviews</div>
              <div className="text-xl font-black text-blue-400 flex items-center justify-center gap-1">
                <Award size={16} /> {totalRatings}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E8F5E9] dark:border-[#2E7D32] pt-6">
            <h3 className="text-xl font-bold text-[#1B3A1F] dark:text-[#E0F2E9] mb-5 flex items-center gap-2">
              <ChefHat className="text-[#4CAF50]" />
              Recipes by {user.name.split(' ')[0]}
              <span className="ml-2 text-sm font-semibold bg-[#E8F5E9] dark:bg-[#2E3D2F] text-[#4CAF50] px-2 py-0.5 rounded-full">
                {recipes.length}
              </span>
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton h-64 rounded-3xl" />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 bg-[#F1F8F4] dark:bg-[#2E3D2F] rounded-3xl border-2 border-dashed border-[#E8F5E9] dark:border-[#2E7D32]">
                <ChefHat size={40} className="text-[#C8E6C9] mx-auto mb-3" />
                <p className="text-[#5C7A61] dark:text-[#9DB5A3] font-medium">No recipes uploaded yet</p>
                <p className="text-xs text-[#5C7A61] dark:text-[#9DB5A3] mt-1">Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recipes.map(r => (
                  <RecipeCard key={r.id} recipe={r} onViewDetails={setSelectedRecipe} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
