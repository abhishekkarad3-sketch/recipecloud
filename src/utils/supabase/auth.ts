import { createClient } from './client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipecloud1.onrender.com';

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
    },
  });
  if (error) throw new Error(`Failed to sign in with Google: ${error.message}`);
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Failed to sign out: ${error.message}`);
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error(`Failed to get session: ${error.message}`);
  return session;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Failed to get current user: ${error.message}`);
  return user;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
