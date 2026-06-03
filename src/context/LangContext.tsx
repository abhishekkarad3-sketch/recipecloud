'use client';
import React, { createContext, useContext, useState } from 'react';

export type LangCode = 'en' | 'hi' | 'ar' | 'fr' | 'es';

export const LANGUAGES: { code: LangCode; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी',    flag: '🇮🇳', dir: 'ltr' },
  { code: 'ar', label: 'العربية',   flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr' },
];

type T = Record<string, string>;

const translations: Record<LangCode, T> = {
  en: {
    appName: 'RecipeCloud',
    tagline: 'Your Kitchen, Amplified',
    home: 'Home', search: 'Search', upload: 'Upload', profile: 'Profile', leaderboard: 'Leaderboard',
    featuredRecipes: 'Featured Recipes', viewAll: 'View all', getStarted: 'Get Started',
    joinFree: 'Join Free', shareRecipe: 'Share Recipe', browseCategories: 'Browse Categories',
    uploadRecipe: 'Upload Recipe', recipeName: 'Recipe Name', category: 'Category',
    difficulty: 'Difficulty', cookTime: 'Cook Time (min)', ingredients: 'Ingredients',
    instructions: 'Instructions', submit: 'Upload Recipe (+10 pts)', uploading: 'Uploading…',
    nutrition: 'Nutrition Information', calories: 'Calories', protein: 'Protein', fat: 'Fat',
    carbs: 'Carbs', sugar: 'Sugar', fiber: 'Fiber', vitamins: 'Vitamins',
    analyzeNutrition: 'Add Nutrition Info', analyzing: 'Analyzing…',
    myProfile: 'My Profile', myRecipes: 'My Recipes', favorites: 'Favorites',
    points: 'Points', recipes: 'Recipes', signIn: 'Sign In', signOut: 'Sign Out',
    signInGoogle: 'Sign in with Google', delete: 'Delete', noRecipes: 'No recipes yet',
    cloudSync: 'Cloud Sync', language: 'Language', ranks: 'Ranks', perServing: 'per serving',
    addedPoints: '+10 points awarded', uploadSuccess: 'Recipe uploaded successfully!',
    minRead: 'min', easyLabel: 'Easy', mediumLabel: 'Medium', hardLabel: 'Hard',
    searchPlaceholder: 'Search recipes, ingredients…', filters: 'Filters',
    maxTime: 'Max Cook Time', sortNewest: 'Newest', sortTop: 'Top Rated',
    noResults: 'Nothing found', clearFilters: 'Clear filters',
    heroSubtitle: 'Explore, share, and connect with fellow food enthusiasts in a global community.',
    joinCommunity: 'Join the Community',
    joinDesc: 'Sign in to upload recipes, rate dishes, and earn points.',
    vegetarian: 'Vegetarian',
    nonVeg: 'Non-Vegetarian',
    vegan: 'Vegan',
  },
  hi: {
    appName: 'रेसिपीक्लाउड',
    tagline: 'आपकी रसोई, क्लाउड में',
    home: 'होम', search: 'खोजें', upload: 'अपलोड', profile: 'प्रोफ़ाइल', leaderboard: 'लीडरबोर्ड',
    featuredRecipes: 'चुनिंदा रेसिपी', viewAll: 'सभी देखें', getStarted: 'शुरू करें',
    joinFree: 'मुफ्त जुड़ें', shareRecipe: 'रेसिपी शेयर करें', browseCategories: 'श्रेणियाँ देखें',
    uploadRecipe: 'रेसिपी अपलोड करें', recipeName: 'रेसिपी का नाम', category: 'श्रेणी',
    difficulty: 'कठिनाई', cookTime: 'पकाने का समय (मिनट)', ingredients: 'सामग्री',
    instructions: 'निर्देश', submit: 'रेसिपी अपलोड करें (+10 पॉइंट)', uploading: 'अपलोड हो रहा है…',
    nutrition: 'पोषण जानकारी', calories: 'कैलोरी', protein: 'प्रोटीन', fat: 'वसा',
    carbs: 'कार्बोहाइड्रेट', sugar: 'चीनी', fiber: 'फाइबर', vitamins: 'विटामिन',
    analyzeNutrition: 'पोषण जानकारी जोड़ें', analyzing: 'विश्लेषण हो रहा है…',
    myProfile: 'मेरी प्रोफ़ाइल', myRecipes: 'मेरी रेसिपी', favorites: 'पसंदीदा',
    points: 'पॉइंट', recipes: 'रेसिपी', signIn: 'साइन इन', signOut: 'साइन आउट',
    signInGoogle: 'Google से साइन इन करें', delete: 'हटाएं', noRecipes: 'अभी कोई रेसिपी नहीं',
    cloudSync: 'क्लाउड सिंक', language: 'भाषा', ranks: 'रैंक', perServing: 'प्रति सर्विंग',
    addedPoints: '+10 पॉइंट मिले', uploadSuccess: 'रेसिपी सफलतापूर्वक अपलोड हुई!',
    minRead: 'मिनट', easyLabel: 'आसान', mediumLabel: 'मध्यम', hardLabel: 'कठिन',
    searchPlaceholder: 'रेसिपी, सामग्री खोजें…', filters: 'फ़िल्टर',
    maxTime: 'अधिकतम समय', sortNewest: 'नवीनतम', sortTop: 'शीर्ष रेटेड',
    noResults: 'कुछ नहीं मिला',    clearFilters: 'फ़िल्टर हटाएं',
    heroSubtitle: 'दुनिया भर के खाना पसंद करने वालों के साथ व्यंजनों का अन्वेषण करें, साझा करें और उनसे जुड़ें।',
    joinCommunity: 'समुदाय से जुड़ें',    joinDesc: 'रेसिपी अपलोड करें, रेटिंग दें और पॉइंट कमाएं।',
    vegetarian: 'शाकाहारी',
    nonVeg: 'मांसाहारी',
    vegan: 'वीगन',
  },  ar: {
    appName: 'ريسيبي كلاود',
    tagline: 'مطبخك، في السحابة',
    home: 'الرئيسية', search: 'بحث', upload: 'رفع', profile: 'الملف', leaderboard: 'المتصدرون',
    featuredRecipes: 'وصفات مميزة', viewAll: 'عرض الكل', getStarted: 'ابدأ الآن',
    joinFree: 'انضم مجاناً', shareRecipe: 'شارك وصفة', browseCategories: 'تصفح الفئات',
    uploadRecipe: 'رفع وصفة', recipeName: 'اسم الوصفة', category: 'الفئة',
    difficulty: 'الصعوبة', cookTime: 'وقت الطهي (دقائق)', ingredients: 'المكونات',
    instructions: 'التعليمات', submit: 'رفع الوصفة (+10 نقاط)', uploading: 'جارٍ الرفع…',
    nutrition: 'معلومات التغذية', calories: 'سعرات', protein: 'بروتين', fat: 'دهون',
    carbs: 'كربوهيدرات', sugar: 'سكر', fiber: 'ألياف', vitamins: 'فيتامينات',
    analyzeNutrition: 'إضافة معلومات التغذية', analyzing: 'جارٍ التحليل…',
    myProfile: 'ملفي', myRecipes: 'وصفاتي', favorites: 'المفضلة',
    points: 'نقاط', recipes: 'وصفات', signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج',
    signInGoogle: 'الدخول بـ Google', delete: 'حذف', noRecipes: 'لا توجد وصفات بعد',
    cloudSync: 'مزامنة السحابة', language: 'اللغة', ranks: 'الترتيب', perServing: 'لكل وجبة',
    addedPoints: '+10 نقاط', uploadSuccess: 'تم رفع الوصفة بنجاح!',
    minRead: 'دقيقة', easyLabel: 'سهل', mediumLabel: 'متوسط', hardLabel: 'صعب',
    searchPlaceholder: 'ابحث عن وصفات، مكونات…', filters: 'تصفية',
    maxTime: 'الحد الأقصى للوقت', sortNewest: 'الأحدث', sortTop: 'الأعلى تقييماً',
    noResults: 'لم يتم العثور على شيء', clearFilters: 'مسح الفلاتر',
    heroSubtitle: 'استكشف وشارك وتواصل مع زملائك من عشاق الطعام في مجتمع عالمي.',
    joinCommunity: 'انضم إلى المجتمع',    joinDesc: 'سجّل دخولك لرفع الوصفات وكسب النقاط.',
    vegetarian: 'نباتي',
    nonVeg: 'غير نباتي',
    vegan: 'نباتي صرف',
  },
  fr: {
    appName: 'RecipeCloud',
    tagline: 'Votre Cuisine, Amplifiée',
    home: 'Accueil', search: 'Rechercher', upload: 'Publier', profile: 'Profil', leaderboard: 'Classement',
    featuredRecipes: 'Recettes en vedette', viewAll: 'Voir tout', getStarted: 'Commencer',
    joinFree: 'Rejoindre gratuitement', shareRecipe: 'Partager une recette', browseCategories: 'Parcourir',
    uploadRecipe: 'Publier une recette', recipeName: 'Nom de la recette', category: 'Catégorie',
    difficulty: 'Difficulté', cookTime: 'Temps de cuisson (min)', ingredients: 'Ingrédients',
    instructions: 'Instructions', submit: 'Publier (+10 pts)', uploading: 'Publication…',
    nutrition: 'Informations Nutritionnelles', calories: 'Calories', protein: 'Protéines', fat: 'Graisses',
    carbs: 'Glucides', sugar: 'Sucres', fiber: 'Fibres', vitamins: 'Vitamines',
    analyzeNutrition: 'Ajouter les informations nutritionnelles', analyzing: 'Analyse en cours…',
    myProfile: 'Mon Profil', myRecipes: 'Mes Recettes', favorites: 'Favoris',
    points: 'Points', recipes: 'Recettes', signIn: 'Connexion', signOut: 'Déconnexion',
    signInGoogle: 'Se connecter avec Google', delete: 'Supprimer', noRecipes: 'Aucune recette',
    cloudSync: 'Sync Cloud', language: 'Langue', ranks: 'Rangs', perServing: 'par portion',
    addedPoints: '+10 points obtenus', uploadSuccess: 'Recette publiée avec succès!',
    minRead: 'min', easyLabel: 'Facile', mediumLabel: 'Moyen', hardLabel: 'Difficile',
    searchPlaceholder: 'Rechercher recettes, ingrédients…', filters: 'Filtres',
    maxTime: 'Temps max', sortNewest: 'Plus récent', sortTop: 'Mieux noté',
    noResults: 'Aucun résultat',    clearFilters: 'Effacer les filtres',
    heroSubtitle: 'Explorez, partagez et connectez-vous avec d\'autres passionnés de cuisine dans une communauté mondiale.',
    joinCommunity: 'Rejoindre la Communauté',    joinDesc: 'Connectez-vous pour publier des recettes et gagner des points.',
    vegetarian: 'Végétarien',
    nonVeg: 'Non-Végétarien',
    vegan: 'Végétalien',
  },  es: {
    appName: 'RecipeCloud',
    tagline: 'Tu Cocina, Amplificada',
    home: 'Inicio', search: 'Buscar', upload: 'Subir', profile: 'Perfil', leaderboard: 'Clasificación',
    featuredRecipes: 'Recetas Destacadas', viewAll: 'Ver todo', getStarted: 'Comenzar',
    joinFree: 'Únete gratis', shareRecipe: 'Compartir receta', browseCategories: 'Categorías',
    uploadRecipe: 'Subir receta', recipeName: 'Nombre de la receta', category: 'Categoría',
    difficulty: 'Dificultad', cookTime: 'Tiempo de cocción (min)', ingredients: 'Ingredientes',
    instructions: 'Instrucciones', submit: 'Subir receta (+10 pts)', uploading: 'Subiendo…',
    nutrition: 'Información Nutricional', calories: 'Calorías', protein: 'Proteínas', fat: 'Grasas',
    carbs: 'Carbohidratos', sugar: 'Azúcar', fiber: 'Fibra', vitamins: 'Vitaminas',
    analyzeNutrition: 'Agregar información nutricional', analyzing: 'Analizando…',
    myProfile: 'Mi Perfil', myRecipes: 'Mis Recetas', favorites: 'Favoritos',
    points: 'Puntos', recipes: 'Recetas', signIn: 'Iniciar sesión', signOut: 'Cerrar sesión',
    signInGoogle: 'Iniciar con Google', delete: 'Eliminar', noRecipes: 'Sin recetas aún',
    cloudSync: 'Sincronización', language: 'Idioma', ranks: 'Rangos', perServing: 'por porción',
    addedPoints: '+10 puntos obtenidos', uploadSuccess: '¡Receta subida con éxito!',
    minRead: 'min', easyLabel: 'Fácil', mediumLabel: 'Medio', hardLabel: 'Difícil',
    searchPlaceholder: 'Buscar recetas, ingredientes…', filters: 'Filtros',
    maxTime: 'Tiempo máximo', sortNewest: 'Más reciente', sortTop: 'Mejor valorado',
    noResults: 'Nada encontrado', clearFilters: 'Borrar filtros',
    heroSubtitle: 'Explora, comparte y conéctate con otros entusiastas de la comida en una comunidad global.',
    joinCommunity: 'Únete a la Comunidad',    joinDesc: 'Inicia sesión para subir recetas y ganar puntos.',
    vegetarian: 'Vegetariano',
    nonVeg: 'No Vegetariano',
    vegan: 'Vegano',
  },
};

interface LangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangCtx>({} as LangCtx);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  const setLang = (l: LangCode) => {
    setLangState(l);
    document.documentElement.dir = LANGUAGES.find(x => x.code === l)?.dir ?? 'ltr';
  };

  const t = (key: string) => translations[lang][key] ?? translations['en'][key] ?? key;
  const dir = LANGUAGES.find(x => x.code === lang)?.dir ?? 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
