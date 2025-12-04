// components/AuthGuard/AuthGuard.tsx
"use client";
import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './AuthGuard.module.css';

interface AuthGuardProps {
  children: ReactNode;
  admin?: boolean;
}

export default function AuthGuard({ children, admin = false }: AuthGuardProps) {
  const sessionData = useSession();
  const router = useRouter();

  // Handle case where useSession returns undefined during SSR/prerendering
  const session = sessionData?.data;
  const status = sessionData?.status ?? 'loading';

  // List of admin emails via env var (comma-separated)
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && admin) {
      // Redirect non-admins
      if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
        router.push('/');
      }
    }
  }, [status, session, admin, router, adminEmails]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'authenticated' && session?.user?.email) {
    // Prevent rendering if admin access is required and user is not admin
    if (admin && !adminEmails.includes(session.user.email)) {
      return null;
    }
    return <>{children}</>;
  }

  return null;
}