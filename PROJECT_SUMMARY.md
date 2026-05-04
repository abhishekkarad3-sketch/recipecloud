# RecipeCloud Project Summary

## Core Configuration
- **GitHub Repository**: [abhishekkarad3-sketch/recipecloud](https://github.com/abhishekkarad3-sketch/recipecloud)
- **Supabase URL**: `https://phmykqzrzdpwbpvvyosq.supabase.co`
- **Supabase Anon Key**: `sb_publishable_yWXsMRgitEOgIBsvYYnCOQ_R6SuS9Wf`
- **Gemini API Key**: `AIzaSyD_EnTfgO_MtqQiedDLFO_uQFWsriPaA9s`
- **Gemini Project ID**: `projects/1007694168466`
- **Gemini Project Number**: `1007694168466`

## Environment Variables (for Render/Local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://phmykqzrzdpwbpvvyosq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yWXsMRgitEOgIBsvYYnCOQ_R6SuS9Wf
GEMINI_API_KEY=AIzaSyD_EnTfgO_MtqQiedDLFO_uQFWsriPaA9s
```

## Database & Infrastructure
- **Tables**: `users`, `recipes` (both with RLS enabled).
- **Storage**: `recipe-images` bucket (public read, authenticated write).
- **Authentication**: Google OAuth configured via Supabase.

## Recent Improvements
- Migrated to `@supabase/ssr` for Next.js 15 compatibility.
- Fixed RLS policies for better security (restricted updates/deletes to owners).
- Implemented specific RLS policy for recipe rating to prevent duplicates.
- Added AI Nutrition Analysis using Gemini 1.5 Flash.
- Added Auth Error page and middleware for session management.
