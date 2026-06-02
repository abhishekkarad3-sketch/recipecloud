# 🌿 RecipeCloud — Cloud Recipe App

Full-stack recipe community: Next.js 15 + Supabase + Tailwind CSS.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abhishekkarad3-sketch/recipecloud)

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
├── lib/firebase.ts         ← Firebase init
└── services/
    ├── recipes.ts          ← Firestore + Storage
    └── users.ts            ← User CRUD + leaderboard
```

---

## ⚙️ Setup

### 1. Create Firebase Project
→ [console.firebase.google.com](https://console.firebase.google.com) → Add project

### 2. Enable Services
- **Authentication** → Sign-in providers → Enable **Google**
- **Firestore** → Create database → Production mode
- **Storage** → Get started → Production mode

### 3. Get Config Keys
Project Settings → Your apps → Web → copy `firebaseConfig`

### 4. Add Environment Variables
```bash
cp .env.local.example .env.local
# Fill in your Firebase keys
```

### 5. Apply Security Rules
- Firestore: paste `firestore.rules` → Publish
- Storage: paste `storage.rules` → Publish

### 6. Run
```bash
npm install
npm run dev
# → http://localhost:4028
```

---

## 🔒 Security
- Read: Public
- Write recipe: Auth required
- Delete: Author only
- Rate: Once per user

## 🚀 Deploy
```bash
npx vercel
# Add env vars in Vercel dashboard
```

## Project Status

All features have been implemented, and the Supabase environment (database schema, storage buckets, and RLS policies) has been fully configured.
