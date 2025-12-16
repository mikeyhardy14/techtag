'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useProfile } from '@/components/ProfileProvider/ProfileProvider';
import styles from './page.module.css';

export default function SettingsPage() {
  const { user, session, signOut } = useAuth();
  const { profile, updateProfile, uploadAvatar, deleteAvatar, loading: profileLoading } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState<'success' | 'error'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialFormDataRef = useRef<string>('');
  
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    job_title: '',
    company: '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    email_notifications: true,
    push_notifications: false,
    sms_notifications: false,
    theme: 'light' as 'light' | 'dark' | 'auto',
      language: 'en',
      timezone: 'UTC-5',
    default_view: 'dashboard' as 'dashboard' | 'decode' | 'history' | 'analytics',
    profile_visibility: 'private' as 'public' | 'private',
    data_sharing: false,
      analytics: true,
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      const loadedData = {
        display_name: profile.display_name || '',
        username: profile.username || '',
        job_title: profile.job_title || '',
        company: profile.company || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        email_notifications: profile.email_notifications,
        push_notifications: profile.push_notifications,
        sms_notifications: profile.sms_notifications,
        theme: profile.theme,
        language: profile.language,
        timezone: profile.timezone,
        default_view: profile.default_view,
        profile_visibility: profile.profile_visibility,
        data_sharing: profile.data_sharing,
        analytics: profile.analytics,
      };
      setFormData(loadedData);
      initialFormDataRef.current = JSON.stringify(loadedData);
      setHasUnsavedChanges(false);
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [profile]);

  // Track unsaved changes
  useEffect(() => {
    if (initialFormDataRef.current) {
      const currentData = JSON.stringify(formData);
      setHasUnsavedChanges(currentData !== initialFormDataRef.current);
    }
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent duplicate saves
    setIsSaving(true);
    setSaveMessage('');

    try {
      const success = await updateProfile(formData);
      
      if (success) {
        setSaveMessageType('success');
        setSaveMessage('Settings saved successfully!');
        initialFormDataRef.current = JSON.stringify(formData);
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessageType('error');
        setSaveMessage('Failed to save settings. Please try again.');
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessageType('error');
      setSaveMessage('An error occurred. Please try again.');
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveMessageType('error');
      setSaveMessage('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      setTimeout(() => setSaveMessage(''), 5000);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSaveMessageType('error');
      setSaveMessage('File size exceeds 5MB limit.');
      setTimeout(() => setSaveMessage(''), 5000);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setIsSaving(true);
    const success = await uploadAvatar(file);
    setIsSaving(false);

    if (success) {
      setSaveMessageType('success');
      setSaveMessage('Avatar updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessageType('error');
      setSaveMessage('Failed to upload avatar. Please try again.');
      setAvatarPreview(profile?.avatar_url || null);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) return;

    setIsSaving(true);
    const success = await deleteAvatar();
    setIsSaving(false);

    if (success) {
      setSaveMessageType('success');
      setAvatarPreview(null);
      setSaveMessage('Avatar deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessageType('error');
      setSaveMessage('Failed to delete avatar. Please try again.');
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) return;

    setIsSaving(true);
    try {
      const token = session?.access_token;
      
      if (!token) {
        setSaveMessageType('error');
        setSaveMessage('Authentication error. Please log in again.');
        setTimeout(() => setSaveMessage(''), 5000);
        setIsSaving(false);
        return;
      }

      // Delete profile from database
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Sign out the user
        await signOut();
        // Redirect to home page
        window.location.href = '/';
      } else {
        setSaveMessageType('error');
        setSaveMessage('Failed to delete account. Please try again.');
        setTimeout(() => setSaveMessage(''), 5000);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setSaveMessageType('error');
      setSaveMessage('An error occurred. Please try again.');
      setTimeout(() => setSaveMessage(''), 5000);
      setIsSaving(false);
    }
  };

  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Settings"
        actionButton={{
          label: isSaving ? "SAVING..." : "SAVE CHANGES",
          icon: "💾",
          onClick: handleSave
        }}
      />
      
      {saveMessage && (
        <div className={`${styles.saveMessage} ${saveMessageType === 'error' ? styles.saveMessageError : ''}`}>
          {saveMessageType === 'success' ? '✓' : '⚠'} {saveMessage}
        </div>
      )}
      
      {/* Floating Save Button */}
      {hasUnsavedChanges && (
        <div className={styles.floatingSaveBar}>
          <span className={styles.unsavedText}>You have unsaved changes</span>
          <button 
            className={styles.floatingSaveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className={styles.spinner}></span>
                Saving...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.settingsGrid}>
          {/* Account Settings */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Account Settings</h3>
            </div>
            <div className={styles.cardContent}>
              {/* Avatar Upload */}
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Profile Picture</label>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarPreview} onClick={handleAvatarClick}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {formData.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className={styles.avatarOverlay}>
                      <span>Change</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className={styles.avatarInput}
                  />
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  className={styles.settingInput}
                  disabled
                />
                <span className={styles.settingHint}>Contact support to change your email</span>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={styles.settingInput}
                  placeholder="Enter your username"
                />
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Display Name</label>
                <input 
                  type="text" 
                  value={formData.display_name} 
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  className={styles.settingInput}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Job Title</label>
                <input 
                  type="text" 
                  value={formData.job_title} 
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className={styles.settingInput}
                  placeholder="e.g. HVAC Engineer"
                />
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Company</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={styles.settingInput}
                  placeholder="Enter your company name"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Phone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={styles.settingInput}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={styles.settingInput}
                  placeholder="City, Country"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Website</label>
                <input 
                  type="url" 
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={styles.settingInput}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={styles.settingTextarea}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Notifications</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.settingItem}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Email Notifications</span>
                    <span className={styles.toggleDescription}>Receive updates via email</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={formData.email_notifications}
                      onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Push Notifications</span>
                    <span className={styles.toggleDescription}>Browser notifications for important updates</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={formData.push_notifications}
                      onChange={(e) => handleInputChange('push_notifications', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>SMS Notifications</span>
                    <span className={styles.toggleDescription}>Text messages for critical alerts</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={formData.sms_notifications}
                      onChange={(e) => handleInputChange('sms_notifications', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Preferences</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Theme</label>
                <select 
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Language</label>
                <select 
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Timezone</label>
                <select 
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                </select>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Default Landing Page</label>
                <select 
                  value={formData.default_view}
                  onChange={(e) => handleInputChange('default_view', e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="decode">Model Decoder</option>
                  <option value="history">History</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Privacy & Security</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Profile Visibility</label>
                <select 
                  value={formData.profile_visibility}
                  onChange={(e) => handleInputChange('profile_visibility', e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <span className={styles.settingHint}>
                  {formData.profile_visibility === 'public' 
                    ? 'Your profile can be viewed by anyone' 
                    : 'Only you can view your profile'}
                </span>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Data Analytics</span>
                    <span className={styles.toggleDescription}>Help improve the app by sharing usage data</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={formData.analytics}
                      onChange={(e) => handleInputChange('analytics', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <button 
                  className={styles.dangerButton}
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete Account
                </button>
                <span className={styles.settingHint}>Permanently delete your account and all data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
} 