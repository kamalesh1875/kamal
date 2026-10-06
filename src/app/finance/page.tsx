'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { FinanceView } from '@/components/views/FinanceView';

export default function FinancePage() {
  return (
    <ErpShell activeTab="finance">
      <FinanceView />
    </ErpShell>
  );
}
