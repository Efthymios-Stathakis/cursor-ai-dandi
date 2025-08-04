import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import { getUserByEmail } from "./userManagement.js";

export async function getAuthenticatedUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return null;
    }

    // Get the user from the database using their email
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return {
      error: 'Unauthorized',
      status: 401
    };
  }
  
  return { user };
} 