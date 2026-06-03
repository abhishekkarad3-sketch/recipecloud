'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, CheckCircle, AlertCircle, ChefHat, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { addRecipe, uploadRecipeImage, CATEGORIES, Recipe } from '@/services/recipes';
import { createEmptyNutrition, NutritionData } from '@/services/nutrition';
import NutritionPanel from '@/components/NutritionPanel';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type DietaryType = 'veg' | 'non-veg' | 'vegan';

type FormData = {
  name: string; 
  ingredients: string[]; 
  instructions: string[];
  cookingTime: number; 
  category: string; 
  difficulty: Difficulty;
  dietaryType: DietaryType;
};

const INIT: FormData = { 
  name:'', 
  ingredients:[''], 
  instructions:[''], 
  cookingTime:30, 
  category:'Dinner', 
  difficulty:'Easy',
  dietaryType: 'veg'
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Breakfast': '🍳',
  'Lunch': '🥙',
  'Dinner': '🍽️',
  'Dessert': '🍰',
  'Snack': '🥜',
  'Vegan': '🌱',
  'Quick': '⚡',
  'Smoothie': '🥤',
};

const DIETARY_OPTIONS: { value: DietaryType; labelKey: string; emoji: string }[] = [
  { value: 'veg', labelKey: 'vegetarian', emoji: '🥦🥛' },
  { value: 'non-veg', labelKey: 'nonVeg', emoji: '🍗' },
  { value: 'vegan', labelKey: 'vegan', emoji: '🌱' },
];

