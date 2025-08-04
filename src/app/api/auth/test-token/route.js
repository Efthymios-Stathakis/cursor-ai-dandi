import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function POST(request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Testing token:', token);
    console.log('📧 For email:', email);

    // Check if token exists
    const { data: tokenData, error: tokenError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('identifier', email)
      .single();

    if (tokenError || !tokenData) {
      console.log('❌ Token not found:', tokenError);
      return NextResponse.json({
        error: 'Token not found',
        details: tokenError?.message
      });
    }

    console.log('✅ Token found:', tokenData);

    // Check if token is expired
    const isExpired = new Date(tokenData.expires) < new Date();
    console.log('⏰ Token expired:', isExpired);

    return NextResponse.json({
      tokenFound: true,
      tokenData,
      isExpired,
      currentTime: new Date().toISOString(),
      expiresAt: tokenData.expires
    });

  } catch (error) {
    console.error('Test token error:', error);
    return NextResponse.json(
      { error: 'Failed to test token' },
      { status: 500 }
    );
  }
} 