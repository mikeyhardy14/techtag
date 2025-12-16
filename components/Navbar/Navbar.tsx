// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider/AuthProvider'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Only use transparent navbar on home page
  const isHomePage = pathname === '/';

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      // Force clear any remaining session data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear on error
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { 
      href: "/", 
      label: "Home", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      href: "/decode", 
      label: "Decoder", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      href: "/history", 
      label: "History", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <nav className={`${styles.navbar} ${(isScrolled || !isHomePage) ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo Section */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--tech-blue)"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.brandName}>TechTag</span>
            <span className={styles.brandTagline}>HVAC Pro Tools</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link 
                  href={`/u/${user.email?.split('@')[0]}/dashboard`} 
                  className={`${styles.navLink} ${styles.dashboardLink}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          {!loading && user ? (
            <div className={styles.userControls}>
              <div className={styles.userProfile}>
                <div className={styles.userAvatar}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                  <span className={styles.userRole}>Professional</span>
                </div>
              </div>
              <button onClick={handleSignOut} className={styles.signOutBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.signupBtn}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={closeMobileMenu}></div>
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuHeader}>
            </div>
            
            <nav className={styles.mobileNavLinks}>
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu} className={styles.mobileNavLink}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              {user && (
                <Link 
                  href={`/u/${user.email?.split('@')[0]}/dashboard`} 
                  onClick={closeMobileMenu}
                  className={`${styles.mobileNavLink} ${styles.dashboardMobileLink}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                  </svg>
                  <span>Dashboard</span>
                </Link>
              )}
            </nav>

            <div className={styles.mobileUserSection}>
              {!loading && user ? (
                <div className={styles.mobileUserControls}>
                  <div className={styles.mobileUserProfile}>
                    <div className={styles.userAvatar}>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                      <span className={styles.userRole}>Professional</span>
                    </div>
                  </div>
                  <button onClick={handleSignOut} className={styles.mobileSignOutBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                  <Link href="/signup" className={styles.mobileSignupBtn} onClick={closeMobileMenu}>
                    Save Your Decodes
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
