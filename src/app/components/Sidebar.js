"use client";
import { useState } from "react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Deploy Now
                  </a>
                </li>
                <li>
                  <a
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read our docs
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
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
} 