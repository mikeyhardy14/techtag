

import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <section className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
      <p>Here you can view your decode history and manage your subscription.</p>
    </section>
  );
}