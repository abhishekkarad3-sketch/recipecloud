'use client';
import React from 'react';

const LINKS = {
  Explore: ['Browse Recipes', 'Categories', 'Top Rated', 'New Arrivals'],
  Community: ['Upload Recipe', 'Leaderboard', 'Chef Profiles', 'Forum'],
  Support: ['About Us', 'Contact', 'Privacy Policy', 'Terms of Use'],
};

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1B3A1F] text-white">
      <div className="green-gradient py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-display text-3xl sm:text-4xl font-bold mb-3">Ready to share your recipes?</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Join thousands of home chefs. Upload your first recipe and earn 10 points instantly.</p>
          <button onClick={() => scrollTo('upload')} className="bg-white text-[#2E7D32] px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-[#F1F8F4] transition-colors shadow-lg">
            Start Cooking 🍳
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#4CAF50] rounded-xl flex items-center justify-center text-xl">🌿</div>
              <span className="font-display font-bold text-xl">RecipeCloud</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">A community-powered recipe platform for wholesome, healthy cooking. Discover, share, and inspire.</p>
            <div className="flex gap-3 mt-5">
              {['𝕏', 'in', 'f', '▶'].map((icon) => (
                <button key={icon} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-sm hover:bg-[#4CAF50] transition-colors">{icon}</button>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}><button className="text-white/60 text-sm hover:text-[#A5D6A7] transition-colors text-left">{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-sm">
          <span>© {new Date().getFullYear()} RecipeCloud. Built with ☁️ + 💚</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
            <span>Live · Real-time updates via Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
