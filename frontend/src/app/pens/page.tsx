'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { PensSubView } from '@/components/views/LivestockSubViews';

export default function PensPage() {
  return (
    <ErpShell activeTab="pens">
      <PensSubView />
    </ErpShell>
  );
}
