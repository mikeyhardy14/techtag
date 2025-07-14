'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on dashboard pages since they use the sidebar layout
  const isDashboardPage = pathname?.startsWith('/u/');
  
  if (isDashboardPage) {
    return null;
  }
  
  return <Navbar />;
} 