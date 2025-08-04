"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const [customSession, setCustomSession] = useState(null);
  const [customSessionStatus, setCustomSessionStatus] = useState("loading");

  const checkCustomSession = async () => {
    try {
      console.log('🔍 Checking custom session...');
      
      // Since the session cookie is httpOnly, we can't read it directly
      // Instead, we'll call a server endpoint that can access the cookie
      console.log('📞 Calling session check API...');
      const response = await fetch('/api/auth/check-session', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      console.log('📡 Session check response status:', response.status);

      if (response.ok) {
        const sessionData = await response.json();
        console.log('✅ Session check successful:', sessionData.user.email);
        setCustomSession({
          user: sessionData.user,
          sessionToken: sessionData.sessionToken,
          provider: 'custom'
        });
        setCustomSessionStatus("authenticated");
      } else {
        console.log('❌ Session check failed - no valid session');
        setCustomSession(null);
        setCustomSessionStatus("unauthenticated");
      }
    } catch (error) {
      console.error('❌ Error checking custom session:', error);
      setCustomSession(null);
      setCustomSessionStatus("unauthenticated");
    }
  };

  useEffect(() => {
    checkCustomSession();
  }, []);

  // Also check when the component mounts and after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏰ Checking session again after delay...');
      checkCustomSession();
    }, 1000); // Check again after 1 second

    return () => clearTimeout(timer);
  }, []);

  // Log the final state
  useEffect(() => {
    console.log('🎯 Auth state:', {
      nextAuthStatus,
      customSessionStatus,
      isAuthenticated: nextAuthSession || customSession,
      provider: nextAuthSession ? 'nextauth' : customSession ? 'custom' : 'none'
    });
  }, [nextAuthStatus, customSessionStatus, nextAuthSession, customSession]);

  // Return the appropriate session based on what's available
  if (nextAuthStatus === "loading" || customSessionStatus === "loading") {
    return {
      data: null,
      status: "loading",
      isAuthenticated: false,
    };
  }

  if (nextAuthSession) {
    return {
      data: nextAuthSession,
      status: "authenticated",
      isAuthenticated: true,
      provider: "nextauth",
    };
  }

  if (customSession) {
    return {
      data: customSession,
      status: "authenticated",
      isAuthenticated: true,
      provider: "custom",
    };
  }

  return {
    data: null,
    status: "unauthenticated",
    isAuthenticated: false,
  };
} 