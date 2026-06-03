# 🌿 RecipeCloud — Cloud Recipe App

Full-stack recipe community: Next.js 15 + Supabase + Tailwind CSS.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (AuthProvider)
│   ├── page.tsx            ← Main page — all sections assembled
│   └── not-found.tsx
├── components/
│   ├── Navbar.tsx          ← Sticky, auth-aware
│   ├── RecipeCard.tsx      ← Rating + favorites
│   ├── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── RecipesSection.tsx   ← Live + search/filter
│       ├── CategoriesSection.tsx
│       ├── UploadSection.tsx    ← Image upload + points
│       ├── ProfileSection.tsx   ← Profile + delete recipes
│       └── LeaderboardSection.tsx
├── context/AuthContext.tsx ← Global Google auth state
├── lib/supabase.ts         ← Supabase init
└── services/
    ├── recipes.ts          ← Supabase + Storage
    └── users.ts            ← User CRUD + leaderboard
```

---

## ⚙️ Setup

### 1. Create Supabase Project
→ [app.supabase.com](https://app.supabase.com) → New Project

### 2. Configure Supabase
- **Authentication** → Providers → Enable **Google**
- **Database** → Create tables: `users` and `recipes` (schema provided in SETUP.md)
- **Storage** → Create bucket: `recipe-images`
- **Row Level Security (RLS)** → Enable and configure policies

### 3. Get Config Keys
Project Settings → API → Copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Add Environment Variables
```bash
cp .env.example .env.local
# Fill in your Supabase URL and Anon Key
```

### 5. Configure OAuth Callback
- Go to Supabase → Authentication → Providers → Google
- Add your app URL to Authorized redirect URIs: `https://your-domain.com/auth/callback`

### 6. Run
```bash
npm install
npm run dev
# → http://localhost:4028
```

---

## 🔒 Security
- **RLS Policies** ensure:
  - Read: Public
  - Write recipe: Auth required + author_id matches user
  - Delete: Author only
  - Rate: Once per user per recipe
- **Storage Policies** restrict uploads to authenticated users

## 🚀 Deploy

### Option 1: Deploy to Render
```bash
git push origin main
# Render auto-deploys on push (if connected)
# Or use: https://render.com/deploy?repo=<your-github-url>
```

### Option 2: Deploy to Vercel
```bash
npx vercel
# Add env vars in Vercel dashboard
```

For detailed Render deployment guide, see [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

## Project Status

All features have been implemented, and the Supabase environment (database schema, storage buckets, and RLS policies) has been fully configured.
