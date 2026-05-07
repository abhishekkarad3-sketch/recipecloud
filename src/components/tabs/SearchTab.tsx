'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Clock, Flame } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailModal from '@/components/RecipeDetailModal';
import { useLang } from '@/context/LangContext';
import { Recipe, subscribeToRecipes, CATEGORIES } from '@/services/recipes';
import { AppUser, searchUsers } from '@/services/users';
import UserProfileModal from '@/components/UserProfileModal';
import Image from 'next/image';
import { User } from 'lucide-react';

type Sort = 'newest' | 'top';
const DIFFS = ['All', 'Easy', 'Medium', 'Hard'];

export default function SearchTab() {
  const { t } = useLang();
  const [all, setAll]           = useState<Recipe[]>([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('All');
  const [diff, setDiff]         = useState('All');
  const [maxTime, setMaxTime]   = useState(120);
  const [sort, setSort]         = useState<Sort>('newest');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsub = subscribeToRecipes(data => { setAll(data); setLoading(false); });
    return unsub;
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      setSearchingUsers(true);
      searchUsers(query).then(data => {
        setUsers(data);
        setSearchingUsers(false);
      });
    } else {
      setUsers([]);
    }
  }, [query]);

  const results = useMemo(() => {
    let list = [...all];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q)
      );
    }
    if (category !== 'All') list = list.filter(r => r.category === category);
    if (diff     !== 'All') list = list.filter(r => r.difficulty === diff);
    list = list.filter(r => r.cookingTime <= maxTime);
    if (sort === 'top') {
      list.sort((a, b) => {
        const aA = a.ratingCount ? a.ratingTotal / a.ratingCount : 0;
        const bA = b.ratingCount ? b.ratingTotal / b.ratingCount : 0;
        return bA - aA;
      });
    }
    return list;
  }, [all, query, category, diff, maxTime, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C7A61]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#C8E6C9] rounded-xl text-sm text-[#1B3A1F] placeholder-[#5C7A61]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C7A61]">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            showFilter ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : 'bg-white border-[#C8E6C9] text-[#2E7D32]'
          }`}
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="bg-white rounded-2xl border border-[#E8F5E9] p-5 space-y-5 anim-scale shadow-sm">
          {/* Category chips */}
          <div>
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    category === c ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'bg-white text-[#5C7A61] border-[#C8E6C9] hover:border-[#4CAF50]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty chips */}
          <div>
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {DIFFS.map(d => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    diff === d ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'bg-white text-[#5C7A61] border-[#C8E6C9] hover:border-[#4CAF50]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time slider */}
          <div>
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1"><Clock size={12} /> Max Cook Time</span>
              <span className="text-[#4CAF50] font-bold">{maxTime} min</span>
            </label>
            <input
              type="range" min={10} max={120} step={5}
              value={maxTime} onChange={e => setMaxTime(+e.target.value)}
              className="w-full accent-[#4CAF50]"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {(['newest', 'top'] as Sort[]).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  sort === s ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : 'bg-white text-[#5C7A61] border-[#C8E6C9]'
                }`}
              >
                {s === 'newest' ? '🕒 Newest' : '⭐ Top Rated'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Users Section */}
      {users.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#1B3A1F] flex items-center gap-2">
            <User size={18} className="text-[#4CAF50]" /> Users
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {users.map(u => (
              <button 
                key={u.uid}
                onClick={() => setSelectedUser(u)}
                className="flex-shrink-0 flex items-center gap-3 bg-white border border-[#E8F5E9] rounded-2xl p-3 hover:border-[#4CAF50] transition-all shadow-sm"
              >
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#E8F5E9]">
                  {u.avatarUrl || u.photoURL ? (
                    <Image src={u.avatarUrl || u.photoURL} alt={u.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[#4CAF50]">
                      {u.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[#1B3A1F] line-clamp-1">{u.name}</div>
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{u.points} pts</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[#1B3A1F]">
          {query ? `Results for "${query}"` : 'All Recipes'}
        </h2>
        <span className="text-sm text-[#5C7A61]">{results.length} recipe{results.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8F5E9] overflow-hidden">
              <div className="skeleton h-48" />
              <div className="p-3.5 space-y-2">
                <div className="skeleton h-4 rounded-lg w-3/4" />
                <div className="skeleton h-3 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8F5E9]">
          <Search size={40} className="text-[#A5D6A7] mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-[#1B3A1F] mb-2">Nothing found</h3>
          <p className="text-sm text-[#5C7A61]">Try a different search or reset filters</p>
          <button onClick={() => { setQuery(''); setCategory('All'); setDiff('All'); setMaxTime(120); }}
            className="mt-4 text-sm text-[#4CAF50] font-semibold hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((r, i) => (
            <div key={r.id} className={`anim-up d-${Math.min(i % 6, 5)}`}>
              <RecipeCard recipe={r} onViewDetails={setSelectedRecipe} />
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}

      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
