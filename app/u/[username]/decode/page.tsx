'use client';
import DecoderForm from '@/components/DecoderForm/DecoderForm';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import styles from './page.module.css';

export default function DecodePage() {
  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Model Decoder"
        actionButton={undefined}
      />
      <div className={styles.content}>
        <DecoderForm />
      </div>
    </DashboardSidebar>
  );
} 