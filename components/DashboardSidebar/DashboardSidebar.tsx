'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './DashboardSidebar.module.css';

interface SidebarItem {
  id: string;
  label: string;
  icon: string | React.ReactNode; // Using SVG icons instead of emojis
  path: string;
  active?: boolean;
}

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
        </svg>
      ),
      path: `/u/${user?.email?.split('@')[0]}/dashboard`,
    },
    {
      id: 'decode',
      label: 'Model Decoder',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
        </svg>
      ),
      path: `/u/${user?.email?.split('@')[0]}/decode`,
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
        </svg>
      ),
      path: `/u/${user?.email?.split('@')[0]}/history`,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" fill="currentColor"/>
        </svg>
      ),
      path: `/u/${user?.email?.split('@')[0]}/analytics`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor"/>
        </svg>
      ),
      path: `/u/${user?.email?.split('@')[0]}/settings`,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemClick = (item: SidebarItem) => {
    router.push(item.path);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const isActiveItem = (item: SidebarItem) => {
    // Check for exact path match first
    if (pathname === item.path) return true;
    
    // Handle user-specific routes - check if the current path matches the item's route pattern
    if (pathname.startsWith('/u/')) {
      const pathSegments = pathname.split('/');
      const itemSegments = item.path.split('/');
      
      // For dashboard routes
      if (item.id === 'dashboard' && pathSegments[3] === 'dashboard') return true;
      if (item.id === 'projects' && pathSegments[3] === 'dashboard') return true;
      if (item.id === 'decode' && pathSegments[3] === 'decode') return true;
      if (item.id === 'history' && pathSegments[3] === 'history') return true;
      if (item.id === 'analytics' && pathSegments[3] === 'analytics') return true;
      if (item.id === 'settings' && pathSegments[3] === 'settings') return true;
    }
    
    return false;
  };

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <span className={styles.brandLogo}>TechTag</span>
        </div>
        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarContent}>
          {/* Brand Header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.brandContainer}>
              <div className={styles.brandIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#3B82F6"/>
                </svg>
              </div>
              {!isCollapsed && <span className={styles.brandText}>TechTag</span>}
            </div>
            <button 
              className={styles.collapseButton}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={isCollapsed ? "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" : "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"} fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {sidebarItems.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  <button
                    className={`${styles.navButton} ${isActiveItem(item) ? styles.active : ''}`}
                    onClick={() => handleItemClick(item)}
                    title={isCollapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                  </button>
                  {isCollapsed && (
                    <div className={styles.tooltip}>{item.label}</div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                  <span className={styles.userRole}>Engineer</span>
                </div>
              )}
            </div>
          )}
          <button
            className={styles.signOutButton}
            onClick={handleSignOut}
            title={isCollapsed ? "Sign Out" : undefined}
            aria-label="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <aside className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarContent}>
              {/* Brand Header */}
              <div className={styles.sidebarHeader}>
                <div className={styles.brandContainer}>
                  <div className={styles.brandIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#3B82F6"/>
                    </svg>
                  </div>
                  <span className={styles.brandText}>TechTag</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className={styles.nav}>
                <ul className={styles.navList}>
                  {sidebarItems.map((item) => (
                    <li key={item.id} className={styles.navItem}>
                      <button
                        className={`${styles.navButton} ${isActiveItem(item) ? styles.active : ''}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* User Section */}
            <div className={styles.userSection}>
              {user && (
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                    <span className={styles.userRole}>Engineer</span>
                  </div>
                </div>
              )}
              <button className={styles.signOutButton} onClick={handleSignOut}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ''}`}>
        {children}
      </main>
    </div>
  );
} 