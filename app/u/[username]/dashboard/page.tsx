// app/dashboard/page.tsx
import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <DashboardSidebar>
        <SkeletonLoader />
      </DashboardSidebar>
    }>
      <DashboardClient />
    </Suspense>
  );
}
