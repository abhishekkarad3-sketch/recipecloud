# RecipeCloud Render Deployment Guide

This guide provides step-by-step instructions to deploy RecipeCloud on Render.

## Prerequisites

1. **GitHub Repository**: The RecipeCloud repository must be pushed to GitHub
2. **Render Account**: Create a free account at [render.com](https://render.com)
3. **Supabase Project**: Set up a Supabase project with:
   - Database tables (`users` and `recipes`)
   - Row-Level Security (RLS) policies configured
   - Storage bucket for recipe images
4. **Gemini API Key** (Optional): For AI-powered nutrition analysis

## Step 1: Prepare Environment Variables

Before deploying, gather the following information:

### Supabase Credentials
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Gemini API Key (Optional)
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy the key → `GEMINI_API_KEY`

## Step 2: Deploy on Render

### Option A: Using Render Dashboard

1. **Connect GitHub**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New +** → **Web Service**
   - Select **Build and deploy from a Git repository**
   - Connect your GitHub account and select the `recipecloud` repository

2. **Configure Service**:
   - **Name**: `recipecloud` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Free (or paid for better performance)

3. **Add Environment Variables**:
   Click **Advanced** and add the following:
   
   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `22.13.0` |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
   | `NEXT_PUBLIC_SITE_URL` | `https://recipecloud.onrender.com` (replace with your Render domain) |
   | `GEMINI_API_KEY` | Your Gemini API Key (if available) |

4. **Deploy**:
   - Click **Create Web Service**
   - Render will automatically build and deploy your application

### Option B: Using Deploy Button

Click the deploy button in the README.md to automatically deploy with the `render.yaml` configuration:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abhishekkarad3-sketch/recipecloud)

## Step 3: Configure Supabase OAuth Callback

After deployment, update your Supabase OAuth settings:

1. **Get Your Render Domain**:
   - Go to your Render service dashboard
   - Copy the service URL (e.g., `https://recipecloud.onrender.com`)

2. **Update Supabase OAuth**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Click **Authentication** → **Providers** → **Google**
   - Add your Render domain to **Authorized redirect URIs**:
     ```
     https://recipecloud.onrender.com/auth/callback
     ```

3. **Update Environment Variable**:
   - Go back to Render dashboard
   - Click your service
   - Click **Environment**
   - Update `NEXT_PUBLIC_SITE_URL` to your Render domain

## Step 4: Verify Deployment

1. **Check Build Logs**:
   - Go to your Render service dashboard
   - Click **Logs** to view build and runtime logs
   - Look for any errors during build or startup

2. **Test the Application**:
   - Visit your Render domain (e.g., `https://recipecloud.onrender.com`)
   - Test key features:
     - [ ] Homepage loads without errors
     - [ ] Google OAuth login works
     - [ ] Recipes display from Supabase
     - [ ] Recipe creation works
     - [ ] Image uploads work
     - [ ] Rating system works
     - [ ] Leaderboard displays correctly

## Troubleshooting

### Build Fails

**Error**: `pnpm: command not found`
- **Solution**: Ensure `NODE_VERSION` is set to `22.13.0` or higher

**Error**: `next build` fails with type errors
- **Solution**: Check that all environment variables are set correctly
- The build command includes `--no-lint` to skip linting

### Application Won't Start

**Error**: `Cannot find module` or `ENOENT`
- **Solution**: 
  - Check that `pnpm install` completed successfully
  - Verify all dependencies are listed in `package.json`

**Error**: `Port already in use`
- **Solution**: The `PORT` environment variable should be set to `10000` (Render's default)

### OAuth Not Working

**Error**: `Redirect URI mismatch`
- **Solution**:
  - Update `NEXT_PUBLIC_SITE_URL` to your Render domain
  - Add the callback URL to Supabase OAuth settings
  - Ensure the domain includes `https://` (not `http://`)

### Database Connection Issues

**Error**: `Connection refused` or `ECONNREFUSED`
- **Solution**:
  - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
  - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
  - Check that Supabase project is active and running

### Image Uploads Fail

**Error**: `403 Forbidden` or `Access Denied`
- **Solution**:
  - Verify Supabase Storage bucket `recipe-images` exists
  - Check RLS policies on the storage bucket
  - Ensure user is authenticated before uploading

## Performance Optimization

### For Free Plan Users

1. **Cold Starts**: Free instances may take 30-60 seconds to start after inactivity
2. **Memory**: Limited to 512MB, which is sufficient for this application
3. **Bandwidth**: Limited to 100GB/month

### Recommendations

1. **Enable Auto-Scaling**: Upgrade to a paid plan for better performance
2. **Use CDN**: Configure Render's built-in CDN for static assets
3. **Database Optimization**: Add indexes to frequently queried columns in Supabase
4. **Image Optimization**: Compress recipe images before uploading

## Monitoring and Maintenance

### View Logs

```bash
# View real-time logs
# Go to Render dashboard → Your Service → Logs
```

### Update Dependencies

```bash
# Update dependencies locally
pnpm update

# Commit and push to GitHub
git add pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main

# Render will automatically redeploy
```

### Redeploy Application

1. Go to Render dashboard
2. Click your service
3. Click **Manual Deploy** → **Deploy latest commit**

## Security Checklist

- [ ] Environment variables are set in Render (not in code)
- [ ] Supabase RLS policies are correctly configured
- [ ] OAuth callback URL is set to your Render domain
- [ ] API keys are not exposed in GitHub
- [ ] `.env.local` is in `.gitignore`

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Support

For issues or questions:

1. Check the [Render Status Page](https://status.render.com)
2. Review [Render Documentation](https://render.com/docs)
3. Check [Supabase Documentation](https://supabase.com/docs)
4. Open an issue on the [GitHub Repository](https://github.com/abhishekkarad3-sketch/recipecloud/issues)

---

**Last Updated**: June 3, 2026
**Status**: Ready for Production Deployment
