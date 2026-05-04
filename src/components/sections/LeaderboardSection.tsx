'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getLeaderboard, AppUser } from '@/services/users';

const BADGES = ['🥇', '🥈', '🥉'];
const RING_STYLES = ['ring-4 ring-yellow-400', 'ring-4 ring-gray-300', 'ring-4 ring-amber-500'];
const CARD_STYLES = [
  'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-yellow-100',
  'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 shadow-gray-100',
  'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-amber-100',
];

export default function LeaderboardSection() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(10).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <section id="leaderboard" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-[#4CAF50] tracking-wide uppercase">Hall of Fame</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1B3A1F] mt-2">
            🏆 Leaderboard
          </h2>
          <p className="text-[#5C7A61] mt-3 max-w-sm mx-auto">
            Upload recipes to earn points and climb the ranks!
            <span className="text-[#4CAF50] font-semibold"> +10 pts</span> per recipe.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-[#F1F8F4] rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-[#F1F8F4] rounded-3xl">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="font-display text-2xl font-semibold text-[#1B3A1F] mb-2">No chefs yet!</h3>
            <p className="text-[#5C7A61]">Be the first to upload a recipe and take the crown.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
              {top3.map((u, i) => (
                <div
                  key={u.uid}
                  className={`${CARD_STYLES[i]} border-2 rounded-3xl p-4 sm:p-6 text-center shadow-lg ${
                    i === 0 ? 'scale-105' : ''
                  } transition-transform hover:scale-105`}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{BADGES[i]}</div>
                  <div className="flex justify-center mb-3">
                    {u.photoURL ? (
                      <Image
                        src={u.photoURL}
                        alt={u.name}
                        width={60}
                        height={60}
                        className={`rounded-full ${RING_STYLES[i]}`}
                        unoptimized
                      />
                    ) : (
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 green-gradient rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white ${RING_STYLES[i]}`}
                      >
                        {u.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div className="font-display font-bold text-[#1B3A1F] text-sm sm:text-base leading-tight truncate">
                    {u.name.split(' ')[0]}
                  </div>
                  <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-[#2E7D32]">
                    {u.points}
                  </div>
                  <div className="text-xs text-[#5C7A61]">points</div>
                </div>
              ))}
            </div>

            {/* Ranks 4–10 */}
            {rest.length > 0 && (
              <div className="bg-[#F1F8F4] rounded-3xl overflow-hidden border border-[#E8F5E9]">
                {rest.map((u, i) => (
                  <div
                    key={u.uid}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#E8F5E9] last:border-0 hover:bg-white transition-colors"
                  >
                    <span className="w-7 text-center font-display font-bold text-[#5C7A61] text-lg">
                      {i + 4}
                    </span>
                    {u.photoURL ? (
                      <Image
                        src={u.photoURL}
                        alt={u.name}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-[#C8E6C9]"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#A5D6A7] rounded-full flex items-center justify-center font-bold text-[#2E7D32]">
                        {u.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1B3A1F] truncate">{u.name}</div>
                      <div className="text-xs text-[#5C7A61]">{u.email}</div>
                    </div>
                    <div className="font-display font-bold text-[#2E7D32] text-lg shrink-0">
                      {u.points} <span className="text-xs font-normal text-[#5C7A61]">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Point guide */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { pts: '+10', action: 'Upload Recipe', emoji: '📤' },
            { pts: '+5', action: 'Get 5-Star Rating', emoji: '⭐' },
            { pts: '+1', action: 'Recipe Favorited', emoji: '❤️' },
          ].map((item) => (
            <div key={item.action} className="bg-[#F1F8F4] rounded-2xl p-4 border border-[#E8F5E9]">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="font-display font-bold text-[#4CAF50] text-xl">{item.pts}</div>
              <div className="text-xs text-[#5C7A61] mt-0.5">{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
