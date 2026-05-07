import { supabase } from '@/lib/supabase';
import type { NutritionData } from './nutrition';

export interface Recipe {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string | string[];
  cookingTime: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  ratingTotal: number;
  ratingCount: number;
  usersWhoRated: string[];
  nutrition?: NutritionData;
  dietaryType?: 'veg' | 'non-veg' | 'vegan';
}

export const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snack','Vegan','Quick','Smoothie'];

export async function uploadRecipeImage(file: File, userId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  
  const res = await fetch('/api/upload', { 
    method: 'POST', 
    body: formData 
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload image');
  }
  
  const data = await res.json();
  return data.url;
}

export async function addRecipe(
  recipe: Omit<Recipe, 'id'|'createdAt'|'ratingTotal'|'ratingCount'|'usersWhoRated'>
): Promise<string> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cooking_time: recipe.cookingTime,
      category: recipe.category,
      difficulty: recipe.difficulty,
      image_url: recipe.imageUrl,
      author_id: recipe.authorId,
      author_name: recipe.authorName,
      rating_total: 0,
      rating_count: 0,
      users_who_rated: [],
      nutrition: recipe.nutrition,
      dietary_type: recipe.dietaryType || 'veg',
    })
    .select()
    .single();

  if (error) throw error;

  // Increment user points
  const { data: userData } = await supabase
    .from('users')
    .select('points')
    .eq('id', recipe.authorId)
    .single();
  
  if (userData) {
    await supabase
      .from('users')
      .update({ points: (userData.points || 0) + 10 })
      .eq('id', recipe.authorId);
  }

  return data.id;
}

export async function rateRecipe(recipeId: string, userId: string, rating: number): Promise<void> {
  const { data: recipe } = await supabase
    .from('recipes')
    .select('rating_total, rating_count, users_who_rated')
    .eq('id', recipeId)
    .single();

  if (!recipe) return;

  const usersWhoRated = recipe.users_who_rated || [];
  if (usersWhoRated.includes(userId)) return;

  await supabase
    .from('recipes')
    .update({
      rating_total: (recipe.rating_total || 0) + rating,
      rating_count: (recipe.rating_count || 0) + 1,
      users_who_rated: [...usersWhoRated, userId],
    })
    .eq('id', recipeId);

  // Award points to user for rating
  const { data: userData } = await supabase
    .from('users')
    .select('points')
    .eq('id', userId)
    .single();
  
  if (userData) {
    await supabase
      .from('users')
      .update({ points: (userData.points || 0) + 1 })
      .eq('id', userId);
  }
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await supabase.from('recipes').delete().eq('id', recipeId);
}

export async function getRecipe(recipeId: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    ingredients: data.ingredients,
    instructions: data.instructions,
    cookingTime: data.cooking_time,
    category: data.category,
    difficulty: data.difficulty,
    imageUrl: data.image_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: data.created_at,
    ratingTotal: data.rating_total,
    ratingCount: data.rating_count,
    usersWhoRated: data.users_who_rated || [],
    nutrition: data.nutrition,
    dietaryType: data.dietary_type || 'veg',
  };
}

export function subscribeToRecipes(callback: (recipes: Recipe[]) => void) {
  // Initial fetch
  supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) {
        callback(data.map(mapRecipe));
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('recipes_changes')
    .on('postgres_changes', { event: '*', table: 'recipes', schema: 'public' }, async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        callback(data.map(mapRecipe));
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapRecipe(data: any): Recipe {
  return {
    id: data.id,
    name: data.name,
    ingredients: data.ingredients,
    instructions: data.instructions,
    cookingTime: data.cooking_time,
    category: data.category,
    difficulty: data.difficulty,
    imageUrl: data.image_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: data.created_at,
    ratingTotal: data.rating_total,
    ratingCount: data.rating_count,
    usersWhoRated: data.users_who_rated || [],
    nutrition: data.nutrition,
    dietaryType: data.dietary_type || 'veg',
  };
}

export async function getRecipesByAuthor(authorId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapRecipe);
}

export function avgRating(recipe: Recipe): number {
  if (!recipe.ratingCount) return 0;
  return Math.round((recipe.ratingTotal / recipe.ratingCount) * 10) / 10;
}
