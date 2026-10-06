'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { DashboardView } from '@/components/views/DashboardView';

export default function DashboardPage() {
  return (
    <ErpShell activeTab="dashboard">
      <DashboardView />
    </ErpShell>
  );
}
