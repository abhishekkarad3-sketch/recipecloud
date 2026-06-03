'use client';
import React from 'react';
import { Zap, Beef, Droplets, Wheat, Candy, Leaf, Pill, Dumbbell } from 'lucide-react';
import type { NutritionData } from '@/services/nutrition';
import { useLang } from '@/context/LangContext';

interface Props { data: NutritionData; perServing?: boolean; }

const SCORE_COLOR = (s: number) =>
  s >= 8 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
  s >= 5 ? 'text-amber-600  bg-amber-50  border-amber-200' :
           'text-red-500    bg-red-50    border-red-200';

const SCORE_LABEL = (s: number) => s >= 8 ? '🟢 Excellent' : s >= 5 ? '🟡 Good' : '🔴 Moderate';

export default function NutritionPanel({ data, perServing = true }: Props) {
  const { t } = useLang();
  const div = perServing && data.servings > 1 ? data.servings : 1;

  const MACRO_ROWS = [
    { Icon: Zap,      label: t('calories'), val: Math.round(data.calories / div), unit: 'kcal', color: '#F59E0B', bg: '#FEF3C7', w: Math.min(100, (data.calories/div)/20)  },
    { Icon: Beef,     label: t('protein'),  val: Math.round(data.protein  / div), unit: 'g',    color: '#3B82F6', bg: '#EFF6FF', w: Math.min(100, (data.protein /div)*2.5) },
    { Icon: Droplets, label: t('fat'),      val: Math.round(data.fat      / div), unit: 'g',    color: '#EF4444', bg: '#FEF2F2', w: Math.min(100, (data.fat     /div)*3)   },
    { Icon: Wheat,    label: t('carbs'),    val: Math.round(data.carbs    / div), unit: 'g',    color: '#8B5CF6', bg: '#F5F3FF', w: Math.min(100, (data.carbs   /div)*1.5) },
    { Icon: Candy,    label: t('sugar'),    val: Math.round(data.sugar    / div), unit: 'g',    color: '#EC4899', bg: '#FDF2F8', w: Math.min(100, (data.sugar   /div)*4)   },
    { Icon: Leaf,     label: t('fiber'),    val: Math.round(data.fiber    / div), unit: 'g',    color: '#10B981', bg: '#ECFDF5', w: Math.min(100, (data.fiber   /div)*8)   },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E8F5E9] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="green-gradient px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell size={18} className="text-white" />
          <span className="font-display font-bold text-white text-base">{t('nutrition')}</span>
        </div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full border ${SCORE_COLOR(data.healthScore)}`}>
          {SCORE_LABEL(data.healthScore)} {data.healthScore}/10
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Per serving toggle label */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#5C7A61]">
            {perServing ? `${t('perServing')} (${data.servings} servings total)` : 'Whole recipe'}
          </span>
          <div className="flex items-center gap-1 bg-[#F1F8F4] rounded-full px-3 py-1">
            <Pill size={11} className="text-[#4CAF50]" />
            <span className="text-xs font-semibold text-[#2E7D32]">Manual Entry</span>
          </div>
        </div>

        {/* Macro bars */}
        <div className="space-y-3">
          {MACRO_ROWS.map(({ Icon, label, val, unit, color, bg, w }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-[#5C7A61]">{label}</span>
                  <span className="text-xs font-bold text-[#1B3A1F]">{val} {unit}</span>
                </div>
                <div className="h-1.5 bg-[#F1F8F4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${w}%`, background: color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vitamins grid */}
        {data.vitamins.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide mb-3 flex items-center gap-1">
              <Pill size={12} /> {t('vitamins')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.vitamins.map(v => (
                <div key={v.name} className="bg-[#F1F8F4] rounded-xl px-3 py-2 border border-[#E8F5E9]">
                  <div className="text-xs font-semibold text-[#2E7D32]">{v.name}</div>
                  <div className="text-xs text-[#5C7A61] font-medium mt-0.5">{v.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minerals grid */}
        {data.minerals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide mb-3 flex items-center gap-1">
              💎 Minerals
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {data.minerals.map(m => (
                <div key={m.name} className="bg-[#E8F5E9] rounded-xl px-3 py-2">
                  <div className="text-xs font-semibold text-[#1B3A1F]">{m.name}</div>
                  <div className="text-xs text-[#5C7A61] mt-0.5">{m.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sodium */}
        <div className="flex items-center justify-between bg-[#FFF7ED] rounded-xl px-4 py-3 border border-orange-100">
          <span className="text-xs font-semibold text-orange-700">🧂 Sodium</span>
          <span className="text-sm font-bold text-orange-600">
            {Math.round(data.sodium / div)} mg
          </span>
        </div>

        {/* Health tip */}
        {data.healthTip && (
          <div className="flex gap-2 bg-[#F1F8F4] rounded-xl px-4 py-3 border border-[#C8E6C9]">
            <span className="text-base shrink-0">💡</span>
            <p className="text-xs text-[#2E7D32] leading-relaxed">{data.healthTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
