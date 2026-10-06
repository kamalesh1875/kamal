'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { TasksSubView } from '@/components/views/LivestockSubViews';

export default function TasksPage() {
  return (
    <ErpShell activeTab="tasks">
      <TasksSubView />
    </ErpShell>
  );
}
