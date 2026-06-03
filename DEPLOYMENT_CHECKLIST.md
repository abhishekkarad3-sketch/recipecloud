# RecipeCloud Deployment Checklist

This document provides a step-by-step checklist to ensure RecipeCloud is properly deployed and all features are working.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set to your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set to your Supabase anon key
- [ ] `NEXT_PUBLIC_SITE_URL` is set to your deployment domain (e.g., `https://recipecloud.onrender.com`)
- [ ] `GEMINI_API_KEY` is set (optional, for nutrition analysis)
- [ ] `NODE_ENV` is set to `production` (for production builds)
- [ ] `PORT` is set to `10000` (for Render deployments)

### 2. Supabase Configuration
- [ ] Supabase project is active and running
- [ ] `users` table exists with correct schema
- [ ] `recipes` table exists with correct schema
- [ ] `recipe-images` storage bucket exists and is public
- [ ] Row-Level Security (RLS) policies are enabled and configured
- [ ] Google OAuth provider is enabled in Supabase Authentication
- [ ] Authorized redirect URIs includes `https://your-domain.com/auth/callback`

### 3. GitHub Repository
- [ ] Latest code is pushed to main branch
- [ ] Commit `ef808dc` or later is deployed (includes OAuth fixes)
- [ ] No uncommitted changes remain

## Post-Deployment Verification

### 1. Application Loads
- [ ] Visit your deployment URL (e.g., https://recipecloud.onrender.com)
- [ ] Page loads without errors
- [ ] No 404 or 500 errors in browser console
- [ ] Hero section displays with tagline and buttons

### 2. Authentication
- [ ] "Sign in with Google" button is visible
- [ ] Click "Sign in with Google" redirects to Google login
- [ ] After login, redirects back to application
- [ ] User profile appears in top navigation
- [ ] User points display correctly

### 3. Recipe Display
- [ ] Home page shows featured recipes
- [ ] At least 2-3 recipes are visible
- [ ] Recipe cards display images, titles, ratings
- [ ] Search page loads and shows recipes
- [ ] Categories section displays

### 4. Recipe Management
- [ ] Click "Upload Recipe" tab
- [ ] Form loads with all fields (name, ingredients, instructions, etc.)
- [ ] Can select category and difficulty
- [ ] Can add/remove ingredients and instructions
- [ ] Image upload works
- [ ] Submit button creates recipe successfully
- [ ] New recipe appears in home/search pages

### 5. Profile Features
- [ ] Click profile icon in navigation
- [ ] Profile tab shows user information
- [ ] "Edit Profile" button is visible
- [ ] Can edit name, bio, gender
- [ ] Can upload profile picture
- [ ] Changes save successfully
- [ ] Avatar displays in navigation after update

### 6. Recipe Interactions
- [ ] Click on a recipe card to open details modal
- [ ] Modal shows full recipe information
- [ ] Rating system works (can rate 1-5 stars)
- [ ] Can add comments/reviews
- [ ] Heart icon toggles favorites
- [ ] Favorite count updates

### 7. Leaderboard
- [ ] Click "Leaderboard" tab
- [ ] Top users display with points
- [ ] Rankings are correct
- [ ] User avatars display

### 8. Image Uploads
- [ ] Recipe image uploads work without errors
- [ ] Profile avatar uploads work
- [ ] Images display correctly after upload
- [ ] No "Upload failed" error messages

## Troubleshooting

### Issue: "Upload failed. Check your Firebase config"
**Solution**: This error indicates the deployed code is outdated. Ensure you've deployed commit `ef808dc` or later.

### Issue: No recipes displaying
**Causes & Solutions**:
1. Supabase credentials are incorrect
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. RLS policies are blocking public reads
   - Check Supabase RLS policies on `recipes` table
   - Ensure SELECT policy allows public access
3. Database is empty
   - Add sample recipes to Supabase `recipes` table

### Issue: Google login redirects to wrong URL
**Solution**: 
1. Check `NEXT_PUBLIC_SITE_URL` is set correctly
2. Add the callback URL to Supabase OAuth settings:
   - Go to Supabase → Authentication → Providers → Google
   - Add `https://your-domain.com/auth/callback` to Authorized redirect URIs

### Issue: Features missing (Edit Profile, Ratings, etc.)
**Solution**: 
1. Verify deployed code includes commit `ef808dc` or later
2. Check browser console for JavaScript errors
3. Clear browser cache and reload

### Issue: Image uploads fail with 403 Forbidden
**Solution**:
1. Verify `recipe-images` bucket exists in Supabase Storage
2. Check RLS policies on storage bucket
3. Ensure user is authenticated before uploading

### Issue: Build fails on Render
**Solution**:
1. Check build logs in Render dashboard
2. Verify `NODE_VERSION` is set to `22.13.0` or higher
3. Ensure all environment variables are set
4. Try manual redeploy

## Performance Optimization

### For Render Free Plan
- Cold starts may take 30-60 seconds after inactivity
- Consider upgrading to paid plan for better performance
- Database queries are optimized with proper indexes

### Recommended Optimizations
1. Add database indexes on frequently queried columns
2. Enable Supabase CDN for storage buckets
3. Compress images before uploading
4. Use Render's paid plan for better performance

## Monitoring

### Check Deployment Status
1. Go to Render dashboard
2. Click your service
3. Check "Logs" for any errors
4. Monitor "Metrics" for performance

### Common Log Errors
- `ECONNREFUSED` - Database connection failed, check credentials
- `Module not found` - Missing dependency, check package.json
- `Port already in use` - Check PORT environment variable

## Rollback Procedure

If deployment has issues:
1. Go to Render dashboard
2. Click your service
3. Click "Deployments" tab
4. Select previous working deployment
5. Click "Redeploy"

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Repository Issues](https://github.com/abhishekkarad3-sketch/recipecloud/issues)

---

**Last Updated**: June 4, 2026
**Status**: Ready for Production
