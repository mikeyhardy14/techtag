'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  onSearch?: (query: string) => void;
}

export default function DashboardHeader({ title, actionButton, onSearch }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.subtitle}>Manage your HVAC projects efficiently</span>
        </div>
      </div>
      
      <div className={styles.headerCenter}>
        <div className={`${styles.searchContainer} ${isSearchFocused ? styles.searchFocused : ''}`}>
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search projects, clients, or models..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.searchClear}
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.headerRight}>
        {actionButton && (
          <button 
            className={styles.actionButton}
            onClick={actionButton.onClick}
          >
            <div className={styles.actionIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.actionLabel}>{actionButton.label}</span>
          </button>
        )}
        
        {/* Notifications */}
        <button className={styles.notificationButton} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className={styles.notificationBadge}>3</div>
        </button>

        {/* User Menu */}
        {user && (
          <div className={styles.userMenu}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                  alt={`${user.email} avatar`}
                  className={styles.avatarImage}
                />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                <span className={styles.userRole}>HVAC Engineer</span>
              </div>
              <div className={styles.dropdownIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* Dropdown menu - hidden by default, would be shown on click */}
            <div className={styles.userDropdown}>
              <a href="/profile" className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Profile
              </a>
              <a href="/settings" className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Settings
              </a>
              <hr className={styles.dropdownDivider} />
              <button className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 