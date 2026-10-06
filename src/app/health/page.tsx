'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { HealthSubView } from '@/components/views/LivestockSubViews';

export default function HealthPage() {
  return (
    <ErpShell activeTab="health">
      <HealthSubView />
    </ErpShell>
  );
}
