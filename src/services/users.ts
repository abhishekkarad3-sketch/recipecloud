import { supabase } from '@/lib/supabase';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  points: number;
  favorites: string[];
  bookmarks?: string[];
  createdAt?: string;
  gender?: string;
  bio?: string;
  avatarUrl?: string;
}

// Create or update user doc on login
export async function upsertUser(user: Omit<AppUser, 'points' | 'favorites'>): Promise<void> {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.uid)
    .single();

  if (!existingUser) {
    await supabase.from('users').insert({
      id: user.uid,
      name: user.name,
      email: user.email,
      photo_url: user.photoURL,
      points: 0,
      favorites: [],
      bookmarks: [],
      created_at: new Date().toISOString(),
      gender: user.gender || null,
      bio: user.bio || null,
      avatar_url: user.avatarUrl || null,
    });
  } else {
    // Update name/photo in case changed
    await supabase
      .from('users')
      .update({
        name: user.name,
        photo_url: user.photoURL,
        email: user.email,
        gender: user.gender,
        bio: user.bio,
        avatar_url: user.avatarUrl,
      })
      .eq('id', user.uid);
  }
}

// Get user
export async function getUser(uid: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (error || !data) return null;

  return {
    uid: data.id,
    name: data.name,
    email: data.email,
    photoURL: data.photo_url,
    points: data.points,
    favorites: data.favorites || [],
    bookmarks: data.bookmarks || [],
    createdAt: data.created_at,
    gender: data.gender,
    bio: data.bio,
    avatarUrl: data.avatar_url,
  };
}

// Update user profile
export async function updateUserProfile(uid: string, updates: Partial<AppUser>): Promise<void> {
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.gender !== undefined) updateData.gender = updates.gender;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
  if (updates.photoURL) updateData.photo_url = updates.photoURL;

  await supabase.from('users').update(updateData).eq('id', uid);
}

// Toggle favorite
export async function toggleFavorite(uid: string, recipeId: string, isFav: boolean): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('favorites')
    .eq('id', uid)
    .single();

  if (!user) return;

  let newFavorites = user.favorites || [];
  if (isFav) {
    newFavorites = newFavorites.filter((id: string) => id !== recipeId);
  } else {
    if (!newFavorites.includes(recipeId)) {
      newFavorites.push(recipeId);
    }
  }

  await supabase
    .from('users')
    .update({ favorites: newFavorites })
    .eq('id', uid);
}

// Toggle bookmark
export async function toggleBookmark(uid: string, recipeId: string, isBookmarked: boolean): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('bookmarks')
    .eq('id', uid)
    .single();

  if (!user) return;

  let newBookmarks = user.bookmarks || [];
  if (isBookmarked) {
    newBookmarks = newBookmarks.filter((id: string) => id !== recipeId);
  } else {
    if (!newBookmarks.includes(recipeId)) {
      newBookmarks.push(recipeId);
    }
  }

  await supabase
    .from('users')
    .update({ bookmarks: newBookmarks })
    .eq('id', uid);
}

// Get user's recipes
export async function getUserRecipes(uid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('author_id', uid)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

// Delete recipe
export async function deleteRecipe(recipeId: string): Promise<void> {
  await supabase.from('recipes').delete().eq('id', recipeId);
}

// Update recipe
export async function updateRecipe(recipeId: string, updates: any): Promise<void> {
  await supabase.from('recipes').update(updates).eq('id', recipeId);
}

// Leaderboard
export async function getLeaderboard(count = 10): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('points', { ascending: false })
    .limit(count);

  if (error || !data) return [];

  return data.map(mapUser);
}

// Search users
export async function searchUsers(query: string): Promise<AppUser[]> {
  if (!query.trim()) return [];
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(20);

  if (error || !data) return [];
  return data.map(mapUser);
}

function mapUser(d: any): AppUser {
  return {
    uid: d.id,
    name: d.name,
    email: d.email,
    photoURL: d.photo_url,
    points: d.points,
    favorites: d.favorites || [],
    bookmarks: d.bookmarks || [],
    createdAt: d.created_at,
    gender: d.gender,
    bio: d.bio,
    avatarUrl: d.avatar_url,
  };
}
