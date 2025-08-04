import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured'
      });
    }

    // Get all sessions with user info
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch sessions',
        details: error.message
      });
    }

    return NextResponse.json({
      sessions: sessions || [],
      count: sessions?.length || 0
    });

  } catch (error) {
    console.error('List sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
} 