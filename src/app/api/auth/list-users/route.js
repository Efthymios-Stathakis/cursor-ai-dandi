import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured'
      });
    }

    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch users',
        details: error.message
      });
    }

    return NextResponse.json({
      users: users || [],
      count: users?.length || 0
    });

  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
} 