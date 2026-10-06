'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { GoatsView } from '@/components/views/GoatsView';

export default function GoatsPage() {
  return (
    <ErpShell activeTab="goats">
      <GoatsView />
    </ErpShell>
  );
}
