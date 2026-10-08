'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { PosView } from '@/components/views/PosView';

export default function PosPage() {
  return (
    <ErpShell activeTab="pos">
      <PosView />
    </ErpShell>
  );
}
