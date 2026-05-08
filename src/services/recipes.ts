import { supabase } from '@/lib/supabase';
import type { NutritionData } from './nutrition';

export interface Comment {
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  createdAt: string;
}

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
  authorAvatar?: string;
  createdAt: string;
  ratingTotal: number;
  ratingCount: number;
  usersWhoRated: string[];
  comments?: Comment[];
  nutrition?: NutritionData;
  dietaryType?: 'veg' | 'non-veg' | 'vegan';
  updatedAt?: string;
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
      author_avatar: (recipe as any).authorAvatar || null,
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

export async function rateRecipe(
  recipeId: string, 
  userId: string, 
  rating: number, 
  commentText?: string,
  userName?: string,
  userAvatar?: string
): Promise<void> {
  const { data: recipe } = await supabase
    .from('recipes')
    .select('rating_total, rating_count, users_who_rated, comments')
    .eq('id', recipeId)
    .single();

  if (!recipe) return;

  const usersWhoRated = recipe.users_who_rated || [];
  const comments = recipe.comments || [];
  const existingCommentIdx = comments.findIndex((c: any) => c.userId === userId);
  
  let newRatingTotal = recipe.rating_total || 0;
  let newRatingCount = recipe.rating_count || 0;
  let newUsersWhoRated = [...usersWhoRated];
  let newComments = [...comments];

  if (existingCommentIdx > -1) {
    // Update existing rating
    const oldRating = comments[existingCommentIdx].rating;
    newRatingTotal = newRatingTotal - oldRating + rating;
    newComments[existingCommentIdx] = {
      ...newComments[existingCommentIdx],
      rating,
      text: commentText || newComments[existingCommentIdx].text,
      createdAt: new Date().toISOString()
    };
  } else {
    // Add new rating
    newRatingTotal += rating;
    newRatingCount += 1;
    newUsersWhoRated.push(userId);
    newComments.push({
      userId,
      userName: userName || 'Chef',
      userAvatar: userAvatar || '',
      rating,
      text: commentText || '',
      createdAt: new Date().toISOString()
    });

    // Award points only for new ratings
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

  await supabase
    .from('recipes')
    .update({
      rating_total: newRatingTotal,
      rating_count: newRatingCount,
      users_who_rated: newUsersWhoRated,
      comments: newComments
    })
    .eq('id', recipeId);
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await supabase.from('recipes').delete().eq('id', recipeId);
}

export async function updateRecipe(recipeId: string, updates: any): Promise<void> {
  await supabase.from('recipes').update(updates).eq('id', recipeId);
}

export async function deleteReview(recipeId: string, userId: string): Promise<void> {
  const { data: recipe } = await supabase
    .from('recipes')
    .select('rating_total, rating_count, users_who_rated, comments')
    .eq('id', recipeId)
    .single();

  if (!recipe) return;

  const comments = recipe.comments || [];
  const commentIdx = comments.findIndex((c: any) => c.userId === userId);
  
  if (commentIdx === -1) return;

  const deletedComment = comments[commentIdx];
  const newComments = comments.filter((c: any) => c.userId !== userId);
  const newUsersWhoRated = (recipe.users_who_rated || []).filter((id: string) => id !== userId);
  
  const newRatingTotal = (recipe.rating_total || 0) - deletedComment.rating;
  const newRatingCount = Math.max(0, (recipe.rating_count || 0) - 1);

  await supabase
    .from('recipes')
    .update({
      rating_total: newRatingTotal,
      rating_count: newRatingCount,
      users_who_rated: newUsersWhoRated,
      comments: newComments
    })
    .eq('id', recipeId);
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
    authorAvatar: data.author_avatar,
    createdAt: data.created_at,
    ratingTotal: data.rating_total,
    ratingCount: data.rating_count,
    usersWhoRated: data.users_who_rated || [],
    nutrition: data.nutrition,
    dietaryType: data.dietary_type || 'veg',
    updatedAt: data.updated_at,
  };
}

export function subscribeToRecipes(callback: (recipes: Recipe[]) => void) {
  // Initial fetch
  supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching recipes:', error);
        callback([]); // Resolve loading state with empty array on error
        return;
      }
      if (data) {
        callback(data.map(mapRecipe));
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('recipes_changes')
    .on('postgres_changes', { event: '*', table: 'recipes', schema: 'public' }, async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching recipes on change:', error);
        return;
      }

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
    authorAvatar: data.author_avatar,
    createdAt: data.created_at,
    ratingTotal: data.rating_total,
    ratingCount: data.rating_count,
    usersWhoRated: data.users_who_rated || [],
    comments: data.comments || [],
    nutrition: data.nutrition,
    dietaryType: data.dietary_type || 'veg',
    updatedAt: data.updated_at,
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
