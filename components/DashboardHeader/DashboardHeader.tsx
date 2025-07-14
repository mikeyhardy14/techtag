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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      
      <div className={styles.headerCenter}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.headerRight}>
        {user && (
          <div className={styles.userSection}>
            <span className={styles.greeting}>Hi, {user.email?.split('@')[0]}</span>
            <div className={styles.userAvatar}>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}
        
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={styles.actionButton}
          >
            {actionButton.icon && <span className={styles.actionIcon}>{actionButton.icon}</span>}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
} 