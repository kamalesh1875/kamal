'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { CustomersView } from '@/components/views/CustomersView';

export default function CustomersPage() {
  return (
    <ErpShell activeTab="customers">
      <CustomersView />
    </ErpShell>
  );
}
