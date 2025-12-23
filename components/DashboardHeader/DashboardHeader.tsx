'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useProjects } from '@/components/ProjectsProvider/ProjectsProvider';
import styles from './DashboardHeader.module.css';

interface SearchResult {
  type: 'project' | 'client';
  id: string;
  title: string;
  subtitle?: string;
  projectId?: string;
}

interface DashboardHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  onSearch?: (query: string) => void;
  onProjectSelect?: (projectId: string) => void;
}

export default function DashboardHeader({ title, actionButton, onSearch, onProjectSelect }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Get search results
  const getSearchResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    const seenClients = new Set<string>();

    projects.forEach(project => {
      // Match by project name
      if (project.name.toLowerCase().includes(query)) {
        results.push({
          type: 'project',
          id: `project-${project.id}`,
          title: project.name,
          subtitle: `${project.client} • ${project.model}`,
          projectId: project.id,
        });
      }
      
      // Match by client (deduplicated)
      if (project.client.toLowerCase().includes(query) && !seenClients.has(project.client)) {
        seenClients.add(project.client);
        results.push({
          type: 'client',
          id: `client-${project.client}`,
          title: project.client,
          subtitle: `Client`,
          projectId: project.id,
        });
      }

      // Match by model
      if (project.model.toLowerCase().includes(query)) {
        results.push({
          type: 'project',
          id: `model-${project.id}`,
          title: project.model,
          subtitle: `${project.name} • ${project.client}`,
          projectId: project.id,
        });
      }
    });

    return results.slice(0, 5); // Limit to 5 results
  };

  const searchResults = getSearchResults();
  const hasResults = searchResults.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowDropdown(query.length > 0);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setShowDropdown(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.projectId) {
      if (onProjectSelect) {
        // Use callback if provided (for dashboard page)
        onProjectSelect(result.projectId);
      } else {
        // Navigate to dashboard with project query param for other pages
        const username = user?.email?.split('@')[0] || 'user';
        router.push(`/u/${username}/dashboard?project=${result.projectId}`);
      }
    }
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleDecoderLookup = () => {
    router.push(`/decode?q=${encodeURIComponent(searchQuery)}`);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay to allow click on dropdown items
    setTimeout(() => {
      // Only close if not focused on something in the container
    }, 150);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
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
        <div 
          ref={searchContainerRef}
          className={`${styles.searchContainer} ${isSearchFocused ? styles.searchFocused : ''}`}
        >
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
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
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
          
          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className={styles.searchDropdown}>
              {hasResults ? (
                <>
                  <div className={styles.searchResultsSection}>
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        className={styles.searchResultItem}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className={styles.searchResultIcon}>
                          {result.type === 'project' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className={styles.searchResultText}>
                          <span className={styles.searchResultTitle}>{result.title}</span>
                          {result.subtitle && (
                            <span className={styles.searchResultSubtitle}>{result.subtitle}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className={styles.searchDropdownDivider} />
                </>
              ) : (
                <div className={styles.noResultsMessage}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>No projects or clients found for "{searchQuery}"</span>
                </div>
              )}
              
              <button
                className={styles.decoderLookupButton}
                onClick={handleDecoderLookup}
              >
                <div className={styles.decoderIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.decoderLookupText}>
                  <span className={styles.decoderLookupTitle}>Look up "{searchQuery}" in Decoder</span>
                  <span className={styles.decoderLookupSubtitle}>Search HVAC model databases</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.decoderArrow}>
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
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
              <a href={`/u/${user.email?.split('@')[0]}/profile`} className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Profile
              </a>
              <a href={`/u/${user.email?.split('@')[0]}/settings`} className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Settings
              </a>
              <hr className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={handleSignOut}>
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