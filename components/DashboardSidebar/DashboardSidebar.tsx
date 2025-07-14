'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './DashboardSidebar.module.css';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
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

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/u/dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      path: '/u/dashboard',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      path: '/u/tasks',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      path: '/u/calendar',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      path: '/u/notifications',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/u/settings',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const isItemActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔧</span>
            {!isCollapsed && <span className={styles.logoText}>TechTag</span>}
          </div>
          <button 
            className={styles.collapseBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${isItemActive(item.path) ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={isCollapsed ? item.label : ''}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Filter Section */}
        {!isCollapsed && (
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <span className={styles.filterIcon}>🔍</span>
              <span className={styles.filterTitle}>FILTER</span>
            </div>
            <div className={styles.filterItems}>
              <div className={styles.filterItem}>
                <span>ALL LEAD</span>
                <span className={styles.filterCount}>394</span>
              </div>
              <div className={styles.filterItem}>
                <span>New (90)</span>
              </div>
              <div className={styles.filterItem}>
                <span>Total (394)</span>
              </div>
              <div className={styles.filterItem}>
                <span>Contacted Communication (20)</span>
              </div>
              <div className={styles.filterItem}>
                <span>Lost (70)</span>
              </div>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={styles.userSection}>
          {user && (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {!isCollapsed && (
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>Hi, {user.email?.split('@')[0]}</div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button className={styles.signOutBtn} onClick={handleSignOut}>
                  Sign Out
                </button>
              )}
            </>
          )}
        </div>

        {/* Help */}
        <div className={styles.helpSection}>
          <button className={styles.helpBtn} title="Help">
            <span className={styles.helpIcon}>❓</span>
            {!isCollapsed && <span>Help</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
} 