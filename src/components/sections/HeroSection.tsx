'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const FEATURE_PILLS = ['🌿 100% Organic', '⭐ Community Rated', '☁️ Cloud Synced', '🔍 Smart Search'];

export default function HeroSection() {
  const { user, signInWithGoogle } = useAuth();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden leaf-bg pt-16"
    >
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#A5D6A7]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#8BC34A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating food emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🥦', '🍅', '🥑', '🌽', '🫐', '🍋', '🥕', '🫚'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-3xl opacity-15 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#E8F5E9] border border-[#C8E6C9] rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#2E7D32]">Real-time Recipe Community</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1B3A1F] leading-[1.05]">
            Healthy
            <span className="block text-[#4CAF50] italic">Recipe</span>
            <span className="block">Cloud</span>
          </h1>

          <p className="text-lg text-[#5C7A61] leading-relaxed max-w-md">
            Discover, share, and save thousands of wholesome recipes from a community of passionate home chefs. Cook smarter, eat better.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {FEATURE_PILLS.map((pill) => (
              <span
                key={pill}
                className="text-sm bg-white border border-[#C8E6C9] text-[#2E7D32] px-3 py-1.5 rounded-full font-medium shadow-sm"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => scrollTo('recipes')}
              className="green-gradient text-white px-8 py-3.5 rounded-2xl font-semibold text-base shadow-lg shadow-green-300/40 hover:scale-105 transition-transform"
            >
              Browse Recipes
            </button>
            {!user && (
              <button
                onClick={signInWithGoogle}
                className="bg-white border-2 border-[#4CAF50] text-[#2E7D32] px-8 py-3.5 rounded-2xl font-semibold text-base hover:bg-[#F1F8F4] transition-colors"
              >
                Join Free →
              </button>
            )}
            {user && (
              <button
                onClick={() => scrollTo('upload')}
                className="bg-white border-2 border-[#4CAF50] text-[#2E7D32] px-8 py-3.5 rounded-2xl font-semibold text-base hover:bg-[#F1F8F4] transition-colors"
              >
                Share Recipe +
              </button>
            )}
          </div>
        </div>

        {/* Right: Visual card */}
        <div className="relative hidden lg:flex justify-center">
          <div className="relative w-80 h-80">
            {/* Main card */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-green-200/50 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full green-gradient opacity-10 absolute inset-0" />
              <span className="text-9xl">🥗</span>
            </div>
            {/* Floating stat cards */}
            <div className="absolute -left-12 top-8 bg-white rounded-2xl shadow-xl px-4 py-3 border border-[#C8E6C9] animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-2xl font-display font-bold text-[#4CAF50]">2.4k+</div>
              <div className="text-xs text-[#5C7A61]">Recipes Shared</div>
            </div>
            <div className="absolute -right-10 bottom-12 bg-white rounded-2xl shadow-xl px-4 py-3 border border-[#C8E6C9] animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-display font-bold text-[#8BC34A]">⭐ 4.8</div>
              <div className="text-xs text-[#5C7A61]">Avg Rating</div>
            </div>
            <div className="absolute -top-6 right-4 bg-[#2E7D32] text-white rounded-2xl shadow-xl px-4 py-3 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-sm font-semibold">🔥 Trending Today</div>
              <div className="text-xs opacity-80">Avocado Bowl</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <span className="text-xs text-[#5C7A61]">Scroll to explore</span>
        <div className="w-px h-8 bg-[#4CAF50] animate-pulse" />
      </div>
    </section>
  );
}
