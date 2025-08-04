"use client";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import LoginArea from "./LoginArea";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, isAuthenticated } = useAuth();

  return (
    <>
      {/* Hamburger Menu - always visible */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-[9999] p-4 rounded-lg bg-blue-600 border-2 border-blue-700 shadow-xl hover:bg-blue-700 transition-colors"
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '24px',
          left: '24px',
          backgroundColor: '#2563eb',
          border: '2px solid #1d4ed8',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        aria-label="Open sidebar"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth={3}
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col pt-28 z-[9998]" style={{ paddingTop: '80px' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Navigation Items */}
            <nav className="p-4 flex-1">
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                    </svg>
                    Main Page
                  </a>
                </li>
                <li>
                  <a
                    href="/playground"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    API Playground
                  </a>
                </li>

                <li>
                  <a
                    href="/dashboards"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Manage API keys
                  </a>
                </li>

                {/* Profile option - only show when signed in */}
                {isAuthenticated && (
                  <li>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </a>
                  </li>
                )}
              </ul>
            </nav>
            
            {/* Login Area */}
            <LoginArea />
          </div>
        </>
      )}
    </>
  );
} 