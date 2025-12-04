"use client";

import styles from './page.module.css';

export default function AdminDashboard() {
  return (
    <section className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Manage plans, users, and datasets.</p>
    </section>
  );
}
