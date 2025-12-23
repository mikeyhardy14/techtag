'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DecoderForm from '@/components/DecoderForm/DecoderForm';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import styles from './page.module.css';

function DecodeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  return (
    <div className={styles.content}>
      <DecoderForm initialQuery={initialQuery} />
    </div>
  );
}

export default function DecodePage() {
  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Model Decoder"
        actionButton={undefined}
      />
      <Suspense fallback={
        <div className={styles.content}>
          <DecoderForm />
        </div>
      }>
        <DecodeContent />
      </Suspense>
    </DashboardSidebar>
  );
} 