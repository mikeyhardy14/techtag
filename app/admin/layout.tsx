
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import './page.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard admin>
      <div className="flex flex-col md:flex-row min-h-screen">
        <AdminPanel />
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </AuthGuard>
  );
}
