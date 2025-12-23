'use client';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import HistoryKPICards from '@/components/HistoryKPICards/HistoryKPICards';
import HistoryTable from '@/components/HistoryTable/HistoryTable';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import styles from './page.module.css';

export default function HistoryPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="History" />
        <div className={styles.content}>
          <SkeletonLoader />
        </div>
      </DashboardSidebar>
    );
  }

  return (
    <DashboardSidebar>
      <DashboardHeader title="History" />
      
      <div className={styles.content}>
        {/* KPI Cards */}
        <HistoryKPICards />

        {/* History Table */}
        <div className={styles.historySection}>
          <HistoryTable />
        </div>
      </div>
    </DashboardSidebar>
  );
}
