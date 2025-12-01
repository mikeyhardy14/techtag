"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { Profile, ProfileUpdate } from '@/types/profile';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: ProfileUpdate) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  deleteAvatar: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when user and session are available
  useEffect(() => {
    if (user && session) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the session token
      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate): Promise<boolean> => {
    try {
      setError(null);

      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      setError(null);

      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const data = await response.json();
      setProfile(data.profile);
      return true;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      return false;
    }
  };

  const deleteAvatar = async (): Promise<boolean> => {
    try {
      setError(null);

      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete avatar');
      }

      const data = await response.json();
      setProfile(data.profile);
      return true;
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete avatar');
      return false;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refreshProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

