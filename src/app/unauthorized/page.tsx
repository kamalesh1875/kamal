'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/FarmContext';
import { getDefaultRouteForRole } from '@/lib/auth';

export default function UnauthorizedPage() {
  const { user, role, logout } = useAuth();
  const safeDestination = getDefaultRouteForRole(role || 'WORKER');

  return (
    <div className="min-h-screen w-full bg-[#0E221A] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-rose-200 text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
          <ShieldAlert className="h-8 w-8 text-rose-600" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            403 Forbidden • Access Denied
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Restricted Module Access
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your current account role does not have authorization to view or execute operations within this farm module.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Logged In As:</span>
            <span className="font-semibold text-slate-900">{user?.name || 'Staff User'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Active Role:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {role}
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-2.5">
          <Link
            href={safeDestination}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#133024] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Your Authorized Dashboard</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4 text-slate-500" />
            <span>Switch Account / Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
