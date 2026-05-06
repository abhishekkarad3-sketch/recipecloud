# 🚀 Google Auth Setup Guide for RecipeCloud

To fix the Google Sign-In issue, you need to get a valid **Client ID** and **Client Secret** from Google. Follow these simple steps:

### 1. Create Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project (or create a new one).
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Choose **Web application** as the application type.
6. Add your app's URL (e.g., `https://your-app.vercel.app`) to **Authorized JavaScript origins**.
7. Add the Supabase callback URL to **Authorized redirect URIs**. You can find this in your Supabase Dashboard under **Auth > Providers > Google**. It looks like:
   `https://phmykqzrzdpwbpvvyosq.supabase.co/auth/v1/callback`
8. Click **Create** and copy the **Client ID** and **Client Secret**.

### 2. Update Supabase Settings
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Auth > Providers > Google**.
3. Paste the **Client ID** (it should look like `...apps.googleusercontent.com`) and the **Client Secret**.
4. Click **Save**.

### 3. Update your Code (Optional)
If you are running the app locally, make sure to add these to your `.env.local` file if needed, though Supabase handles most of it on the backend.

---
**Note:** I have already fixed the email confirmation issue, so users can now sign up and sign in with email/password immediately!
