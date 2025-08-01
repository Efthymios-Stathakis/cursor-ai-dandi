# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for storing user data when they sign in with Google OAuth.

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note down your project URL and API keys

## Step 2: Set Up Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table for storing user information
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.email() = email);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.email() = email);

-- Create policy to allow insert for new users
CREATE POLICY "Allow insert for new users" ON users
    FOR INSERT WITH CHECK (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### Getting Your Supabase Credentials:

1. **SUPABASE_URL**: Found in your project settings under "API" tab
2. **SUPABASE_SERVICE_ROLE_KEY**: Found in your project settings under "API" tab (use the `service_role` key, not the `anon` key)

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Sign in with Google OAuth

3. Check your Supabase dashboard to see if the user was created in the `users` table

4. Visit `/profile` to see the database information

## How It Works

### User Creation Flow:

1. **User signs in with Google** → NextAuth.js handles OAuth
2. **signIn callback triggers** → User data is sent to Supabase
3. **Database check** → Checks if user exists by email
4. **Create or Update** → Creates new user or updates existing one
5. **Session enhancement** → Adds database user ID to session

### Database Schema:

- **id**: UUID primary key (auto-generated)
- **name**: User's full name from Google
- **email**: User's email address (unique)
- **image**: Profile picture URL from Google
- **created_at**: When the user was first created
- **updated_at**: When the user was last updated

### Features:

- ✅ **Automatic user creation** on first sign-in
- ✅ **User data updates** on subsequent sign-ins
- ✅ **Database ID in session** for easy access
- ✅ **Profile page integration** showing database info
- ✅ **Error handling** - sign-in still works if database fails
- ✅ **Row Level Security** for data protection
- ✅ **Automatic timestamps** for created_at/updated_at

## API Endpoints

### GET /api/users?email={email}
Fetches user data from Supabase by email address.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Make sure you're using the `service_role` key, not the `anon` key
2. **"Table doesn't exist" error**: Run the SQL schema in your Supabase SQL Editor
3. **"RLS policy violation" error**: Check that the RLS policies are correctly set up
4. **User not being created**: Check the browser console and server logs for errors

### Debug Mode:

Enable debug mode by adding to your `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

This will show detailed logs of the authentication process.

## Security Considerations

1. **Service Role Key**: Keep your service role key secure and never expose it to the client
2. **RLS Policies**: The Row Level Security policies ensure users can only access their own data
3. **Environment Variables**: Never commit your `.env.local` file to version control
4. **Error Handling**: The system gracefully handles database errors without breaking authentication

## Next Steps

After setting up the basic user storage, you can:

1. **Add more user fields** (preferences, settings, etc.)
2. **Create related tables** (user preferences, activity logs, etc.)
3. **Implement user management** (admin panel, user search, etc.)
4. **Add data validation** and sanitization
5. **Implement user deletion** and data export features 