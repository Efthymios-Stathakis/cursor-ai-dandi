import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser } from "../../../lib/userManagement.js";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Store user data in Supabase when they sign in
        const userData = {
          name: user.name,
          email: user.email,
          image: user.image,
        };

        const { user: dbUser, isNewUser } = await createOrUpdateUser(userData);
        
        // Add the database user ID to the session
        user.id = dbUser.id;
        
        console.log(isNewUser ? 'New user created in database' : 'Existing user updated in database');
        
        return true;
      } catch (error) {
        console.error('Error storing user data:', error);
        // Still allow sign in even if database storage fails
        return true;
      }
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user ID to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NEXTAUTH_DEBUG === 'true',
});

export { handler as GET, handler as POST }; 