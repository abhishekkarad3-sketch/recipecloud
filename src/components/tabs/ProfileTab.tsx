'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChefHat, Trash2, Star, Clock, Heart, Trophy, BookOpen, X, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { getRecipesByAuthor, deleteRecipe, Recipe, avgRating, updateRecipe, uploadRecipeImage, CATEGORIES } from '@/services/recipes';
import NutritionPanel from '@/components/NutritionPanel';
import { parseLinksInText } from '@/utils/linkParser';

type Tab = 'recipes' | 'favorites';

export default function ProfileTab() {
  const { user, appUser, refreshUser, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<Tab>('recipes');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    gender: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeFormData, setRecipeFormData] = useState<Partial<Recipe>>({});
  const [recipeImageFile, setRecipeImageFile] = useState<File | null>(null);
  const [recipeImagePreview, setRecipeImagePreview] = useState('');
  const [savingRecipe, setSavingRecipe] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getRecipesByAuthor(user.id).then(data => { setMyRecipes(data); setLoading(false); });
  }, [user]);

  useEffect(() => {
    if (appUser && isEditingProfile) {
      setEditFormData({
        name: appUser.name || '',
        bio: appUser.bio || '',
        gender: appUser.gender || '',
      });
      setAvatarPreview(appUser.avatarUrl || user?.user_metadata?.avatar_url || '');
    }
  }, [isEditingProfile, appUser, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      let avatarUrl = appUser?.avatarUrl;
      
      // Upload avatar if changed
      if (avatarFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', avatarFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.url;
      }

      const { updateUserProfile } = await import('@/services/users');
      await updateUserProfile(user.id, {
        name: editFormData.name,
        bio: editFormData.bio,
        gender: editFormData.gender,
        avatarUrl,
      });

      await refreshUser();
      setIsEditingProfile(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this recipe?')) return;
    await deleteRecipe(id);
    setMyRecipes(prev => prev.filter(r => r.id !== id));
  };

  const startEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setRecipeFormData({
      name: recipe.name,
      ingredients: [...recipe.ingredients],
      instructions: Array.isArray(recipe.instructions) ? [...recipe.instructions] : [recipe.instructions],
      cookingTime: recipe.cookingTime,
      category: recipe.category,
      difficulty: recipe.difficulty,
      dietaryType: recipe.dietaryType,
    });
    setRecipeImagePreview(recipe.imageUrl);
    setRecipeImageFile(null);
  };

  const handleRecipeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecipeImageFile(file);
      setRecipeImagePreview(URL.createObjectURL(file));
    }
  };

  const addStep = () => {
    setRecipeFormData(p => ({
      ...p,
      instructions: Array.isArray(p.instructions) ? [...p.instructions, ''] : [...(p.instructions as any), '']
    }));
  };

  const removeStep = (idx: number) => {
    setRecipeFormData(p => ({
      ...p,
      instructions: Array.isArray(p.instructions) ? p.instructions.filter((_, i) => i !== idx) : []
    }));
  };

  const updateStep = (idx: number, val: string) => {
    setRecipeFormData(p => ({
      ...p,
      instructions: Array.isArray(p.instructions) ? p.instructions.map((ins, i) => i === idx ? val : ins) : [val]
    }));
  };

  const handleSaveRecipe = async () => {
    if (!editingRecipe || !user) return;
    setSavingRecipe(true);
    try {
      let imageUrl = editingRecipe.imageUrl;
      if (recipeImageFile) {
        imageUrl = await uploadRecipeImage(recipeImageFile, user.id);
      }

      const updates = {
        ...recipeFormData,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
        // Map camelCase to snake_case for DB
        cooking_time: recipeFormData.cookingTime,
        dietary_type: recipeFormData.dietaryType,
      };
      
      // Remove camelCase fields before sending to Supabase
      delete (updates as any).cookingTime;
      delete (updates as any).dietaryType;

      await updateRecipe(editingRecipe.id!, updates);
      
      // Refresh recipes
      const updatedRecipes = await getRecipesByAuthor(user.id);
      setMyRecipes(updatedRecipes);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      setSavingRecipe(false);
    }
  };

  if (!user || !appUser) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-[#E8F5E9] rounded-3xl flex items-center justify-center mx-auto mb-5">
        <ChefHat size={36} className="text-[#4CAF50]" />
      </div>
      <h2 className="font-display text-3xl font-bold text-[#1B3A1F] mb-3">{t('myProfile')}</h2>
      <p className="text-[#5C7A61] mb-7 text-sm">Sign in to see your profile, recipes and favorites.</p>
      <button onClick={signInWithGoogle} className="green-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
        {t('signInGoogle')}
      </button>
    </div>
  );

  const favCount = appUser.favorites?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h2 className="font-display text-3xl font-bold text-[#1B3A1F]">{t('myProfile')}</h2>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E8F5E9] shadow-sm overflow-hidden">
        {/* Green banner */}
        <div className="green-gradient h-20 relative">
          <div className="absolute -bottom-8 left-6">
            {user.user_metadata?.avatar_url ? (
              <Image src={user.user_metadata.avatar_url} alt="" width={64} height={64}
                className="rounded-2xl ring-4 ring-white shadow-lg" unoptimized />
            ) : (
              <div className="w-16 h-16 green-gradient rounded-2xl ring-4 ring-white flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {appUser.name?.[0]||'U'}
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 pb-6 px-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1B3A1F]">{appUser.name}</h3>
              <p className="text-sm text-[#5C7A61]">{appUser.email}</p>
              {appUser.gender && <p className="text-xs text-[#5C7A61] mt-1">👤 {appUser.gender}</p>}
              {appUser.bio && (
                <p className="text-sm text-[#5C7A61] mt-2 italic break-words">
                  "
                  {parseLinksInText(appUser.bio).map((part, idx) =>
                    typeof part === 'string' ? (
                      <span key={idx}>{part}</span>
                    ) : (
                      <a
                        key={idx}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline hover:underline"
                      >
                        {part.label}
                      </a>
                    )
                  )}
                  "
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Trophy size={14} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{appUser.points} pts</span>
            </div>
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="mt-4 w-full bg-[#4CAF50] text-white py-2 rounded-lg hover:bg-[#45a049] font-semibold text-sm"
            >
              ✏️ Edit Profile
            </button>
          )}

          {isEditingProfile && (
            <div className="mt-4 space-y-4 bg-[#F1F8F4] p-4 rounded-xl border border-[#E8F5E9]">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-[#1B3A1F] mb-2">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full border border-[#E8F5E9] rounded-lg p-2"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1B3A1F] mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full border border-[#E8F5E9] rounded-lg p-2"
                />
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1B3A1F] mb-2">Gender</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  className="w-full border border-[#E8F5E9] rounded-lg p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-[#1B3A1F] mb-2">Bio/About</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full border border-[#E8F5E9] rounded-lg p-2 h-20 resize-none"
                />
              </div>

              {/* Save/Cancel */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg hover:bg-[#45a049] disabled:opacity-50 font-semibold text-sm"
                >
                  {savingProfile ? 'Saving...' : '✓ Save Profile'}
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 font-semibold text-sm"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: BookOpen, label: t('recipes'),   val: myRecipes.length, color: 'text-[#4CAF50]', bg: 'bg-[#E8F5E9]' },
              { icon: Trophy,   label: t('points'),    val: appUser.points,   color: 'text-amber-500',  bg: 'bg-amber-50'  },
              { icon: Heart,    label: t('favorites'), val: favCount,          color: 'text-red-400',    bg: 'bg-red-50'    },
            ].map(({ icon: Icon, label, val, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 text-center border border-white`}>
                <Icon size={18} className={`${color} mx-auto mb-1`} />
                <div className={`font-display text-2xl font-black ${color}`}>{val}</div>
                <div className="text-xs text-[#5C7A61] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-[#E8F5E9] rounded-2xl overflow-hidden shadow-sm">
        {([['recipes', BookOpen, `${t('myRecipes')} (${myRecipes.length})`],
           ['favorites', Heart, `${t('favorites')} (${favCount})`]] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              tab === id ? 'bg-[#4CAF50] text-white' : 'text-[#5C7A61] hover:bg-[#F1F8F4]'
            }`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#121A14] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#E8F5E9] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1B3A1F]">Edit Recipe</h3>
              <button onClick={() => setEditingRecipe(null)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Image Edit */}
              <div className="relative h-40 bg-gray-100 rounded-2xl overflow-hidden group">
                <Image src={recipeImagePreview} alt="" fill className="object-cover" unoptimized />
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-white font-bold">Change Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleRecipeImageChange} />
                </label>
              </div>

              <input 
                value={recipeFormData.name} 
                onChange={e => setRecipeFormData({...recipeFormData, name: e.target.value})}
                className="w-full p-3 border border-[#E8F5E9] rounded-xl"
                placeholder="Recipe Name"
              />

              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={recipeFormData.category} 
                  onChange={e => setRecipeFormData({...recipeFormData, category: e.target.value})}
                  className="p-3 border border-[#E8F5E9] rounded-xl"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="number" 
                  value={recipeFormData.cookingTime} 
                  onChange={e => setRecipeFormData({...recipeFormData, cookingTime: +e.target.value})}
                  className="p-3 border border-[#E8F5E9] rounded-xl"
                  placeholder="Time (min)"
                />
              </div>

              <textarea 
                value={recipeFormData.ingredients?.join('\n')} 
                onChange={e => setRecipeFormData({...recipeFormData, ingredients: e.target.value.split('\n')})}
                className="w-full p-3 border border-[#E8F5E9] rounded-xl h-32"
                placeholder="Ingredients (one per line)"
              />

              {/* Instructions - Step by step */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#1B3A1F]">Instructions</label>
                  <button 
                    onClick={addStep}
                    className="flex items-center gap-1 text-xs text-[#4CAF50] font-semibold hover:text-[#2E7D32] transition-colors"
                  >
                    <Plus size={14} /> Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {Array.isArray(recipeFormData.instructions) && recipeFormData.instructions.map((ins, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-[#5C7A61] w-12 text-center mt-2.5">Step {idx + 1}</span>
                      <textarea
                        value={ins}
                        onChange={e => updateStep(idx, e.target.value)}
                        placeholder={`Step ${idx + 1}: Describe what to do...`}
                        rows={2}
                        className="flex-1 p-2 border border-[#E8F5E9] rounded-lg text-sm resize-none"
                      />
                      {recipeFormData.instructions && recipeFormData.instructions.length > 1 && (
                        <button
                          onClick={() => removeStep(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 mt-2.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E8F5E9] flex gap-3">
              <button 
                onClick={handleSaveRecipe}
                disabled={savingRecipe}
                className="flex-1 bg-[#4CAF50] text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {savingRecipe ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setEditingRecipe(null)}
                className="flex-1 bg-gray-100 text-[#5C7A61] py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {tab === 'recipes' && (
        loading ? (
          <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-20 rounded-2xl"/>)}</div>
        ) : myRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8F5E9]">
            <ChefHat size={40} className="text-[#A5D6A7] mx-auto mb-3"/>
            <p className="text-[#5C7A61] text-sm">{t('noRecipes')}. Upload your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-2xl border border-[#E8F5E9] shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E8F5E9] shrink-0">
                    {recipe.imageUrl ? (
                      <Image src={recipe.imageUrl} alt={recipe.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ChefHat size={22} className="text-[#A5D6A7]"/></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1B3A1F] truncate">{recipe.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#5C7A61]">
                      <span className="flex items-center gap-1"><Clock size={10}/>{recipe.cookingTime}m</span>
                      <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-medium">{recipe.category}</span>
                      <span className="flex items-center gap-1"><Star size={10} className="text-amber-400"/>{avgRating(recipe)||'—'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEditRecipe(recipe)}
                      className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      ✏️ Edit
                    </button>
                    {recipe.nutrition && (
                      <button onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id!)}
                        className="text-xs font-semibold text-[#4CAF50] bg-[#E8F5E9] px-3 py-1.5 rounded-lg hover:bg-[#C8E6C9] transition-colors">
                        🧪 Nutrition
                      </button>
                    )}
                    <button onClick={() => handleDelete(recipe.id!)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>
                {expanded === recipe.id && (
                  <div className="px-5 pb-5 anim-scale space-y-4">
                    {recipe.nutrition && <NutritionPanel data={recipe.nutrition} perServing />}
                    {recipe.updatedAt && (
                      <p className="text-[10px] text-[#5C7A61] font-medium italic">
                        Updated at: {new Date(recipe.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'favorites' && (
        favCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8F5E9]">
            <Heart size={40} className="text-[#A5D6A7] mx-auto mb-3"/>
            <p className="text-[#5C7A61] text-sm">No favorites yet. Heart recipes you love!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F5E9] p-6 text-center">
            <Heart size={32} className="text-red-400 mx-auto mb-2"/>
            <p className="font-semibold text-[#1B3A1F]">{favCount} favorited recipe{favCount!==1?'s':''}</p>
            <p className="text-xs text-[#5C7A61] mt-1">Find them in the Search tab.</p>
          </div>
        )
      )}
    </div>
  );
}
