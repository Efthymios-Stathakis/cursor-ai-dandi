"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(session.user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setDbUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Your Google account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {session.user?.name || "User"}
                </h2>
                <p className="text-blue-100">{session.user?.email}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-sm">Verified Google Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{session.user?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">{session.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <p className="mt-1 text-sm text-gray-900">Google Account</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sign-in Method</label>
                    <p className="mt-1 text-sm text-gray-900">OAuth 2.0 (Google)</p>
                  </div>
                </div>
              </div>

              {/* Database Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Database ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {dbUser?.id || (loading ? "Loading..." : "Not available")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {dbUser?.created_at ? new Date(dbUser.created_at).toLocaleDateString() : (loading ? "Loading..." : "Not available")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {dbUser?.updated_at ? new Date(dbUser.updated_at).toLocaleDateString() : (loading ? "Loading..." : "Not available")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Database Status</label>
                    <div className="mt-1 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${dbUser ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-900">
                        {dbUser ? "Stored in database" : (loading ? "Loading..." : "Not stored")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session Status</label>
                  <div className="mt-1 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-900">Active</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider</label>
                  <p className="mt-1 text-sm text-gray-900">Google</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Access Token</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {session.accessToken ? "Available" : "Not available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {session.user?.id || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.open("https://myaccount.google.com", "_blank")}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Manage Google Account
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Your Account</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              This profile displays information from your Google account and our database. Your data is securely handled through Google's OAuth 2.0 authentication system and stored in our Supabase database.
            </p>
            <p>
              When you sign in for the first time, your account information is automatically stored in our database for enhanced functionality and personalization.
            </p>
            <p>
              You can manage your Google account settings, privacy, and security by visiting your Google Account dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 