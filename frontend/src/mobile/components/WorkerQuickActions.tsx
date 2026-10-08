'use client';

import React from 'react';
import {
  Camera,
  Scale,
  Wheat,
  Activity,
  Syringe,
  AlertTriangle,
  Image as ImageIcon,
  CheckSquare
} from 'lucide-react';

interface WorkerQuickActionsProps {
  onScanGoat: () => void;
  onAddWeight: () => void;
  onAddFeed: () => void;
  onAddHealth: () => void;
  onAddVaccine: () => void;
  onReportProblem: () => void;
  onTakePhoto: () => void;
  onCompleteTask: () => void;
}

export const WorkerQuickActions: React.FC<WorkerQuickActionsProps> = ({
  onScanGoat,
  onAddWeight,
  onAddFeed,
  onAddHealth,
  onAddVaccine,
  onReportProblem,
  onTakePhoto,
  onCompleteTask
}) => {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
        Worker One-Tap Quick Actions
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 1. SCAN GOAT */}
        <button
          onClick={onScanGoat}
          className="p-4 rounded-2xl bg-[#1B4332] text-white flex flex-col items-center justify-center gap-2 active:scale-95 shadow-sm transition-all"
        >
          <Camera className="h-6 w-6 text-emerald-300" />
          <span className="font-bold text-xs tracking-tight">SCAN GOAT</span>
        </button>

        {/* 2. ADD WEIGHT */}
        <button
          onClick={onAddWeight}
          className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center gap-2 active:scale-95 shadow-sm transition-all"
        >
          <Scale className="h-6 w-6 text-emerald-400" />
          <span className="font-bold text-xs tracking-tight">ADD WEIGHT</span>
        </button>

        {/* 3. ADD FEED */}
        <button
          onClick={onAddFeed}
          className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Wheat className="h-6 w-6 text-amber-700" />
          <span className="font-bold text-xs tracking-tight">ADD FEED</span>
        </button>

        {/* 4. ADD HEALTH */}
        <button
          onClick={onAddHealth}
          className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Activity className="h-6 w-6 text-rose-600" />
          <span className="font-bold text-xs tracking-tight">ADD HEALTH</span>
        </button>

        {/* 5. ADD VACCINE */}
        <button
          onClick={onAddVaccine}
          className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Syringe className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xs tracking-tight">ADD VACCINE</span>
        </button>

        {/* 6. REPORT PROBLEM */}
        <button
          onClick={onReportProblem}
          className="p-4 rounded-2xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-950 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <AlertTriangle className="h-6 w-6 text-rose-700" />
          <span className="font-bold text-xs tracking-tight">REPORT PROBLEM</span>
        </button>

        {/* 7. TAKE PHOTO */}
        <button
          onClick={onTakePhoto}
          className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ImageIcon className="h-6 w-6 text-sky-600" />
          <span className="font-bold text-xs tracking-tight">TAKE PHOTO</span>
        </button>

        {/* 8. COMPLETE TASK */}
        <button
          onClick={onCompleteTask}
          className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <CheckSquare className="h-6 w-6 text-emerald-700" />
          <span className="font-bold text-xs tracking-tight">COMPLETE TASK</span>
        </button>
      </div>
    </div>
  );
};
