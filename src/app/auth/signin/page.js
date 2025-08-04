"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    console.log('🔍 Email auth form submitted');
    console.log('📧 Email:', email);
    console.log('👤 Is signup:', isSignUp);
    console.log('📝 First name:', firstName);
    console.log('📝 Last name:', lastName);

    try {
      if (isSignUp) {
        console.log('📝 Making signup request...');
        // For signup, we need to create the user first
        const response = await fetch('/api/auth/email-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
          }),
        });

        console.log('📡 Signup response status:', response.status);
        const data = await response.json();
        console.log('📄 Signup response data:', data);

        if (response.ok) {
          if (data.verificationUrl) {
            // Development mode - show the verification URL
            setMessage(
              `Development: Click this link to verify: ${data.verificationUrl}`
            );
          } else {
            setMessage("Check your email for a sign-up link!");
          }
        } else {
          setMessage(data.error || "An error occurred. Please try again.");
        }
      } else {
        console.log('📝 Making signin request...');
        // For signin, use our custom email signin API
        const response = await fetch('/api/auth/email-signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });

        console.log('📡 Signin response status:', response.status);
        const data = await response.json();
        console.log('📄 Signin response data:', data);

        if (response.ok) {
          if (data.verificationUrl) {
            // Development mode - show the verification URL
            setMessage(
              `Development: Click this link to verify: ${data.verificationUrl}`
            );
          } else {
            setMessage("Check your email for a sign-in link!");
          }
        } else {
          setMessage(data.error || "An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error('❌ Email auth error:', error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  if (isEmailMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEmailMode(false)}
                className="p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">
                {isSignUp ? "Sign up with email" : "Sign in with email"}
              </CardTitle>
            </div>
            <CardDescription>
              {isSignUp 
                ? "Create your account with email and password-free authentication"
                : "Sign in to your account with a magic link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isSignUp}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isSignUp}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes("Check your email") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message.includes("Development: Click this link to verify:") ? (
                    <div>
                      <p className="mb-2">{message.split("Development: Click this link to verify:")[0]}</p>
                      <a 
                        href={message.split("Development: Click this link to verify:")[1]}
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here to verify
                      </a>
                    </div>
                  ) : (
                    message
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {isSignUp ? "Sign Up" : "Send Magic Link"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome to Dandy GitHub Analyzer
          </CardTitle>
          <CardDescription className="text-center">
            Choose how you'd like to sign in to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full"
            variant="outline"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              setIsEmailMode(true);
              setIsSignUp(false);
            }}
            className="w-full"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Sign in with email
          </Button>

          <Button
            onClick={() => {
              setIsEmailMode(true);
              setIsSignUp(true);
            }}
            className="w-full"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Sign up with email
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/")}
              className="text-sm"
            >
              Back to home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 