import { NextResponse } from "next/server";

export default function middleware(req) {
  // Check for NextAuth session token
  const nextAuthToken = req.cookies.get("next-auth.session-token")?.value || 
                       req.cookies.get("__Secure-next-auth.session-token")?.value;
  
  // Check for custom session token
  const sessionToken = req.cookies.get("session_token")?.value;
  
  console.log('🔍 Middleware - NextAuth token:', nextAuthToken ? 'found' : 'not found');
  console.log('🔍 Middleware - Custom session token:', sessionToken ? 'found' : 'not found');
  
  // If either session exists, allow the request
  if (nextAuthToken || sessionToken) {
    console.log('✅ Middleware - Session found, allowing request');
    return NextResponse.next();
  }
  
  // No session found, redirect to signin
  console.log('❌ Middleware - No session found, redirecting to signin');
  const signinUrl = new URL('/auth/signin', req.url);
  signinUrl.searchParams.set('callbackUrl', req.url);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: [
    "/dashboards/:path*",
    "/protected/:path*",
    "/profile/:path*",
  ],
}; 