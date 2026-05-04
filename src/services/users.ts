import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  points: number;
  favorites: string[];
  createdAt?: unknown;
}

// Create or update user doc on login
export async function upsertUser(user: Omit<AppUser, 'points' | 'favorites'>): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      ...user,
      points: 0,
      favorites: [],
      createdAt: new Date().toISOString(),
    });
  } else {
    // Update name/photo in case changed
    await updateDoc(userRef, { name: user.name, photoURL: user.photoURL, email: user.email });
  }
}

// Get user
export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
}

// Toggle favorite
export async function toggleFavorite(uid: string, recipeId: string, isFav: boolean): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    favorites: isFav ? arrayRemove(recipeId) : arrayUnion(recipeId),
  });
}

// Leaderboard
export async function getLeaderboard(count = 10): Promise<AppUser[]> {
  const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as AppUser);
}
