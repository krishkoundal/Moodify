'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/verify-otp';

  if (isAuthPage) {
    return <>{children}</>;
  }


  return <ClientLayout>{children}</ClientLayout>;
}
