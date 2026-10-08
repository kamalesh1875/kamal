'use client';

import React from 'react';
import { ErpShell } from '@/components/layout/ErpShell';
import { SettingsView } from '@/components/views/SettingsView';

export default function SettingsPage() {
  return (
    <ErpShell activeTab="settings">
      <SettingsView />
    </ErpShell>
  );
}
