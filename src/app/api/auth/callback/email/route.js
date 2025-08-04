import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient.js';
import { createSession } from '../../../../lib/sessionManagement.js';

export async function GET(request) {
  try {
    console.log('🔍 Email verification callback started');
    
    // Check if Supabase is available
    if (!supabase) {
      console.error('❌ Supabase client not available');
      return NextResponse.redirect(new URL('/auth/error?error=Configuration', request.url));
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    console.log('📧 Processing verification for email:', email);

    if (!token || !email) {
      console.error('❌ Missing token or email');
      return NextResponse.redirect(new URL('/auth/error?error=InvalidVerificationLink', request.url));
    }

    // Verify the token
    console.log('🔐 Verifying token...');
    const { data: tokenData, error: tokenError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('identifier', email)
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ Token verification failed:', tokenError);
      return NextResponse.redirect(new URL('/auth/error?error=InvalidToken', request.url));
    }

    console.log('✅ Token verified successfully');

    // Check if token is expired
    if (new Date(tokenData.expires) < new Date()) {
      console.error('❌ Token expired');
      return NextResponse.redirect(new URL('/auth/error?error=TokenExpired', request.url));
    }

    // Get user
    console.log('👤 Fetching user...');
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      console.error('❌ User not found');
      return NextResponse.redirect(new URL('/auth/error?error=UserNotFound', request.url));
    }

    console.log('✅ User found:', user.email);

    // Delete the used token
    console.log('🗑️ Deleting used token...');
    await supabase
      .from('verification_tokens')
      .delete()
      .eq('token', token);

    // Create a session
    console.log('🔑 Creating session...');
    const session = await createSession(user.id);

    if (!session) {
      console.error('❌ Failed to create session for user:', user.id);
      return NextResponse.redirect(new URL('/auth/error?error=SessionCreationFailed', request.url));
    }

    console.log('✅ Session created successfully:', session.sessionToken);

    // Redirect to home page with session cookie
    const response = NextResponse.redirect(new URL('/?verified=true', request.url));
    response.cookies.set('session_token', session.sessionToken, {
      httpOnly: true,
      secure: false, // Set to false for development (localhost)
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('🍪 Cookie set successfully');
    console.log('🔄 Redirecting to home page...');
    return response;

  } catch (error) {
    console.error('❌ Email verification error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=VerificationFailed', request.url));
  }
} 