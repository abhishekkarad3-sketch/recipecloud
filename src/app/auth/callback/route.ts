
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page on success
  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028';
  return NextResponse.redirect(redirectUrl);
}
