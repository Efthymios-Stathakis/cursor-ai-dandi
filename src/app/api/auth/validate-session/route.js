import { NextResponse } from 'next/server';
import { getSessionFromToken } from '../../../lib/sessionManagement.js';

export async function POST(request) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      console.log('No session token provided');
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    console.log('Validating session token:', sessionToken);

    // Validate the session token
    const session = await getSessionFromToken(sessionToken);

    if (!session) {
      console.log('Session validation failed');
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    console.log('Session validated successfully for user:', session.user.email);

    return NextResponse.json({
      user: session.user,
      sessionToken: session.sessionToken,
      expires: session.expires,
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    );
  }
} 