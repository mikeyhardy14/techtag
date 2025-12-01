export interface Profile {
  id: string;
  email: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  job_title?: string | null;
  company?: string | null;
  phone?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  
  // Notification preferences
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  
  // App preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  default_view: 'dashboard' | 'decode' | 'history' | 'analytics';
  
  // Privacy settings
  profile_visibility: 'public' | 'private';
  data_sharing: boolean;
  analytics: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
}

export interface ProfileUpdate {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  job_title?: string;
  company?: string;
  phone?: string;
  bio?: string;
  website?: string;
  location?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  timezone?: string;
  default_view?: 'dashboard' | 'decode' | 'history' | 'analytics';
  profile_visibility?: 'public' | 'private';
  data_sharing?: boolean;
  analytics?: boolean;
}

export interface CreateProfileData {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
}

