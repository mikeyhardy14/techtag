import Link from 'next/link';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Admin Panel</h2>
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/admin/upload" className={styles.link}>
          Upload Data
        </Link>
        <Link href="/admin/users" className={styles.link}>
          Manage Users
        </Link>
      </nav>
    </div>
  );
} 