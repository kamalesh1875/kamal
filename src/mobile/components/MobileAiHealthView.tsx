'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Scale,
  Camera,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { aiStore } from '@/ai-health/services/ai-store';
import { useFarm } from '@/context/FarmContext';
import { GoatHealthChatModal } from '@/ai-health/components/GoatHealthChatModal';
import { HealthRiskScore, HealthAlert, AiObservation } from '@/ai-health/types';

interface MobileAiHealthViewProps {
  onOpenGoatProfile: (goatId: string) => void;
  onOpenScanner: () => void;
}

export const MobileAiHealthView: React.FC<MobileAiHealthViewProps> = ({
  onOpenGoatProfile,
  onOpenScanner
}) => {
  const { goats } = useFarm();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Herd Risk Tally (Section 39)
  const criticalCount = aiStore.healthRiskScores.filter((r: HealthRiskScore) => r.riskLevel === 'CRITICAL').length;
  const highCount = aiStore.healthRiskScores.filter((r: HealthRiskScore) => r.riskLevel === 'HIGH').length;
  const mediumCount = aiStore.healthRiskScores.filter((r: HealthRiskScore) => r.riskLevel === 'MEDIUM').length;
  const normalCount = Math.max(0, (goats?.length || 0) - (criticalCount + highCount + mediumCount));

  const alerts = aiStore.healthAlerts;
  const observations = aiStore.aiObservations;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner with AI Chat Launcher */}
      <div className="rounded-3xl bg-gradient-to-r from-[#11291F] via-[#1B4332] to-[#0E221A] text-white p-4 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Multimodal Vision AI
            </span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white mt-1">
            AI Health Center
          </h1>
          <p className="text-[11px] text-slate-300">Continuous biometric surveillance & triage</p>
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* 4-Tier Health Status Cards (Section 39) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Herd Health Risk Distribution
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          {/* Critical */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-600 animate-pulse" />
              <span>Critical</span>
            </div>
            <span className="text-base font-extrabold">{criticalCount}</span>
          </div>

          {/* High */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span>High Concern</span>
            </div>
            <span className="text-base font-extrabold">{highCount}</span>
          </div>

          {/* Attention */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Attention</span>
            </div>
            <span className="text-base font-extrabold">{mediumCount}</span>
          </div>

          {/* Normal */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-600" />
              <span>Normal Healthy</span>
            </div>
            <span className="text-base font-extrabold">{normalCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed (Section 39) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Recent High-Priority Alerts</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">{alerts.length} Active</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alt: HealthAlert) => (
            <div
              key={alt.id}
              onClick={() => onOpenGoatProfile(alt.goatId)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex items-center justify-between cursor-pointer active:scale-98 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{alt.tagNumber}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {alt.severity}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 mt-1">{alt.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{alt.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Real-time AI Observation Stream */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-emerald-700" />
          <span>Live Multi-Detector Stream</span>
        </div>

        <div className="space-y-2 text-xs">
          {observations.slice(0, 4).map((obs: AiObservation) => (
            <div key={obs.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono">{obs.tagNumber}</span>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {obs.detectionMethod}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{obs.findingSummary}</p>
              <div className="text-[9px] text-slate-400 italic pt-1">
                {obs.safetyDisclaimer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounded AI Assistant Modal */}
      <GoatHealthChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
