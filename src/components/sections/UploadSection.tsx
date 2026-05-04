'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { addRecipe, uploadRecipeImage, CATEGORIES, Recipe } from '@/services/recipes';

type FormData = {
  name: string;
  ingredients: string;
  instructions: string;
  cookingTime: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const INITIAL: FormData = {
  name: '',
  ingredients: '',
  instructions: '',
  cookingTime: 30,
  category: 'Dinner',
  difficulty: 'Easy',
};

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

  const handleSubmit = async () => {
    if (!user || !appUser) return;
    if (!form.name.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadRecipeImage(imageFile, user.uid);
      }
      const recipe: Omit<Recipe, 'id' | 'createdAt' | 'ratingTotal' | 'ratingCount' | 'usersWhoRated'> = {
        name: form.name.trim(),
        ingredients: form.ingredients.split('\n').filter(Boolean),
        instructions: form.instructions.trim(),
        cookingTime: form.cookingTime,
        category: form.category,
        difficulty: form.difficulty,
        imageUrl,
        authorId: user.uid,
        authorName: appUser.name,
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

          {/* Row: category, difficulty, time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl px-3 py-3 text-sm text-[#1B3A1F]"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
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
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">
              Ingredients * <span className="font-normal text-[#5C7A61]">(one per line)</span>
            </label>
            <textarea
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              placeholder={"2 cups flour\n1 tsp salt\n3 eggs"}
              rows={5}
              className="w-full bg-white border border-[#C8E6C9] rounded-xl px-4 py-3 text-sm text-[#1B3A1F] resize-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-[#2E7D32] mb-1.5">Instructions *</label>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              placeholder="Describe the cooking steps in detail..."
              rows={6}
              className="w-full bg-white border border-[#C8E6C9] rounded-xl px-4 py-3 text-sm text-[#1B3A1F] resize-none"
            />
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
