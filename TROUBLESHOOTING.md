# Troubleshooting Guide

This guide helps you resolve common issues with Google OAuth and Supabase integration.

## Common Errors and Solutions

### 1. "State cookie was missing" Error

**Cause**: This error occurs when the OAuth state cookie is not properly set or is missing.

**Solutions**:
- Clear your browser cookies and cache
- Make sure `NEXTAUTH_URL` is set correctly in your `.env.local`
- Ensure you're using HTTPS in production or localhost in development
- Check that your Google OAuth redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`

### 2. "Module not found" Errors

**Cause**: Import paths are incorrect or files don't exist.

**Solutions**:
- Make sure all import paths include the `.js` extension
- Verify that all files exist in the correct locations
- Restart your development server after making changes

### 3. "Invalid API key" Supabase Error

**Cause**: Using the wrong Supabase API key.

**Solutions**:
- Use the `service_role` key, not the `anon` key
- Make sure your Supabase URL is correct
- Verify your Supabase project is active

### 4. "Table doesn't exist" Error

**Cause**: The users table hasn't been created in Supabase.

**Solutions**:
- Run the SQL schema in your Supabase SQL Editor
- Check that the table was created successfully
- Verify the table name is exactly `users`

### 5. "RLS policy violation" Error

**Cause**: Row Level Security policies are blocking operations.

**Solutions**:
- Make sure RLS policies are correctly set up
- Use the service_role key which bypasses RLS
- Check that the policies allow the operations you're trying to perform

## Environment Variables Checklist

Make sure you have all these variables in your `.env.local`:

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional for debugging
NEXTAUTH_DEBUG=true
```

## Google OAuth Setup Checklist

1. **Google Cloud Console**:
   - ✅ Project created
   - ✅ Google+ API enabled
   - ✅ OAuth 2.0 credentials created
   - ✅ Redirect URI set to: `http://localhost:3000/api/auth/callback/google`

2. **Environment Variables**:
   - ✅ `GOOGLE_CLIENT_ID` set
   - ✅ `GOOGLE_CLIENT_SECRET` set

## Supabase Setup Checklist

1. **Supabase Project**:
   - ✅ Project created
   - ✅ SQL schema executed
   - ✅ Service role key copied

2. **Database Schema**:
   - ✅ `users` table created
   - ✅ RLS policies set up
   - ✅ Indexes created

3. **Environment Variables**:
   - ✅ `SUPABASE_URL` set
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` set

## Debug Mode

Enable debug mode to see detailed logs:

```env
NEXTAUTH_DEBUG=true
```

This will show:
- OAuth flow details
- Database operations
- Session information
- Error details

## Testing Steps

1. **Clear everything**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   # Clear browser cache and cookies
   ```

2. **Restart development server**:
   ```bash
   npm run dev
   ```

3. **Test OAuth flow**:
   - Go to `http://localhost:3000`
   - Open sidebar and click "Sign in with Google"
   - Complete the OAuth flow
   - Check browser console for errors

4. **Verify database**:
   - Check Supabase dashboard for new user
   - Visit `/profile` to see database information

## Common Fixes

### If OAuth keeps failing:
1. Clear browser cookies
2. Check Google OAuth redirect URI
3. Verify environment variables
4. Restart development server

### If database operations fail:
1. Check Supabase credentials
2. Verify table exists
3. Check RLS policies
4. Enable debug mode

### If profile page shows errors:
1. Check API endpoint logs
2. Verify user exists in database
3. Check import paths
4. Restart development server

## Getting Help

If you're still having issues:

1. **Enable debug mode** and check console logs
2. **Check browser network tab** for failed requests
3. **Verify all environment variables** are set correctly
4. **Test with a fresh browser session**
5. **Check Supabase logs** in the dashboard

## Production Deployment

For production:

1. **Update environment variables**:
   - Set `NEXTAUTH_URL` to your production domain
   - Use production Google OAuth credentials
   - Use production Supabase credentials

2. **Update Google OAuth**:
   - Add production redirect URI: `https://yourdomain.com/api/auth/callback/google`

3. **Security**:
   - Use strong `NEXTAUTH_SECRET`
   - Enable HTTPS
   - Set secure cookie options 