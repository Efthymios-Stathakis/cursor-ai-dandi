"use client";

import { useSession } from "next-auth/react";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border text-xs">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <div className="space-y-1">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Session:</strong> {session ? "Yes" : "No"}</p>
        {session && (
          <>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
          </>
        )}
      </div>
    </div>
  );
} 