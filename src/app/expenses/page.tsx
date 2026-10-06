'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { FinanceView } from '@/components/views/FinanceView';

export default function ExpensesPage() {
  return (
    <ErpShell activeTab="expenses">
      <FinanceView />
    </ErpShell>
  );
}
