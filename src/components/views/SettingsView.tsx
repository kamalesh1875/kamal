'use client';

import React from 'react';
import { Settings, ShieldCheck, Users, Server, HardDrive, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { useFarm, useAuth } from '@/context/FarmContext';
import { ROLE_PERMISSIONS, SEED_USERS } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export const SettingsView: React.FC = () => {
  const { currentRole, resetAllToDefault } = useFarm();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#1B4332]" />
            <span>Farm Enterprise Configuration & Staff Access</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit 01 Pollachi operations profile, role permissions directory, and hardware integrations
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm('Reset all demo state to factory baseline?')) resetAllToDefault();
          }}
          className="text-rose-700 border-rose-200 hover:bg-rose-50"
        >
          Factory Reset Demo Data
        </Button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Facility Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="h-4 w-4 text-emerald-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Facility Operating Details
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Farm / Unit Name</span>
              <span className="font-semibold text-slate-900">MSK Commercial Goat Farm — Unit 01</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Location</span>
              <span className="font-semibold text-slate-900">Pollachi, Coimbatore District, Tamil Nadu</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered Organization</span>
              <span className="font-semibold text-slate-900">MSK Agro Livestock Private Limited</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Active Herd Housing</span>
              <span className="font-semibold text-slate-900">4 Elevated Slatted Sheds (Capacity: 120 Goats)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Currency & Tax Locale</span>
              <span className="font-semibold text-slate-900">INR (₹) • GST Composite Agro</span>
            </div>
          </div>
        </div>

        {/* Hardware & IoT Integrations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HardDrive className="h-4 w-4 text-emerald-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Field Hardware & Computer Vision
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900">AI Health Camera (Shed Alpha)</span>
                <p className="text-[10px] text-slate-400">RTSP High-fps 1080p gait & posture feed</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900">Bluetooth Digital Platform Scale</span>
                <p className="text-[10px] text-slate-400">Certified weighing crate 0.05kg resolution</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                SYNCED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900">RFID UHF Wand Reader</span>
                <p className="text-[10px] text-slate-400">865-868 MHz ISO 11784/11785 Ear Tag Protocol</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff User Role Directory & RBAC Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Authorized Staff Accounts & Role Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">RBAC Security Engine v2.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-2.5 px-3">Staff Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Login Email</th>
                <th className="py-2.5 px-3 text-center">POS Access</th>
                <th className="py-2.5 px-3 text-center">Finance & Profit</th>
                <th className="py-2.5 px-3 text-center">Vet Protocols</th>
                <th className="py-2.5 px-3 text-center">Weights & ADG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(SEED_USERS).map(u => {
                const perms = ROLE_PERMISSIONS[u.role];
                return (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{u.email}</td>
                    <td className="py-2.5 px-3 text-center">
                      {perms?.canAccessPos ? <span className="text-emerald-700 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {perms?.canViewFinance ? <span className="text-emerald-700 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {perms?.canManageVeterinary ? <span className="text-emerald-700 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {perms?.canRecordWeight ? <span className="text-emerald-700 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
