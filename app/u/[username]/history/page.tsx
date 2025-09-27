'use client';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import HistoryTable from '@/components/HistoryTable/HistoryTable';
import styles from './page.module.css';

export default function HistoryPage() {
  return (
    <DashboardSidebar>
      <DashboardHeader
        title="History"
        actionButton={{
          label: "CREATE PROJECT",
          icon: "🗑️",
          onClick: () => { /* TODO: Implement clear history functionality */ }
        }}
      />
      <div className={styles.content}>
        <div className={styles.overviewCards}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Models Decoded</div>
            </div>
            <div className={styles.cardValue}>247</div>
            <div className={styles.cardSubtext}>This month</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Recent Activity</div>
            </div>
            <div className={styles.cardValue}>42</div>
            <div className={styles.cardSubtext}>Last 7 days</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Top Brand</div>
            </div>
            <div className={styles.cardValue}>Carrier</div>
            <div className={styles.cardSubtext}>Most decoded</div>
          </div>
        </div>

        <div className={styles.historySection}>
          <HistoryTable />
        </div>
      </div>
    </DashboardSidebar>
  );
} 