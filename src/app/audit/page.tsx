'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { AuditView } from '@/components/views/AuditView';

export default function AuditPage() {
  return (
    <ErpShell activeTab="audit">
      <AuditView />
    </ErpShell>
  );
}
