'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { WeightSubView } from '@/components/views/LivestockSubViews';

export default function WeightPage() {
  return (
    <ErpShell activeTab="weight">
      <WeightSubView />
    </ErpShell>
  );
}
