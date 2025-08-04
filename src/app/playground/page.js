"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Redirect to protected page with the API key
    window.location.href = `/protected?key=${encodeURIComponent(apiKey)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
            API Playground
          </h1>
          <p className="text-gray-600 mb-4 text-center text-sm">
            Enter your API key to test access.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your API key"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Validating..." : "Validate API Key"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 