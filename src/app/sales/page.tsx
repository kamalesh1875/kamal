'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { SalesHistoryView } from '@/components/views/SalesHistoryView';

export default function SalesPage() {
  return (
    <ErpShell activeTab="sales">
      <SalesHistoryView />
    </ErpShell>
  );
}
