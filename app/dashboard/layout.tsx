
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import './page.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
