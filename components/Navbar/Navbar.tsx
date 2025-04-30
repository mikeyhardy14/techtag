// components/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <Image src="/logo.png" alt="TechTag logo" width={32} height={32} />
        <span className={styles.logoText}>TechTag</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/features">Features</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/resources">Resources</Link></li>
      </ul>

      <div className={styles.authButtons}>
        <Link href="/login" className={`${styles.btn} ${styles.login}`}>
          Login
        </Link>
        <Link href="/signup" className={`${styles.btn} ${styles.signup}`}>
          Sign Up
        </Link>
      </div>
    </nav>
  )
}
