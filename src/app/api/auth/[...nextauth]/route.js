import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser } from "../../../lib/userManagement.js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Handle Google OAuth
        if (account?.provider === "google") {
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
          };

          const { user: dbUser, isNewUser } = await createOrUpdateUser(userData);
          user.id = dbUser.id;
          
          console.log(isNewUser ? 'New user created in database' : 'Existing user updated in database');
          return true;
        }

        return true;
      } catch (error) {
        console.error('Error storing user data:', error);
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 