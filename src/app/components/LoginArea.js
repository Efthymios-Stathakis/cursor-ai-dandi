"use client";

import { signIn, signOut } from "next-auth/react";
import { useAuth } from "../hooks/useAuth.js";
import Link from "next/link";
import Image from "next/image";

export default function LoginArea() {
  const { data: session, status, isAuthenticated } = useAuth();

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
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2 mt-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && session) {
    return (
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-3 mb-3">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session.user?.email}
            </p>
          </div>
        </div>
        
        {/* Profile Link */}
        <div className="mb-3">
          <Link
            href="/profile"
            className="w-full flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Profile
          </Link>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-600 mb-2">Sign in to access all features</p>
      </div>
      <button
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
} 