# Setup Instructions for Email Authentication

## Step 1: Create Database Tables

Go to your Supabase dashboard and run this SQL in the SQL editor:

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

## Step 2: Test Email Authentication (Development Mode)

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to the sign-in page**: `http://localhost:3000/auth/signin`

3. **Test Sign Up**:
   - Click "Sign up with email"
   - Fill in your details (first name, last name, email)
   - Submit the form
   - You'll see a clickable verification URL
   - Click the URL to complete signup

4. **Test Sign In**:
   - Click "Sign in with email"
   - Enter your email address
   - Submit the form
   - You'll see a clickable verification URL
   - Click the URL to complete signin

**No email server needed!** Both sign-up and sign-in show verification URLs directly in the UI for easy testing.

## Step 3: Set Up Email for Production (Optional)

If you want to send real emails in production, add these environment variables to your `.env.local`:

```env
# Email Server Configuration (for production)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Gmail Setup:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
   - Use this as `EMAIL_SERVER_PASSWORD`

## Step 4: Test the Complete Flow

1. **Sign Up with Email**:
   - Go to sign-in page
   - Click "Sign up with email"
   - Enter your details
   - Click the verification URL
   - You should be signed in!

2. **Sign In with Email**:
   - Go to sign-in page
   - Click "Sign in with email"
   - Enter your email
   - Click the verification URL
   - You should be signed in!

3. **Sign Out**:
   - Click "Sign Out" button
   - You should be signed out and redirected to home page

## Troubleshooting

### Database Errors
- Make sure you've run the SQL migration in Supabase
- Check that the `verification_tokens` and `sessions` tables exist

### Email Errors
- In development mode, emails won't be sent - check the console for verification URLs
- In production, make sure your email environment variables are set correctly

### Sign Out Issues
- The sign out should now work for both Google OAuth and email authentication
- If it doesn't work, try refreshing the page

## Development vs Production

- **Development**: Verification URLs are logged to console and shown in the UI
- **Production**: Real emails are sent with verification links

The system is now ready to test! Try signing up with email and let me know if you encounter any issues. 