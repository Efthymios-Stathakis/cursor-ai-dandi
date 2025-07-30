"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Protected() {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const validateApiKey = async () => {
      const apiKey = searchParams.get("key");
      
      if (!apiKey) {
        setIsValid(false);
        setLoading(false);
        setShowNotification(true);
        return;
      }

      try {
        // Check if the API key exists in our database
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key: apiKey }),
        });

        const result = await response.json();
        setIsValid(result.valid);
        setShowNotification(true);
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsValid(false);
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    validateApiKey();
  }, [searchParams]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Validating API key...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-lg">
          {isValid ? (
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
              Valid API key, /protected can be accessed
            </div>
          ) : (
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
              Invalid API key
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Protected Resource
          </h1>
          
          {isValid ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Access Granted</span>
                </div>
                <p className="mt-1 text-xs text-green-700">
                  Your API key is valid. You can now access protected resources.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Welcome to the Protected Area
                </h3>
                <p className="text-xs text-gray-600">
                  This is a protected resource that requires a valid API key to access.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-800">Access Denied</span>
                </div>
                <p className="mt-1 text-xs text-red-700">
                  The provided API key is invalid or does not exist.
                </p>
              </div>
              
              <div className="text-center">
                <a
                  href="/playground"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 