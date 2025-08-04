"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    try {
      // Clear both custom and NextAuth sessions
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Also call NextAuth signOut to ensure it's properly handled
        await signOut({ callbackUrl: '/' });
        
        // Force a page reload to ensure all state is cleared
        window.location.reload();
      } else {
        // If the API call fails, still try NextAuth signOut
        await signOut({ callbackUrl: '/' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: try NextAuth signOut and reload
      try {
        await signOut({ callbackUrl: '/' });
      } catch (nextAuthError) {
        console.error('NextAuth signOut error:', nextAuthError);
      }
      window.location.reload();
    }
  };

  if (status === "loading") {
    return (
      <button className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md">
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign In
    </button>
  );
} 