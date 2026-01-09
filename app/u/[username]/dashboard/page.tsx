// app/dashboard/page.tsx
// Redirects to decoder - dashboard functionality preserved in DashboardClient.tsx for later use
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    router.replace(`/u/${username}/decode`);
  }, [router, username]);

  return null;
}
