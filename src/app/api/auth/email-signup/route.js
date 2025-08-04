import { NextResponse } from 'next/server';
import { createOrUpdateUser } from '../../../lib/userManagement.js';
import { supabase } from '../../../lib/supabaseClient.js';

export async function POST(request) {
  try {
    // Check if Supabase is available
    if (!supabase) {
      console.error('Supabase client not available');
      return NextResponse.json(
        { error: 'Database not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const { email, firstName, lastName } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    // Create user in database
    const userData = {
      name: `${firstName} ${lastName}`,
      email: email,
      image: null,
    };

    const { user: dbUser, isNewUser } = await createOrUpdateUser(userData);

    if (!isNewUser) {
      return NextResponse.json(
        { error: 'User already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    // Create a verification token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store the token in the database
    const { error: tokenError } = await supabase
      .from('verification_tokens')
      .insert({
        identifier: email,
        token: token,
        expires: expires.toISOString(),
      });

    if (tokenError) {
      console.error('Error storing verification token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create verification token. Please try again.' },
        { status: 500 }
      );
    }

    // Create the verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/callback/email?token=${token}&email=${encodeURIComponent(email)}`;

    // For development, just return the verification URL
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Development Mode - Verification URL:', verificationUrl);
      return NextResponse.json({
        message: 'Check your email for a sign-up link! (Development: Check console for verification URL)',
        userId: dbUser.id,
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
        subject: `Welcome to Dandy GitHub Analyzer - Complete Your Sign Up`,
        text: `Click here to complete your sign up: ${verificationUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Dandy GitHub Analyzer!</h2>
            <p style="color: #666; line-height: 1.6;">
              Hi ${firstName},<br><br>
              Thank you for signing up! Click the button below to complete your account setup.
              This link will expire in 24 hours.
            </p>
            <a href="${verificationUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Complete Your Sign Up
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        message: 'Check your email for a sign-up link!',
        userId: dbUser.id
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 