import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured'
      });
    }

    // Get all verification tokens
    const { data: tokens, error } = await supabase
      .from('verification_tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch tokens',
        details: error.message
      });
    }

    return NextResponse.json({
      tokens: tokens || [],
      count: tokens?.length || 0
    });

  } catch (error) {
    console.error('List tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to list tokens' },
      { status: 500 }
    );
  }
} 