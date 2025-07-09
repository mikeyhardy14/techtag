// components/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider/AuthProvider'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/logo.png" alt="TechTag logo" width={32} height={32} />
        <span className={styles.logoText}>TechTag</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/decode">Decoder</Link></li>
        {user && (
          <li><Link href={`/u/${user.email?.split('@')[0]}/dashboard`}>Dashboard</Link></li>
        )}
        <li><Link href="/about">About</Link></li>
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
            <Link href="/login" className={`${styles.btn} ${styles.login}`}>
              Login
            </Link>
            <Link href="/signup" className={`${styles.btn} ${styles.signup}`}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
