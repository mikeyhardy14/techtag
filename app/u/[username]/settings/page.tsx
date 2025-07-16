'use client';
import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './page.module.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5',
      defaultView: 'dashboard',
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true,
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically save to your backend
  };

  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Settings"
        actionButton={{
          label: "SAVE CHANGES",
          icon: "💾",
          onClick: handleSave
        }}
      />
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
                <label className={styles.settingLabel}>Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.email?.split('@')[0] || ''} 
                  className={styles.settingInput}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Job Title</label>
                <input 
                  type="text" 
                  defaultValue="HVAC Engineer" 
                  className={styles.settingInput}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Company</label>
                <input 
                  type="text" 
                  placeholder="Enter your company name" 
                  className={styles.settingInput}
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
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
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
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
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
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
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
                  value={settings.preferences.theme}
                  onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
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
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
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
                  value={settings.preferences.timezone}
                  onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
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
                  value={settings.preferences.defaultView}
                  onChange={(e) => handleSettingChange('preferences', 'defaultView', e.target.value)}
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
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Data Analytics</span>
                    <span className={styles.toggleDescription}>Help improve the app by sharing usage data</span>
                  </div>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.analytics}
                      onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <button className={styles.dangerButton}>
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