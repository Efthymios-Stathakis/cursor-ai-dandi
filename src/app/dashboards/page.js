"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 18);
}

const EyeIcon = ({ shown }) => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {shown ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5C7.305 4.5 3.135 7.364 1.5 12c1.635 4.636 5.805 7.5 10.5 7.5s8.865-2.864 10.5-7.5C20.865 7.364 16.695 4.5 12 4.5z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.015-.366 1.44" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 17.657A8.963 8.963 0 0112 19.5c-4.695 0-8.865-2.864-10.5-7.5a10.978 10.978 0 012.877-4.61M9.88 9.88A3 3 0 0112 15a3 3 0 01-2.12-.88" />
      </>
    )}
  </svg>
);
const CopyIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2}/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth={2}/></svg>
);
const EditIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" /></svg>
);
const TrashIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
);

export default function Dashboards() {
  const { data: session, status, isAuthenticated } = useAuth();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    
    setLoading(true);
    fetch("/api/keys")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/signin");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setApiKeys(data);
      })
      .catch(() => setError("Failed to load API keys."))
      .finally(() => setLoading(false));
  }, [session, status, isAuthenticated, router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDuplicateError("");
    const key = generateRandomKey();
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName, key }),
    });
    if (res.ok) {
      const created = await res.json();
      setApiKeys((prev) => [...prev, created]);
      setNewKeyName("");
    } else if (res.status === 401) {
      router.push("/auth/signin");
    } else {
      const err = await res.json();
      if (res.status === 409) {
        setDuplicateError(err.error);
        setTimeout(() => setDuplicateError(""), 2000);
      } else {
        setError("Failed to create API key.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    } else if (res.status === 401) {
      router.push("/auth/signin");
    } else {
      setError("Failed to delete API key.");
    }
    setLoading(false);
  };

  const startEdit = (key) => {
    setEditingKey(key.id);
    setEditingName(key.name);
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/keys/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    if (res.ok) {
      setApiKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, name: editingName } : k))
      );
      setEditingKey(null);
    } else if (res.status === 401) {
      router.push("/auth/signin");
    } else {
      setError("Failed to update API key.");
    }
    setLoading(false);
  };

  const handleShowKey = (id) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="text-lg">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex flex-col items-center py-12 px-2">
        {deleteSuccess && (
          <div
            className="fixed top-6 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in"
            style={{ backgroundColor: '#dc2626', backgroundImage: 'none' }}
          >
            API key deleted successfully
          </div>
        )}
        {duplicateError && (
          <div
            className="fixed top-20 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in"
            style={{ backgroundColor: '#dc2626', backgroundImage: 'none' }}
          >
            {duplicateError}
          </div>
        )}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-0">
          {/* Gradient header */}
          <div className="rounded-t-2xl p-8 pb-6" style={{ background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">API Keys</h2>
            <p className="mb-0 text-gray-700 text-sm">
              The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
            </p>
          </div>
          <div className="p-8 pt-4">
            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
              <input
                type="text"
                className="border rounded px-3 py-2 flex-1"
                placeholder="API Key Name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                +
              </button>
            </form>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase">
                    <th className="py-2">Name</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Usage</th>
                    <th className="py-2">Key</th>
                    <th className="py-2">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-6">No API keys found.</td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr key={key.id} className="bg-[#f9fafb] rounded-lg">
                        <td className="py-2 font-medium">{editingKey === key.id ? (
                          <input
                            className="border rounded px-2 py-1"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUpdate(key.id);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          key.name
                        )}</td>
                        <td className="py-2 text-xs text-gray-500">dev</td>
                        <td className="py-2 text-xs text-gray-500">0</td>
                        <td className="py-2 font-mono text-xs">
                          <span className="inline-block bg-[#f1f5f9] rounded px-3 py-1">
                            {showKey[key.id] ? key.key : key.key.slice(0, 8) + "-" + "*".repeat(16)}
                          </span>
                        </td>
                        <td className="py-2 flex gap-2 items-center">
                          <button type="button" title={showKey[key.id] ? "Hide" : "Show"} onClick={() => handleShowKey(key.id)} className="hover:text-blue-600">
                            <EyeIcon shown={showKey[key.id]} />
                          </button>
                          <button type="button" title="Copy" onClick={() => handleCopy(key.key, key.id)} className="hover:text-blue-600">
                            <CopyIcon />
                            {copiedId === key.id && <span className="ml-1 text-xs text-green-600">Copied!</span>}
                          </button>
                          {editingKey === key.id ? (
                            <>
                              <button type="button" title="Save" onClick={() => handleUpdate(key.id)} className="hover:text-green-600">
                                <EditIcon />
                              </button>
                              <button type="button" title="Cancel" onClick={() => setEditingKey(null)} className="hover:text-gray-600">
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" title="Edit" onClick={() => startEdit(key)} className="hover:text-yellow-600">
                                <EditIcon />
                              </button>
                              <button type="button" title="Delete" onClick={() => handleDelete(key.id)} className="hover:text-red-600">
                                <TrashIcon />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 