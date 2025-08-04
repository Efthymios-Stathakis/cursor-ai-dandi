import { NextResponse } from 'next/server';
import { deleteSession } from '../../../lib/sessionManagement.js';

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    const nextAuthToken = request.cookies.get('next-auth.session-token')?.value || 
                         request.cookies.get('__Secure-next-auth.session-token')?.value;

    // Clear custom session if it exists
    if (sessionToken) {
      try {
        await deleteSession(sessionToken);
      } catch (error) {
        console.error('Error deleting custom session:', error);
      }
    }

    // Clear NextAuth session cookies
    const response = NextResponse.json({ success: true });
    
    // Clear custom session cookie
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    // Clear NextAuth session cookies
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('__Secure-next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    // Clear CSRF token
    response.cookies.set('next-auth.csrf-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
} 