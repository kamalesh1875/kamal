'use client';

import React from 'react';
import { History, ShieldCheck, UserCheck, Clock } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Badge } from '@/components/ui/Badge';

export const AuditView: React.FC = () => {
  const { auditLogs } = useFarm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Immutable Farm Activity & Audit Trail</span>
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
            {auditLogs.length} Events Logged
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verifiable audit record of all livestock registrations, weight modifications, POS transactions, and financial disbursements
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-3">Staff / Role</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-4">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">{log.user}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.role}</div>
                </td>
                <td className="py-3 px-3">
                  <Badge size="sm" variant={log.module === 'POS' ? 'warning' : log.module === 'LIVESTOCK' ? 'primary' : 'neutral'}>
                    {log.module}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">{log.action}</td>
                <td className="py-3 px-4 text-slate-700">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
