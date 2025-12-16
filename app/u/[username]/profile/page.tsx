'use client';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useProfile } from '@/components/ProfileProvider/ProfileProvider';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="Profile" />
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading profile...</p>
          </div>
        </div>
      </DashboardSidebar>
    );
  }

  if (!profile) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="Profile" />
        <div className={styles.content}>
          <div className={styles.profileContainer}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>No Profile Found</h2>
              <p className={styles.emptyDescription}>
                Your profile hasn't been set up yet. Create one to personalize your experience.
              </p>
              <Link href={`/u/${user?.email?.split('@')[0]}/settings`} className={styles.setupButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Set Up Profile
              </Link>
            </div>
          </div>
        </div>
      </DashboardSidebar>
    );
  }

  const displayName = profile.display_name || user?.email?.split('@')[0] || 'User';
  const username = profile.username || user?.email?.split('@')[0];

  return (
    <DashboardSidebar>
      <DashboardHeader title="Profile" />
      
      <div className={styles.content}>
        <div className={styles.profileContainer}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.headerContent}>
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {displayName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.userInfo}>
                <h1 className={styles.displayName}>{displayName}</h1>
                <p className={styles.username}>@{username}</p>
                
                <div className={styles.userMeta}>
                  {profile.job_title && (
                    <div className={styles.metaItem}>
                      <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{profile.job_title}</span>
                    </div>
                  )}
                  {profile.company && (
                    <div className={styles.metaItem}>
                      <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{profile.company}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className={styles.metaItem}>
                      <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Cards */}
          <div className={styles.profileGrid}>
            {/* Contact Information */}
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Contact Information</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{profile.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={`${styles.infoValue} ${!profile.phone ? styles.infoValueEmpty : ''}`}>
                    {profile.phone || 'Not provided'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Website</span>
                  <span className={`${styles.infoValue} ${!profile.website ? styles.infoValueEmpty : ''}`}>
                    {profile.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>
                        {profile.website}
                      </a>
                    ) : 'Not provided'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={`${styles.infoValue} ${!profile.location ? styles.infoValueEmpty : ''}`}>
                    {profile.location || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Account Details</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Username</span>
                  <span className={styles.infoValue}>@{username}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>{formatDate(profile.created_at)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Login</span>
                  <span className={styles.infoValue}>{formatDate(profile.last_login_at)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Profile Visibility</span>
                  <span className={`${styles.statusBadge} ${profile.profile_visibility === 'public' ? styles.statusPublic : styles.statusPrivate}`}>
                    {profile.profile_visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Card */}
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>About</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Job Title</span>
                  <span className={`${styles.infoValue} ${!profile.job_title ? styles.infoValueEmpty : ''}`}>
                    {profile.job_title || 'Not provided'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Company</span>
                  <span className={`${styles.infoValue} ${!profile.company ? styles.infoValueEmpty : ''}`}>
                    {profile.company || 'Not provided'}
                  </span>
                </div>
                <div className={styles.bioSection}>
                  <p className={styles.bioLabel}>Bio</p>
                  {profile.bio ? (
                    <p className={styles.bioText}>{profile.bio}</p>
                  ) : (
                    <p className={styles.bioEmpty}>No bio provided yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}

