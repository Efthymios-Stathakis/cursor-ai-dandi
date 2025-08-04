import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured',
        supabaseUrl: process.env.SUPABASE_URL ? 'set' : 'not set',
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set'
      });
    }

    // Check if sessions table exists
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('count')
      .limit(1);

    // Check if verification_tokens table exists
    const { data: tokens, error: tokensError } = await supabase
      .from('verification_tokens')
      .select('count')
      .limit(1);

    // Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    return NextResponse.json({
      sessions: sessionsError ? 'error' : 'exists',
      verification_tokens: tokensError ? 'error' : 'exists',
      users: usersError ? 'error' : 'exists',
      errors: {
        sessions: sessionsError?.message,
        tokens: tokensError?.message,
        users: usersError?.message
      }
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { error: 'Failed to check database' },
      { status: 500 }
    );
  }
} 