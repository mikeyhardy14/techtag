// components/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider/AuthProvider'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false); // Close menu after sign out
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/logo.png" alt="TechTag logo" width={32} height={32} />
        <span className={styles.logoText}>TechTag</span>
      </Link>

      {/* Hamburger Menu Button */}
      <button 
        className={styles.hamburger}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
      </button>

      {/* Navigation Menu */}
      <div className={`${styles.navMenu} ${isMobileMenuOpen ? styles.navMenuOpen : ''}`}>
        <ul className={styles.navLinks}>
          <li><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link href="/decode" onClick={closeMobileMenu}>Decoder</Link></li>
          {user && (
            <li><Link href={`/u/${user.email?.split('@')[0]}/dashboard`} onClick={closeMobileMenu}>Dashboard</Link></li>
          )}
          <li><Link href="/about" onClick={closeMobileMenu}>About</Link></li>
        </ul>

        <div className={styles.authButtons}>
          {!loading && user ? (
            <>
              <span className={styles.userEmail}>
                {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleSignOut} 
                className={`${styles.btn} ${styles.signOut}`}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`${styles.btn} ${styles.login}`} onClick={closeMobileMenu}>
                Login
              </Link>
              <Link href="/signup" className={`${styles.btn} ${styles.signup}`} onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}
    </nav>
  )
}
