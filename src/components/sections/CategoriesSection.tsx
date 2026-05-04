'use client';
import React from 'react';

const CATS = [
  { label: 'Breakfast', emoji: '🍳', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100', count: '120+ recipes' },
  { label: 'Vegan', emoji: '🥗', color: 'bg-green-50 border-green-200 hover:bg-green-100', count: '200+ recipes' },
  { label: 'Quick', emoji: '⚡', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100', count: '80+ recipes' },
  { label: 'Dessert', emoji: '🍰', color: 'bg-pink-50 border-pink-200 hover:bg-pink-100', count: '150+ recipes' },
  { label: 'Dinner', emoji: '🍽️', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100', count: '300+ recipes' },
  { label: 'Snack', emoji: '🥜', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100', count: '90+ recipes' },
  { label: 'Lunch', emoji: '🥙', color: 'bg-teal-50 border-teal-200 hover:bg-teal-100', count: '110+ recipes' },
  { label: 'Smoothie', emoji: '🥤', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100', count: '60+ recipes' },
];

export default function CategoriesSection() {
  const scrollToRecipes = () => {
    document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="py-20 leaf-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-[#4CAF50] tracking-wide uppercase">Browse by Type</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1B3A1F] mt-2">
            All Categories
          </h2>
          <p className="text-[#5C7A61] mt-3">Find exactly what you&apos;re craving today</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATS.map((cat, i) => (
            <button
              key={cat.label}
              onClick={scrollToRecipes}
              className={`${cat.color} border-2 rounded-2xl p-6 text-center transition-all hover:scale-105 hover:shadow-lg group animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <div className="font-display font-semibold text-[#1B3A1F] text-lg">{cat.label}</div>
              <div className="text-xs text-[#5C7A61] mt-1">{cat.count}</div>
            </button>
          ))}
        </div>

        {/* Highlight banner */}
        <div className="mt-12 green-gradient rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="font-display text-3xl font-bold mb-2">Organic & Healthy</h3>
            <p className="opacity-90 max-w-sm">
              All recipes curated by our community with fresh, natural ingredients. Your health is our priority.
            </p>
          </div>
          <div className="flex gap-4 text-center text-white shrink-0">
            {[['2.4k+', 'Recipes'], ['890+', 'Chefs'], ['4.8★', 'Avg Rating']].map(([num, label]) => (
              <div key={label} className="bg-white/15 rounded-2xl px-6 py-4">
                <div className="font-display text-3xl font-bold">{num}</div>
                <div className="text-sm opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
