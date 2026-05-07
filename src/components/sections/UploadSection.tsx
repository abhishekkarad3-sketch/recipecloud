'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { addRecipe, uploadRecipeImage, CATEGORIES, Recipe } from '@/services/recipes';

type FormData = {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryType: 'veg' | 'non-veg' | 'vegan';
};

const INITIAL: FormData = {
  name: '',
  ingredients: [],
  instructions: [],
  cookingTime: 30,
  category: 'Dinner',
  difficulty: 'Easy',
  dietaryType: 'veg',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'All': '🍽️',
  'Breakfast': '🍳',
  'Lunch': '🥙',
  'Dinner': '🍽️',
  'Dessert': '🍰',
  'Snack': '🍪',
  'Vegan': '🌱',
  'Quick': '⚡',
  'Smoothie': '🥤',
};

const DIETARY_OPTIONS = [
  { value: 'veg', label: 'Vegetarian', emoji: '🥬' },
  { value: 'non-veg', label: 'Non-Vegetarian', emoji: '🍗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
];

export default function UploadSection() {
  const { user, appUser, refreshUser, signInWithGoogle } = useAuth();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, ''] });
  };

  const handleRemoveIngredient = (idx: number) => {
    setForm({ ...form, ingredients: form.ingredients.filter((_, i) => i !== idx) });
  };

  const handleUpdateIngredient = (idx: number, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[idx] = value;
    setForm({ ...form, ingredients: newIngredients });
  };

  const handleAddInstruction = () => {
    setForm({ ...form, instructions: [...form.instructions, ''] });
  };

  const handleRemoveInstruction = (idx: number) => {
    setForm({ ...form, instructions: form.instructions.filter((_, i) => i !== idx) });
  };

  const handleUpdateInstruction = (idx: number, value: string) => {
    const newInstructions = [...form.instructions];
    newInstructions[idx] = value;
    setForm({ ...form, instructions: newInstructions });
  };

  const handleSubmit = async () => {
    if (!user || !appUser) return;
    if (!form.name.trim() || form.ingredients.some(i => !i.trim()) || form.instructions.some(i => !i.trim())) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadRecipeImage(imageFile, user.id);
      }
      const recipe: Omit<Recipe, 'id' | 'createdAt' | 'ratingTotal' | 'ratingCount' | 'usersWhoRated'> = {
        name: form.name.trim(),
        ingredients: form.ingredients.filter(i => i.trim()),
        instructions: form.instructions.filter(i => i.trim()),
        cookingTime: form.cookingTime,
        category: form.category,
        difficulty: form.difficulty,
        imageUrl,
        authorId: user.id,
        authorName: appUser.name,
        dietaryType: form.dietaryType,
      };
      await addRecipe(recipe);
      await refreshUser();
      setForm(INITIAL);
      setImageFile(null);
      setPreview('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <section id="upload" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📤</div>
          <h2 className="font-display text-4xl font-bold text-[#1B3A1F] mb-4">Share Your Recipe</h2>
          <p className="text-[#5C7A61] mb-8">Sign in to share your culinary creations and earn points!</p>
          <button
            onClick={signInWithGoogle}
            className="green-gradient text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Sign in with Google to Upload
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="upload" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-[#4CAF50] tracking-wide uppercase">Share Your Creation</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1B3A1F] mt-2">Upload Recipe</h2>
          <p className="text-[#5C7A61] mt-3">Earn <span className="text-[#4CAF50] font-semibold">+10 points</span> for each recipe you share!</p>
        </div>

        <div className="bg-[#F1F8F4] rounded-3xl p-6 sm:p-8 space-y-5">
          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 flex items-center gap-2">
              ✅ Recipe uploaded successfully! +10 points awarded 🎉
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          {/* Image upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#A5D6A7] rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#4CAF50] hover:bg-white transition-all overflow-hidden relative"
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover rounded-2xl" />
            ) : (
              <>
                <div className="text-4xl mb-2">📸</div>
                <div className="text-sm text-[#5C7A61]">Click to upload recipe photo</div>
                <div className="text-xs text-[#5C7A61] mt-1">PNG, JPG up to 10MB</div>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Recipe name */}
          <div>
            <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Recipe Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Creamy Avocado Pasta"
              className="w-full bg-white border border-[#C8E6C9] rounded-xl px-4 py-3 text-sm text-[#1B3A1F]"
            />
          </div>

          {/* Row: category, difficulty, time, dietary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl px-3 py-3 text-sm text-[#1B3A1F]"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c}>{`${CATEGORY_EMOJIS[c] || '🍽️'} ${c}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as Recipe['difficulty'] })}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl px-3 py-3 text-sm text-[#1B3A1F]"
              >
                {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Cook Time (min)</label>
              <input
                type="number"
                value={form.cookingTime}
                min={5}
                max={480}
                onChange={(e) => setForm({ ...form, cookingTime: Number(e.target.value) })}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl px-3 py-3 text-sm text-[#1B3A1F]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Dietary Type</label>
              <select
                value={form.dietaryType}
                onChange={(e) => setForm({ ...form, dietaryType: e.target.value as 'veg' | 'non-veg' | 'vegan' })}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl px-3 py-3 text-sm text-[#1B3A1F]"
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{`${opt.emoji} ${opt.label}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ingredients - Step by step */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-[#2E7D32]">Ingredients *</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-xs bg-[#4CAF50] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition-colors"
              >
                + Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {form.ingredients.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-[#C8E6C9] rounded-xl">
                  <p className="text-sm text-[#5C7A61]">No ingredients added yet. Click "Add Ingredient" to start.</p>
                </div>
              ) : (
                form.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleUpdateIngredient(idx, e.target.value)}
                      placeholder={`Ingredient ${idx + 1}`}
                      className="flex-1 bg-white border border-[#C8E6C9] rounded-xl px-3 py-2 text-sm text-[#1B3A1F]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructions - Step by step */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-[#2E7D32]">Instructions *</label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="text-xs bg-[#FF6B6B] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#E63946] transition-colors"
              >
                + Add Step
              </button>
            </div>
            <div className="space-y-2">
              {form.instructions.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-[#C8E6C9] rounded-xl">
                  <p className="text-sm text-[#5C7A61]">No steps added yet. Click "Add Step" to start.</p>
                </div>
              ) : (
                form.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center text-xs font-bold mt-2">
                      {idx + 1}
                    </span>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleUpdateInstruction(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}`}
                      rows={2}
                      className="flex-1 bg-white border border-[#C8E6C9] rounded-xl px-3 py-2 text-sm text-[#1B3A1F] resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 font-bold text-lg mt-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full green-gradient text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-green-300/40 hover:scale-[1.01] active:scale-100 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                Uploading...
              </span>
            ) : '📤 Upload Recipe (+10 pts)'}
          </button>
        </div>
      </div>
    </section>
  );
}
