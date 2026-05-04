import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDoc, getDocs, query, orderBy, where,
  onSnapshot, serverTimestamp, arrayUnion, increment,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NutritionData } from './nutrition';

export interface Recipe {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: unknown;
  ratingTotal: number;
  ratingCount: number;
  usersWhoRated: string[];
  nutrition?: NutritionData;
}

export const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snack','Vegan','Quick','Smoothie'];

export async function uploadRecipeImage(file: File, _userId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  return data.url;
}

export async function addRecipe(
  recipe: Omit<Recipe, 'id'|'createdAt'|'ratingTotal'|'ratingCount'|'usersWhoRated'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'recipes'), {
    ...recipe,
    createdAt: serverTimestamp(),
    ratingTotal: 0,
    ratingCount: 0,
    usersWhoRated: [],
  });
  await updateDoc(doc(db, 'users', recipe.authorId), { points: increment(10) });
  return docRef.id;
}

export async function rateRecipe(recipeId: string, userId: string, rating: number): Promise<void> {
  await updateDoc(doc(db, 'recipes', recipeId), {
    ratingTotal: increment(rating),
    ratingCount: increment(1),
    usersWhoRated: arrayUnion(userId),
  });
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await deleteDoc(doc(db, 'recipes', recipeId));
}

export async function getRecipe(recipeId: string): Promise<Recipe | null> {
  const snap = await getDoc(doc(db, 'recipes', recipeId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Recipe;
}

export function subscribeToRecipes(callback: (recipes: Recipe[]) => void): Unsubscribe {
  const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe)));
  });
}

export async function getRecipesByAuthor(authorId: string): Promise<Recipe[]> {
  const q = query(
    collection(db, 'recipes'),
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
}

export function avgRating(recipe: Recipe): number {
  if (!recipe.ratingCount) return 0;
  return Math.round((recipe.ratingTotal / recipe.ratingCount) * 10) / 10;
}
