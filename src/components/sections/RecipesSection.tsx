'use client';
import React, { useEffect, useState, useMemo } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { Recipe, subscribeToRecipes, CATEGORIES } from '@/services/recipes';

export default function RecipesSection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('newest');
  const [maxTime, setMaxTime] = useState(120);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToRecipes((data) => {
      setRecipes(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    let list = [...recipes];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') list = list.filter((r) => r.category === category);
    if (difficulty !== 'All') list = list.filter((r) => r.difficulty === difficulty);
    list = list.filter((r) => r.cookingTime <= maxTime);
    if (sortBy === 'top') {
      list.sort((a, b) => {
        const aAvg = a.ratingCount ? a.ratingTotal / a.ratingCount : 0;
        const bAvg = b.ratingCount ? b.ratingTotal / b.ratingCount : 0;
        return bAvg - aAvg;
      });
    }
    return list;
  }, [recipes, search, category, difficulty, maxTime, sortBy]);

  return (
    <section id="recipes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-[#4CAF50] tracking-wide uppercase">Community Recipes</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1B3A1F] mt-2">
            Discover Recipes
          </h2>
          <p className="text-[#5C7A61] mt-3 max-w-md mx-auto">
            Real recipes from real home chefs. Live-updated from the cloud.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-[#F1F8F4] rounded-2xl p-4 mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C7A61]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ingredient..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-sm placeholder-[#5C7A61] text-[#1B3A1F] transition-all"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-[#C8E6C9] rounded-xl px-3 py-2 text-sm text-[#2E7D32] font-medium"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            {/* Difficulty */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-white border border-[#C8E6C9] rounded-xl px-3 py-2 text-sm text-[#2E7D32] font-medium"
            >
              {['All', 'Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
            </select>

            {/* Sort */}
            <div className="flex bg-white border border-[#C8E6C9] rounded-xl overflow-hidden">
              {(['newest', 'top'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    sortBy === s ? 'bg-[#4CAF50] text-white' : 'text-[#5C7A61] hover:bg-[#F1F8F4]'
                  }`}
                >
                  {s === 'newest' ? '🕒 Newest' : '⭐ Top Rated'}
                </button>
              ))}
            </div>

            {/* Time slider */}
            <div className="flex items-center gap-2 bg-white border border-[#C8E6C9] rounded-xl px-3 py-2">
              <span className="text-sm text-[#5C7A61]">⏱ Max:</span>
              <input
                type="range"
                min={10}
                max={120}
                step={10}
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-24 accent-[#4CAF50]"
              />
              <span className="text-sm font-medium text-[#2E7D32] w-12">{maxTime}m</span>
            </div>

            <span className="text-sm text-[#5C7A61] ml-auto">
              {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#F1F8F4] rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥗</div>
            <h3 className="font-display text-2xl text-[#1B3A1F] font-semibold mb-2">No recipes found</h3>
            <p className="text-[#5C7A61]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
