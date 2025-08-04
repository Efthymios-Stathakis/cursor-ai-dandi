import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get all cookies
    const cookies = request.cookies;
    const sessionToken = cookies.get('session_token')?.value;
    const nextAuthToken = cookies.get('next-auth.session-token')?.value;

    const allCookies = {};
    cookies.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value;
    });

    return NextResponse.json({
      sessionToken: sessionToken || 'not found',
      nextAuthToken: nextAuthToken || 'not found',
      allCookies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json(
      { error: 'Failed to debug session', details: error.message },
      { status: 500 }
    );
  }
} 