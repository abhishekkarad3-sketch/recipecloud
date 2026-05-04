'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trophy, Medal, Zap, ChefHat, Star, Upload } from 'lucide-react';
import { getLeaderboard, AppUser } from '@/services/users';
import { useLang } from '@/context/LangContext';

const PODIUM = [
  { ring:'ring-yellow-400', bg:'from-yellow-50 to-amber-50',  border:'border-yellow-200', shadow:'shadow-yellow-100', badge:'🥇', size:'scale-110' },
  { ring:'ring-gray-300',   bg:'from-gray-50   to-slate-50',  border:'border-gray-200',   shadow:'shadow-gray-100',   badge:'🥈', size:'scale-100' },
  { ring:'ring-orange-400', bg:'from-orange-50 to-amber-50',  border:'border-orange-200', shadow:'shadow-orange-100', badge:'🥉', size:'scale-100' },
];

const POINTS_GUIDE = [
  { icon: Upload,  pts:'+10', label:'Upload a recipe',   color:'text-[#4CAF50]', bg:'bg-[#E8F5E9]' },
  { icon: Star,    pts:'+5',  label:'Receive a 5★ rating', color:'text-amber-500', bg:'bg-amber-50'  },
  { icon: ChefHat, pts:'+1',  label:'Recipe is favorited', color:'text-red-400',   bg:'bg-red-50'    },
];

export default function LeaderboardTab() {
  const { t } = useLang();
  const [users, setUsers]   = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(10).then(data => { setUsers(data); setLoading(false); });
  }, []);

  const top3 = users.slice(0, 3);
  const rest  = users.slice(3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Trophy size={30} className="text-amber-500" />
        </div>
        <h2 className="font-display text-3xl font-black text-[#1B3A1F]">{t('leaderboard')}</h2>
        <p className="text-sm text-[#5C7A61] mt-1">Upload recipes to earn points and climb the ranks</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="skeleton h-16 rounded-2xl"/>)}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8F5E9]">
          <Trophy size={40} className="text-[#A5D6A7] mx-auto mb-3"/>
          <h3 className="font-display text-xl font-bold text-[#1B3A1F] mb-2">No chefs yet!</h3>
          <p className="text-sm text-[#5C7A61]">Be the first to upload a recipe and take the crown.</p>
        </div>
      ) : (
        <>
          {/* Podium — top 3 */}
          <div className="grid grid-cols-3 gap-3">
            {top3.map((u, i) => {
              const p = PODIUM[i];
              return (
                <div key={u.uid}
                  className={`${p.size} bg-gradient-to-br ${p.bg} border-2 ${p.border} rounded-3xl p-4 text-center shadow-md ${p.shadow} transition-transform hover:scale-105`}>
                  <div className="text-3xl mb-2">{p.badge}</div>
                  <div className="flex justify-center mb-3">
                    {u.photoURL ? (
                      <Image src={u.photoURL} alt={u.name} width={52} height={52}
                        className={`rounded-2xl ring-4 ${p.ring}`} unoptimized/>
                    ) : (
                      <div className={`w-13 h-13 w-[52px] h-[52px] green-gradient rounded-2xl flex items-center justify-center font-bold text-white text-xl ring-4 ${p.ring}`}>
                        {u.name?.[0]||'?'}
                      </div>
                    )}
                  </div>
                  <div className="font-display font-bold text-[#1B3A1F] text-sm truncate">{u.name.split(' ')[0]}</div>
                  <div className="font-display text-2xl font-black text-[#2E7D32] mt-1">{u.points}</div>
                  <div className="text-[10px] text-[#5C7A61]">points</div>
                </div>
              );
            })}
          </div>

          {/* Ranks 4–10 */}
          {rest.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8F5E9] overflow-hidden shadow-sm">
              {rest.map((u, i) => (
                <div key={u.uid}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F1F8F4] last:border-0 hover:bg-[#F9FFF9] transition-colors">
                  <div className="w-7 text-center font-display font-bold text-[#5C7A61]">{i+4}</div>
                  {u.photoURL ? (
                    <Image src={u.photoURL} alt={u.name} width={38} height={38}
                      className="rounded-xl ring-2 ring-[#C8E6C9]" unoptimized/>
                  ) : (
                    <div className="w-9 h-9 bg-[#E8F5E9] rounded-xl flex items-center justify-center font-bold text-[#2E7D32]">
                      {u.name?.[0]||'?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1B3A1F] text-sm truncate">{u.name}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Medal size={13} className="text-[#8BC34A]"/>
                    <span className="font-display font-black text-[#2E7D32]">{u.points}</span>
                    <span className="text-xs text-[#5C7A61]">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* How to earn points */}
      <div className="bg-white rounded-2xl border border-[#E8F5E9] p-5 shadow-sm">
        <h3 className="font-display font-bold text-[#1B3A1F] mb-4 flex items-center gap-2">
          <Zap size={16} className="text-[#4CAF50]"/> How to Earn Points
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {POINTS_GUIDE.map(({ icon: Icon, pts, label, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center border border-white`}>
              <Icon size={18} className={`${color} mx-auto mb-1.5`}/>
              <div className={`font-display text-xl font-black ${color}`}>{pts}</div>
              <div className="text-[10px] text-[#5C7A61] mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
