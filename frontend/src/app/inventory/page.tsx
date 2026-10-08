'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { InventoryView } from '@/components/views/InventoryView';

export default function InventoryPage() {
  return (
    <ErpShell activeTab="inventory">
      <InventoryView />
    </ErpShell>
  );
}
