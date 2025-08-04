# Environment Variables Setup

## Required Environment Variables (Development)

For development, you only need these variables:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth (OPTIONAL - only if you want Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Optional: Email Configuration (Production Only)

The Gmail setup is **ONLY needed for production** when you want to send real emails. In development, the system shows verification URLs instead of sending emails.

If you want to set up email for production later:

```env
# Email Configuration (PRODUCTION ONLY)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

## How to Get These Values

### 1. Supabase Configuration (REQUIRED)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the **Project URL** and **service_role key**

### 2. NextAuth Secret (REQUIRED)

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Google OAuth (OPTIONAL)

Only needed if you want Google sign-in:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 4. Email Configuration (PRODUCTION ONLY)

**You can skip this for development!** The system will show verification URLs instead of sending emails.

For production Gmail setup:
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"

## Development vs Production

### Development (What you need now)
- ✅ `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (required)
- ✅ `NEXTAUTH_URL` and `NEXTAUTH_SECRET` (required)
- ✅ Google OAuth (optional)
- ❌ Email configuration (not needed - shows verification URLs)

### Production (Future setup)
- ✅ All development variables
- ✅ Email configuration (for real emails)
- ✅ Proper domain for `NEXTAUTH_URL`

## Testing Right Now

After setting up just the Supabase and NextAuth variables:

1. Restart your development server
2. Go to `http://localhost:3000/auth/signin`
3. Try signing up with email
4. You'll see a verification URL in the message (no email sent!)
5. Click the URL to complete signup

## Troubleshooting

### "Supabase client not available"
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Restart your development server

### "Database not configured"
- Make sure you've run the SQL migration in Supabase
- Check that the environment variables are correct

### "Module not found"
- Make sure all files are in the correct locations
- Check import paths in the code

**Bottom line**: For development, you only need Supabase and NextAuth variables. The Gmail setup is completely optional and only for production! 