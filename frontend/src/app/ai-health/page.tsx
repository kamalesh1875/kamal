'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { AiHealthCenterView } from '@/ai-health/components/AiHealthCenterView';

export default function AiHealthPage() {
  return (
    <ErpShell activeTab="ai-health">
      <AiHealthCenterView />
    </ErpShell>
  );
}
