import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import { getUserByEmail } from "./userManagement.js";
import { getSessionFromToken } from "./sessionManagement.js";

export async function getAuthenticatedUser(request) {
  try {
    console.log('🔍 getAuthenticatedUser called');
    
    // First, try to get NextAuth session
    const session = await getServerSession(authOptions);
    console.log('📧 NextAuth session:', session ? 'found' : 'not found');
    
    if (session && session.user && session.user.email) {
      console.log('✅ NextAuth user email:', session.user.email);
      // Get the user from the database using their email
      const user = await getUserByEmail(session.user.email);
      if (user) {
        console.log('✅ NextAuth user found in database:', user.email);
        return user;
      }
    }

    // If no NextAuth session, check for custom session
    if (request) {
      const sessionToken = request.cookies.get('session_token')?.value;
      console.log('🍪 Custom session token:', sessionToken ? 'found' : 'not found');
      
      if (sessionToken) {
        console.log('🔍 Validating custom session token...');
        const customSession = await getSessionFromToken(sessionToken);
        if (customSession && customSession.user) {
          console.log('✅ Custom session validated for user:', customSession.user.email);
          return customSession.user;
        } else {
          console.log('❌ Custom session validation failed');
        }
      }
    }

    console.log('❌ No valid session found');
    return null;
  } catch (error) {
    console.error('❌ Error getting authenticated user:', error);
    return null;
  }
}

export async function requireAuth(request) {
  console.log('🔐 requireAuth called');
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    console.log('❌ requireAuth: No user found, returning 401');
    return {
      error: 'Unauthorized',
      status: 401
    };
  }
  
  console.log('✅ requireAuth: User authenticated:', user.email);
  return { user };
} 