import { NextResponse } from 'next/server';
import { getSessionFromToken } from '../../../lib/sessionManagement.js';

export async function GET(request) {
  try {
    console.log('🔍 Session check request received');
    
    // Get the session token from the httpOnly cookie
    const sessionToken = request.cookies.get('session_token')?.value;
    
    console.log('🍪 Session token from cookie:', sessionToken ? 'found' : 'not found');

    if (!sessionToken) {
      console.log('❌ No session token in cookie');
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    console.log('🔍 Validating session token:', sessionToken);
    const session = await getSessionFromToken(sessionToken);

    if (!session) {
      console.log('❌ Session validation failed');
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    console.log('✅ Session validated successfully for user:', session.user.email);

    return NextResponse.json({
      user: session.user,
      sessionToken: session.sessionToken,
      expires: session.expires,
    });

  } catch (error) {
    console.error('❌ Session check error:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
} 