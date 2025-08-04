# Email Authentication Setup Guide

## Quick Start (Development)

For development, you **don't need to set up email at all**! The system will show verification URLs instead of sending emails.

Just set up your Supabase database and you're ready to test:

1. Run the database migration (see below)
2. Set up Supabase environment variables
3. Test the email authentication flow

## Required Environment Variables (Development Only)

For development, you only need:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

## Database Setup

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Create verification_tokens table for email authentication
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for email authentication sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Add RLS policies for verification_tokens
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
```

## Testing (Development Mode)

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to the sign-in page**: `http://localhost:3000/auth/signin`

3. **Click "Sign up with email"**

4. **Fill in the form** with your details

5. **Submit the form** - you'll see a message with a verification URL

6. **Click the verification URL** in the message to complete signup

**No email server needed!** The verification URL is shown directly in the UI.

## Production Email Setup (Optional)

Only set this up when you want to deploy to production and send real emails:

```env
# Email Server Configuration (PRODUCTION ONLY)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Gmail Setup (Production Only)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security > 2-Step Verification
   - Click on "App passwords"
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_SERVER_PASSWORD`

### Other Email Providers

You can use any SMTP provider. Here are some common configurations:

#### SendGrid
```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```env
EMAIL_SERVER_HOST=smtp.mailgun.org
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-mailgun-username
EMAIL_SERVER_PASSWORD=your-mailgun-password
```

## Features

### Email Sign Up
- Users can create accounts with email, first name, and last name
- Magic link is sent to their email address (or shown in development)
- No password required

### Email Sign In
- Users can sign in with just their email address
- Magic link is sent to their registered email (or shown in development)
- Secure token-based authentication

### Session Management
- Custom session tokens stored in database
- 30-day session duration
- Automatic cleanup of expired sessions

## Security Features

- **Token Expiration**: Verification tokens expire after 24 hours
- **Session Expiration**: Sessions expire after 30 days
- **Secure Cookies**: Session tokens stored as httpOnly cookies
- **Token Cleanup**: Used tokens are immediately deleted
- **Database Security**: Row Level Security enabled on all tables

## Development vs Production

### Development Mode
- ✅ No email server required
- ✅ Verification URLs shown in UI
- ✅ Easy testing and debugging
- ✅ No external dependencies

### Production Mode
- ✅ Real emails sent to users
- ✅ Professional user experience
- ✅ Requires email server setup
- ✅ More complex configuration

## Troubleshooting

### Common Issues:

1. **"Database not configured"**: Make sure you've run the SQL migration
2. **"Verification token not found"**: Check that the `verification_tokens` table exists
3. **"Session not working"**: Check that the `sessions` table exists
4. **"Environment variables"**: Make sure Supabase variables are set

### Debug Mode

Enable debug mode by setting:
```env
NEXTAUTH_DEBUG=true
```

This will provide detailed logs for authentication flows.

## Summary

**For Development**: Just set up Supabase and test with verification URLs!
**For Production**: Add email server configuration when you're ready to deploy.

The system is designed to work perfectly in development without any email setup! 