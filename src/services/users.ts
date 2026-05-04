import { supabase } from '@/lib/supabase';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  points: number;
  favorites: string[];
  createdAt?: string;
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
      created_at: new Date().toISOString(),
    });
  } else {
    // Update name/photo in case changed
    await supabase
      .from('users')
      .update({
        name: user.name,
        photo_url: user.photoURL,
        email: user.email,
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
    createdAt: data.created_at,
  };
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

// Leaderboard
export async function getLeaderboard(count = 10): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('points', { ascending: false })
    .limit(count);

  if (error || !data) return [];

  return data.map((d) => ({
    uid: d.id,
    name: d.name,
    email: d.email,
    photoURL: d.photo_url,
    points: d.points,
    favorites: d.favorites || [],
    createdAt: d.created_at,
  }));
}
