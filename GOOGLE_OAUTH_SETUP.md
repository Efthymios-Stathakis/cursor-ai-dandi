# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication with NextAuth.js.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy your Client ID and Client Secret

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Generate NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator.

## Step 3: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Click the hamburger menu to open the sidebar

4. You should see a "Sign in with Google" button at the bottom of the sidebar

5. Click the button to test the OAuth flow

## Step 4: Production Deployment

For production deployment:

1. Update your Google OAuth credentials with your production domain
2. Set the correct `NEXTAUTH_URL` in your environment variables
3. Ensure your `NEXTAUTH_SECRET` is secure and unique
4. Deploy your application

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**: Make sure your redirect URI in Google Console matches exactly
2. **"Client ID not found"**: Verify your environment variables are set correctly
3. **Session not persisting**: Check that `NEXTAUTH_SECRET` is set and consistent

### Debug Mode

To enable debug mode, add this to your `.env.local`:

```env
NEXTAUTH_DEBUG=true
```

## Security Best Practices

1. Never commit your `.env.local` file to version control
2. Use strong, unique secrets for `NEXTAUTH_SECRET`
3. Regularly rotate your OAuth credentials
4. Use HTTPS in production
5. Implement proper session management

## Additional Configuration

You can customize the NextAuth.js configuration in `src/app/api/auth/[...nextauth]/route.js`:

- Add more providers (GitHub, Facebook, etc.)
- Customize callbacks for additional user data
- Implement custom sign-in pages
- Add database integration for user persistence 