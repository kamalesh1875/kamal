'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/FarmContext';
import { getDefaultRouteForRole } from '@/lib/auth';
import { ErpShell } from '@/components/layout/ErpShell';
import { DashboardView } from '@/components/views/DashboardView';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        const target = getDefaultRouteForRole(user.role);
        if (target && target !== '/') {
          router.replace(target);
        }
      }
    }
  }, [user, isAuthLoading, router]);

  return (
    <ErpShell activeTab="dashboard">
      <DashboardView />
    </ErpShell>
  );
}
