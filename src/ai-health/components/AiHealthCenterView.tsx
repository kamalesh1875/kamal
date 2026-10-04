'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Scale,
  Wheat,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  X,
  FileText,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import { aiStore } from '../services/ai-store';
import { useFarm } from '@/context/FarmContext';
import { GoatHealthChatModal } from './GoatHealthChatModal';
import { DetectionMethod, HealthAlert, VetReview } from '../types';

export const AiHealthCenterView: React.FC = () => {
  const { goats } = useFarm();
  const [activeDetectorFilter, setActiveDetectorFilter] = useState<string>('ALL');
  const [selectedAlertForReview, setSelectedAlertForReview] = useState<HealthAlert | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Vet Review Modal form fields
  const [vetName, setVetName] = useState('Dr. S. Ramanathan BVSc');
  const [reviewStatus, setReviewStatus] = useState<'CONFIRMED' | 'REJECTED' | 'NEEDS_INVESTIGATION'>('CONFIRMED');
  const [clinicalObservation, setClinicalObservation] = useState('');
  const [formalDiagnosis, setFormalDiagnosis] = useState('');
  const [prescribedTreatment, setPrescribedTreatment] = useState('');
  const [treatmentCost, setTreatmentCost] = useState(250);
  const [followupDate, setFollowupDate] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  const cameras = aiStore.cameras;
  const riskScores = aiStore.healthRiskScores;
  const alerts = aiStore.healthAlerts;
  const observations = aiStore.aiObservations;
  const modelMetrics = aiStore.modelMetrics;

  const criticalCount = riskScores.filter(r => r.riskLevel === 'CRITICAL').length;
  const highCount = riskScores.filter(r => r.riskLevel === 'HIGH').length;
  const mediumCount = riskScores.filter(r => r.riskLevel === 'MEDIUM').length;
  const lowCount = riskScores.filter(r => r.riskLevel === 'LOW').length;

  const filteredObservations = activeDetectorFilter === 'ALL'
    ? observations
    : observations.filter(o => o.detectionMethod === activeDetectorFilter);

  const handleOpenReview = (alert: HealthAlert) => {
    setSelectedAlertForReview(alert);
    setClinicalObservation(`Inspected animal ${alert.tagNumber} in pen. Corroborated with automated AI observations.`);
    setFormalDiagnosis('');
    setPrescribedTreatment('');
    setFollowupDate(new Date(Date.now() + 48 * 3600 * 1000).toISOString().substring(0, 10));
  };

  const handleSaveVetReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForReview) return;

    const newReview: VetReview = {
      id: `vr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      alertId: selectedAlertForReview.id,
      goatId: selectedAlertForReview.goatId,
      tagNumber: selectedAlertForReview.tagNumber,
      vetName,
      reviewTimestamp: new Date().toISOString(),
      reviewStatus,
      clinicalObservation,
      formalDiagnosis,
      prescribedTreatment,
      medicineAdministered: prescribedTreatment,
      dosage: '',
      followupDate,
      treatmentOutcome: 'IMPROVING'
    };

    aiStore.vetReviews.unshift(newReview);

    // Update alert status
    const targetAlert = aiStore.healthAlerts.find(a => a.id === selectedAlertForReview.id);
    if (targetAlert) {
      targetAlert.status = reviewStatus === 'CONFIRMED' ? 'ACKNOWLEDGED' : 'RESOLVED';
      targetAlert.resolvedBy = vetName;
    }

    // Update risk score
    const riskScore = aiStore.healthRiskScores.find(r => r.goatId === selectedAlertForReview.goatId);
    if (riskScore) {
      riskScore.vetReviewStatus = reviewStatus;
    }

    // Send to backend API
    fetch('/api/vet-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alertId: selectedAlertForReview.id,
        goatId: selectedAlertForReview.goatId,
        vetName,
        reviewStatus,
        clinicalObservation,
        formalDiagnosis,
        prescribedTreatment,
        treatmentCost: Number(treatmentCost),
        followupDate
      })
    }).catch(err => console.error('Failed to post vet review', err));

    setReviewSuccessMsg(`Veterinary review certified for ${selectedAlertForReview.tagNumber}.`);
    setSelectedAlertForReview(null);
    setTimeout(() => setReviewSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top AI Center Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#11291F] via-[#1B4332] to-[#0E221A] p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Multimodal Computer Vision & IoT Biometrics
              </span>
              <span className="text-emerald-300/80 text-xs">Autonomous Health Surveillance</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>AI Health Center</span>
              <span className="text-sm font-normal text-emerald-200">MSK Feedlot Diagnostic Station</span>
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
              14 specialized detection pipelines evaluating posture, feces morphology, respiratory rhythm, gait kinematics, and individual weight baselines.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Goat Health AI</span>
            </button>
          </div>
        </div>
      </div>

      {reviewSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>{reviewSuccessMsg}</span>
        </div>
      )}

      {/* TIER 1: MULTIMODAL HEALTH RISK METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical */}
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">🔴 Critical Concern</div>
            <div className="text-3xl font-extrabold text-rose-950 mt-1">{criticalCount}</div>
            <div className="text-[11px] text-rose-700 mt-0.5">Immediate vet isolation</div>
          </div>
          <AlertTriangle className="h-8 w-8 text-rose-500 opacity-80" />
        </div>

        {/* High */}
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">🟠 High Risk</div>
            <div className="text-3xl font-extrabold text-amber-950 mt-1">{highCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Clinical triage active</div>
          </div>
          <Activity className="h-8 w-8 text-amber-500 opacity-80" />
        </div>

        {/* Attention */}
        <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider">🟡 Moderate Attention</div>
            <div className="text-3xl font-extrabold text-yellow-950 mt-1">{mediumCount}</div>
            <div className="text-[11px] text-yellow-700 mt-0.5">Appetite / hoof watch</div>
          </div>
          <Stethoscope className="h-8 w-8 text-yellow-600 opacity-80" />
        </div>

        {/* Normal */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">🟢 Baseline Healthy</div>
            <div className="text-3xl font-extrabold text-emerald-950 mt-1">
              {Math.max(0, (goats?.length || 0) - (criticalCount + highCount + mediumCount))}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Optimal FCR trajectory</div>
          </div>
          <ShieldCheck className="h-8 w-8 text-emerald-600 opacity-80" />
        </div>
      </div>

      {/* TIER 2: CAMERA NETWORK & RE-ID PIPELINE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#1B4332]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Shed Camera Network (IP / RTSP / ONVIF Gateway)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">4 Streams Active • 5-10 FPS Sampling</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {cameras.map(cam => (
            <div key={cam.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 line-clamp-1">{cam.name}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Simulated Video Frame Viewport */}
              <div className="relative aspect-video rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center overflow-hidden border border-slate-800">
                <div className="absolute top-1.5 left-2 text-[9px] font-mono text-emerald-400 bg-black/60 px-1 rounded">
                  LIVE RTSP • {cam.fpsSampleRate} FPS
                </div>
                <div className="absolute top-1.5 right-2 text-[9px] font-mono text-slate-400 bg-black/60 px-1 rounded">
                  {cam.resolution}
                </div>
                <span className="text-2xl opacity-60">🐐</span>
                <div className="absolute bottom-1.5 left-2 text-[9px] text-slate-300 font-medium bg-black/60 px-1 rounded">
                  Tracked: {cam.currentTrackedGoats} Goats
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Pen: {cam.penName.split('(')[0]}</span>
                <span className="text-emerald-700 font-bold">Detection ON</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIER 3: ACTIONABLE ALERT QUEUE & CLINICAL VET REVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Clinical Alert Queue (Requires Vet Review)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{alerts.length} Flagged</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {alerts.map(alert => (
            <div key={alert.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{alert.tagNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[11px] text-slate-400">Pen: {alert.penId}</span>
                </div>
                <div className="font-semibold text-slate-900 mt-1">{alert.title}</div>
                <p className="text-[11px] text-slate-600 mt-0.5 max-w-2xl">{alert.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenReview(alert)}
                  className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#133024] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Clinical Vet Review</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIER 4: MULTI-DETECTOR LIVE OBSERVATION STREAM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Live AI Detection Stream (14 Modular Pipelines)
            </h2>
          </div>

          {/* Detector Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {['ALL', 'BEHAVIOR', 'FECES', 'GAIT', 'RESPIRATORY', 'WEIGHT_GROWTH', 'ENVIRONMENT'].map(method => (
              <button
                key={method}
                onClick={() => setActiveDetectorFilter(method)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeDetectorFilter === method
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Goat Tag</th>
                <th className="py-2.5 px-3">Pipeline</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Observation Finding</th>
                <th className="py-2.5 px-3">Model Version</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredObservations.map(obs => (
                <tr key={obs.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{obs.tagNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {obs.detectionMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        obs.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : obs.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : obs.severity === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {obs.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 max-w-md">
                    <div>{obs.findingSummary}</div>
                    <div className="text-[10px] text-slate-400 italic mt-0.5">{obs.safetyDisclaimer}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{obs.modelVersion}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {(obs.confidence * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TIER 5: MODEL MONITORING & CONTINUOUS LEARNING MATRIX (Section 45 & 47) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#1B4332]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Model Performance Monitoring & Continuous Learning Registry
            </h2>
          </div>
          <span className="text-xs text-slate-400">Validated against veterinary gold standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {modelMetrics.map(metric => (
            <div key={metric.modelVersion} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{metric.task}</h3>
                  <div className="text-[10px] font-mono text-slate-400">{metric.modelVersion}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {metric.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-400 block font-semibold">PRECISION</span>
                  <span className="font-bold text-slate-900">{(metric.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-400 block font-semibold">RECALL</span>
                  <span className="font-bold text-slate-900">{(metric.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-400 block font-semibold">F1 SCORE</span>
                  <span className="font-bold text-emerald-700">{(metric.f1Score * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>False Positives: {metric.falsePositivesCount}</span>
                <span>Last Evaluated: {metric.lastEvaluated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VETERINARIAN CLINICAL REVIEW MODAL */}
      {selectedAlertForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#1B4332]" />
                  <span>Clinical Veterinarian Review</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Animal: <b className="font-mono text-slate-900">{selectedAlertForReview.tagNumber}</b>
                </p>
              </div>
              <button
                onClick={() => setSelectedAlertForReview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVetReview} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Attending Veterinarian</label>
                <input
                  type="text"
                  required
                  value={vetName}
                  onChange={e => setVetName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Clinical Review Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CONFIRMED', 'NEEDS_INVESTIGATION', 'REJECTED'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setReviewStatus(status)}
                      className={`py-2 rounded-xl font-bold text-xs transition-all ${
                        reviewStatus === status
                          ? 'bg-[#1B4332] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'CONFIRMED' ? 'Confirmed' : status === 'REJECTED' ? 'Rejected' : 'Needs Check'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Clinical Observation Notes</label>
                <textarea
                  rows={2}
                  required
                  value={clinicalObservation}
                  onChange={e => setClinicalObservation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Formal Diagnosis</label>
                  <input
                    type="text"
                    placeholder="e.g. Bronchopneumonia..."
                    value={formalDiagnosis}
                    onChange={e => setFormalDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Prescribed Meds & Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxytetracycline 3ml IM..."
                    value={prescribedTreatment}
                    onChange={e => setPrescribedTreatment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Treatment Cost (₹)</label>
                  <input
                    type="number"
                    value={treatmentCost}
                    onChange={e => setTreatmentCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Followup Date</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={e => setFollowupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForReview(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold"
                >
                  Certify Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grounded AI Assistant Modal */}
      <GoatHealthChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
