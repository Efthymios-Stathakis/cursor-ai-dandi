import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function POST(request) {
  try {
    console.log('📧 Email signin request received');
    
    // Check if Supabase is available
    if (!supabase) {
      console.error('❌ Supabase client not available');
      return NextResponse.json(
        { error: 'Database not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { email } = body;

    if (!email) {
      console.error('❌ Email is missing from request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('✅ Email received:', email);

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      console.error('❌ User not found for email:', email);
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 400 }
      );
    }

    console.log('✅ User found:', user.email);

    // Create a verification token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('🔑 Creating verification token:', token);

    // Store the token in the database
    const { error: tokenError } = await supabase
      .from('verification_tokens')
      .insert({
        identifier: email,
        token: token,
        expires: expires.toISOString(),
      });

    if (tokenError) {
      console.error('❌ Error storing verification token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create verification token. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Verification token stored successfully');

    // Create the verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/callback/email?token=${token}&email=${encodeURIComponent(email)}`;

    console.log('🔗 Verification URL created:', verificationUrl);

    // For development, just return the verification URL
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Development Mode - Sign In Verification URL:', verificationUrl);
      return NextResponse.json({
        message: 'Check your email for a sign-in link! (Development: Check console for verification URL)',
        verificationUrl: verificationUrl // Only in development
      });
    }

    // For production, send actual email
    try {
      const nodemailer = require('nodemailer');
      
      const emailProvider = {
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      };

      const transport = nodemailer.createTransport(emailProvider.server);

      await transport.sendMail({
        to: email,
        from: emailProvider.from,
        subject: `Sign in to Dandy GitHub Analyzer`,
        text: `Click here to sign in: ${verificationUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Sign in to Dandy GitHub Analyzer</h2>
            <p style="color: #666; line-height: 1.6;">
              Click the button below to sign in to your account.
              This link will expire in 24 hours.
            </p>
            <a href="${verificationUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Sign In to Dandy GitHub Analyzer
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        message: 'Check your email for a sign-in link!'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Email signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 