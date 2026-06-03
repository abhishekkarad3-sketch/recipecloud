# RecipeCloud Setup Guide

## Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Gemini API key

## Environment Setup

### 1. Supabase Configuration

Create a Supabase project and get your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 2. Create Storage Bucket

The application automatically creates a `recipe-images` storage bucket on first use. Ensure your Supabase project has storage enabled.

### 3. Database Schema

The following tables are required:

**users table:**
- id (uuid, primary key)
- name (text)
- email (text)
- photo_url (text, nullable)
- points (integer, default 0)
- favorites (text array, default [])
- created_at (timestamp)

**recipes table:**
- id (uuid, primary key, auto-generated)
- name (text)
- ingredients (text array)
- instructions (text)
- cooking_time (integer)
- category (text)
- difficulty (text)
- image_url (text, nullable)
- author_id (uuid, foreign key to users)
- author_name (text)
- rating_total (integer, default 0)
- rating_count (integer, default 0)
- users_who_rated (uuid array, default [])
- nutrition (jsonb, nullable)
- created_at (timestamp)

### 4. Row-Level Security (RLS) Policies

**users table:**
- SELECT: Public (everyone can view)
- INSERT: Authenticated users can insert their own profile
- UPDATE: Users can update their own profile

**recipes table:**
- SELECT: Public (everyone can view)
- INSERT: Authenticated users can create recipes
- UPDATE: Authenticated users can rate recipes, authors can update their own
- DELETE: Authors can delete their own recipes

### 5. Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (Required for OAuth callbacks)
NEXT_PUBLIC_SITE_URL=http://localhost:4028

# Gemini API Key (Optional, for nutrition analysis)
GEMINI_API_KEY=your_gemini_api_key
```

**Important**: Set `NEXT_PUBLIC_SITE_URL` to your actual domain when deploying (e.g., `https://recipecloud.onrender.com`)

## Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm serve
```

## Features

- **Authentication**: Google OAuth via Supabase
- **Recipe Management**: Create, read, update, delete recipes
- **Rating System**: Rate recipes and earn points
- **Favorites**: Save favorite recipes
- **Leaderboard**: View top contributors
- **Image Upload**: Upload recipe images to Supabase Storage
- **Nutrition Analysis**: Analyze recipe nutrition using Gemini API
- **Real-time Updates**: Live recipe updates using Supabase Realtime

## API Routes

- `POST /api/upload` - Upload recipe images to Supabase Storage

## Supabase Utilities

Located in `src/utils/supabase/`:
- `client.ts` - Browser-side Supabase client
- `server.ts` - Server-side Supabase client
- `auth.ts` - Authentication utilities
- `storage.ts` - Storage utilities
- `middleware.ts` - Session refresh middleware

## Troubleshooting

### Storage Bucket Not Found
The bucket is created automatically on first image upload. Ensure storage is enabled in your Supabase project.

### Authentication Issues
- Verify Google OAuth is configured in Supabase
- Check that callback URL is set to `{your-domain}/auth/callback`
- Ensure environment variables are correctly set

### RLS Policy Errors
- Check that RLS policies are properly configured
- Verify user authentication status
- Check policy conditions match your use case
