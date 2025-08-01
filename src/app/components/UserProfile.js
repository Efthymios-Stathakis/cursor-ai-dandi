"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      // For now, use session data directly since the users table doesn't exist yet
      if (session) {
        const userData = {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
          provider: 'google',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserData(userData);
        setFormData({
          name: userData.name || "",
          image: userData.image || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // For now, just update the local state since the users table doesn't exist yet
      const updatedUserData = {
        ...userData,
        name: formData.name,
        image: formData.image,
        updated_at: new Date().toISOString()
      };
      setUserData(updatedUserData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4">
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: userData.name || "",
                  image: userData.image || ""
                });
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {userData.image && (
              <img
                src={userData.image}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {userData.name || "No name set"}
              </h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Provider:</span>
              <p className="text-gray-600 capitalize">{userData.provider}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Member since:</span>
              <p className="text-gray-600">
                {new Date(userData.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last updated:</span>
              <p className="text-gray-600">
                {new Date(userData.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">User ID:</span>
              <p className="text-gray-600 font-mono text-xs">{userData.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 