export default function UploadTab() {
  const { user, appUser, refreshUser, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const [form, setForm]         = useState<FormData>(INIT);
  const [file, setFile]         = useState<File|null>(null);
  const [preview, setPreview]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<'idle'|'ok'|'err'>('idle');
  const [errMsg, setErrMsg]     = useState('');
  const [nutrition, setNutrition] = useState<NutritionData>(createEmptyNutrition());
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: any) => setForm(p => ({...p, [k]:v}));

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const addIngredient = () => {
    setForm(p => ({...p, ingredients: [...p.ingredients, '']}));
  };

  const removeIngredient = (idx: number) => {
    setForm(p => ({...p, ingredients: p.ingredients.filter((_, i) => i !== idx)}));
  };

  const updateIngredient = (idx: number, val: string) => {
    setForm(p => ({...p, ingredients: p.ingredients.map((ing, i) => i === idx ? val : ing)}));
  };

  const addInstruction = () => {
    setForm(p => ({...p, instructions: [...p.instructions, '']}));
  };

  const removeInstruction = (idx: number) => {
    setForm(p => ({...p, instructions: p.instructions.filter((_, i) => i !== idx)}));
  };

  const updateInstruction = (idx: number, val: string) => {
    setForm(p => ({...p, instructions: p.instructions.map((ins, i) => i === idx ? val : ins)}));
  };

  const updateNutrition = (field: keyof NutritionData, value: any) => {
    setNutrition(p => ({...p, [field]: value}));
  };

  const submit = async () => {
    if (!user || !appUser) return;
    
    const validIngredients = form.ingredients.filter(Boolean);
    const validInstructions = form.instructions.filter(Boolean);
    
    if (!form.name.trim() || validIngredients.length === 0 || validInstructions.length === 0) {
      setErrMsg('Name, at least one ingredient, and at least one instruction step are required.'); 
      setStatus('err'); 
      return;
    }
    
    setLoading(true); setStatus('idle');
    try {
      let imageUrl = '';
      if (file) imageUrl = await uploadRecipeImage(file, user.id);
      
      await addRecipe({
        name: form.name.trim(),
        ingredients: validIngredients,
        instructions: validInstructions,
        cookingTime: form.cookingTime,
        category: form.category,
        difficulty: form.difficulty as Recipe['difficulty'],
        imageUrl,
        authorId: user.id,
        authorName: appUser.name,
        nutrition: nutrition,
        dietaryType: form.dietaryType,
      });
      
      await refreshUser();
      setForm(INIT); setFile(null); setPreview(''); setNutrition(createEmptyNutrition()); setShowNutritionForm(false);
      setStatus('ok'); setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setErrMsg('Upload failed. Please check your Supabase and Cloudinary configuration.'); setStatus('err');
    }
    setLoading(false);
  };

  if (!user) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-[#E8F5E9] rounded-3xl flex items-center justify-center mx-auto mb-5">
        <ChefHat size={36} className="text-[#4CAF50]" />
      </div>
      <h2 className="font-display text-3xl font-bold text-[#1B3A1F] mb-3">{t('uploadRecipe')}</h2>
      <p className="text-[#5C7A61] mb-7 text-sm">Sign in to upload recipes and earn <span className="text-[#4CAF50] font-semibold">+10 points</span>!</p>
      <button onClick={signInWithGoogle} className="green-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
        {t('signInGoogle')}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-[#1B3A1F]">{t('uploadRecipe')}</h2>
        <p className="text-sm text-[#5C7A61] mt-1">Share your creation • earn <span className="text-[#4CAF50] font-semibold">+10 points</span></p>
      </div>

      {status==='ok' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium anim-scale">
          <CheckCircle size={16} /> {t('uploadSuccess')} {t('addedPoints')} 🎉
        </div>
      )}
      {status==='err' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm anim-scale">
          <AlertCircle size={16} /> {errMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column — form */}
        <div className="space-y-5">
          {/* Image */}
          <div onClick={() => fileRef.current?.click()}
            className="relative border-2 border-dashed border-[#A5D6A7] rounded-2xl overflow-hidden cursor-pointer hover:border-[#4CAF50] hover:bg-[#F1F8F4] transition-all group"
            style={{minHeight:160}}>
            {preview ? (
              <div className="relative h-44">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">Click to change</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center">
                  <ImagePlus size={22} className="text-[#4CAF50]" />
                </div>
                <p className="text-sm font-semibold text-[#2E7D32]">Drop your photo here</p>
                <p className="text-xs text-[#5C7A61]">PNG or JPG · max 10 MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">{t('recipeName')} *</label>
            <input value={form.name} onChange={e=>set('name',e.target.value)}
              placeholder="e.g. Creamy Avocado Pasta"
              className="w-full bg-white border border-[#C8E6C9] rounded-xl px-4 py-3 text-sm text-[#1B3A1F]" />
          </div>

          {/* Category with emoji */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">{t('category')} *</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.filter(c=>c!=='All').map(c => (
                <button
                  key={c}
                  onClick={() => set('category', c)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    form.category === c 
                      ? 'bg-[#E8F5E9] border-[#4CAF50]' 
                      : 'bg-white border-[#C8E6C9] hover:border-[#4CAF50]'
                  }`}
                >
                  <span className="text-2xl">{CATEGORY_EMOJIS[c] || '🍳'}</span>
                  <span className="text-[10px] font-bold text-[#2E7D32] text-center">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">Dietary Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {DIETARY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('dietaryType', opt.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    form.dietaryType === opt.value 
                      ? 'bg-[#E8F5E9] border-[#4CAF50]' 
                      : 'bg-white border-[#C8E6C9] hover:border-[#4CAF50]'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px] font-bold text-[#2E7D32] text-center">{t(opt.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty / Time */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t('difficulty'), el: <select value={form.difficulty} onChange={e=>set('difficulty',e.target.value)} className="w-full bg-white border border-[#C8E6C9] rounded-xl px-2 py-2.5 text-xs text-[#1B3A1F]"><option>Easy</option><option>Medium</option><option>Hard</option></select> },
              { label: t('cookTime'),   el: <input type="number" min={5} max={480} value={form.cookingTime} onChange={e=>set('cookingTime',+e.target.value)} className="w-full bg-white border border-[#C8E6C9] rounded-xl px-2 py-2.5 text-xs text-[#1B3A1F]" /> },
            ].map(({label,el}) => (
              <div key={label} className="space-y-1"><label className="text-[10px] font-semibold text-[#2E7D32] uppercase">{label}</label>{el}</div>
            ))}
          </div>

          {/* Ingredients - Step by step */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">Ingredients *</label>
              <button 
                onClick={addIngredient}
                className="flex items-center gap-1 text-xs text-[#4CAF50] font-semibold hover:text-[#2E7D32] transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-[#5C7A61] w-6 text-center">{idx + 1}.</span>
                  <input
                    value={ing}
                    onChange={e => updateIngredient(idx, e.target.value)}
                    placeholder={`e.g. 2 cups flour`}
                    className="flex-1 bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]"
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(idx)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions - Step by step */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">Instructions *</label>
              <button 
                onClick={addInstruction}
                className="flex items-center gap-1 text-xs text-[#4CAF50] font-semibold hover:text-[#2E7D32] transition-colors"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {form.instructions.map((ins, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs font-bold text-[#5C7A61] w-6 text-center mt-2.5">Step {idx + 1}</span>
                  <textarea
                    value={ins}
                    onChange={e => updateInstruction(idx, e.target.value)}
                    placeholder={`Step ${idx + 1}: Describe what to do...`}
                    rows={2}
                    className="flex-1 bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F] resize-none"
                  />
                  {form.instructions.length > 1 && (
                    <button
                      onClick={() => removeInstruction(idx)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 mt-2.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Nutrition Form */}
          <button onClick={() => setShowNutritionForm(!showNutritionForm)}
            className="w-full flex items-center justify-center gap-2 bg-[#F1F8F4] border-2 border-[#A5D6A7] text-[#2E7D32] py-3 rounded-xl font-semibold text-sm hover:border-[#4CAF50] hover:bg-[#E8F5E9] transition-all">
            {showNutritionForm ? '✕ Hide' : '+ Add'} Nutrition Info
          </button>

          {/* Submit */}
          <button onClick={submit} disabled={loading}
            className="w-full green-gradient text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-green-300/30 hover:scale-[1.01] active:scale-100 transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" />{t('uploading')}</> : t('submit')}
          </button>
        </div>

        {/* Right column — nutrition */}
        <div>
          {showNutritionForm ? (
            <div className="bg-white rounded-2xl border border-[#E8F5E9] p-5 space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="font-bold text-[#1B3A1F] text-sm">📊 Nutrition Information (per serving)</h3>
              
              {/* Calories */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Calories (kcal)</label>
                <input type="number" min="0" value={nutrition.calories} onChange={e => updateNutrition('calories', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Protein */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Protein (g)</label>
                <input type="number" min="0" step="0.1" value={nutrition.protein} onChange={e => updateNutrition('protein', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Fat */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Fat (g)</label>
                <input type="number" min="0" step="0.1" value={nutrition.fat} onChange={e => updateNutrition('fat', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Carbs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Carbs (g)</label>
                <input type="number" min="0" step="0.1" value={nutrition.carbs} onChange={e => updateNutrition('carbs', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Sugar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Sugar (g)</label>
                <input type="number" min="0" step="0.1" value={nutrition.sugar} onChange={e => updateNutrition('sugar', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Fiber */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Fiber (g)</label>
                <input type="number" min="0" step="0.1" value={nutrition.fiber} onChange={e => updateNutrition('fiber', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Sodium */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Sodium (mg)</label>
                <input type="number" min="0" value={nutrition.sodium} onChange={e => updateNutrition('sodium', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Servings */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Servings</label>
                <input type="number" min="1" value={nutrition.servings} onChange={e => updateNutrition('servings', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Health Score */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Health Score (1-10)</label>
                <input type="number" min="1" max="10" value={nutrition.healthScore} onChange={e => updateNutrition('healthScore', +e.target.value)}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F]" />
              </div>

              {/* Health Tip */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E7D32] uppercase">Health Tip</label>
                <textarea value={nutrition.healthTip} onChange={e => updateNutrition('healthTip', e.target.value)}
                  placeholder="e.g. Rich in protein and fiber..."
                  rows={2}
                  className="w-full bg-white border border-[#C8E6C9] rounded-lg px-3 py-2 text-sm text-[#1B3A1F] resize-none" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#C8E6C9] h-full flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#1B3A1F] mb-2">Nutrition Information</h3>
              <p className="text-xs text-[#5C7A61] leading-relaxed">
                Click <strong className="text-[#4CAF50]">"+ Add Nutrition Info"</strong><br/>
                to enter calories, macros, and other<br/>
                nutritional details for your recipe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
