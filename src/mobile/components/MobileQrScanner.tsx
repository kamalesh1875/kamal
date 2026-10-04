'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, Search, X, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

interface MobileQrScannerProps {
  onScanSuccess: (goatId: string, tagNumber: string) => void;
  onClose: () => void;
}

export const MobileQrScanner: React.FC<MobileQrScannerProps> = ({ onScanSuccess, onClose }) => {
  const { goats } = useFarm();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [manualTagInput, setManualTagInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (mounted) setHasCameraPermission(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasCameraPermission(true);
        }
      } catch (err) {
        if (mounted) setHasCameraPermission(false);
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSelectGoat = (id: string, tag: string) => {
    setFeedback(`Matched: ${tag}`);
    setIsScanning(false);
    setTimeout(() => {
      onScanSuccess(id, tag);
    }, 400);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTagInput.trim()) return;

    const matched = goats.find(
      g =>
        g.tagNumber.toLowerCase() === manualTagInput.trim().toLowerCase() ||
        (g.rfidTag && g.rfidTag.toLowerCase() === manualTagInput.trim().toLowerCase())
    );

    if (matched) {
      handleSelectGoat(matched.id, matched.tagNumber);
    } else {
      setFeedback(`Tag "${manualTagInput}" not found in herd`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight">Ear Tag & QR Scanner</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        {hasCameraPermission ? (
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-emerald-400/50 shadow-2xl bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Target Reticle */}
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center pointer-events-none">
              <div className="h-full w-full relative">
                <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />
                {isScanning && (
                  <div className="h-0.5 w-full bg-emerald-400 animate-bounce absolute top-1/2" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm aspect-square rounded-3xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Camera className="h-10 w-10 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Visual Ear Tag Scanner</h3>
              <p className="text-xs text-slate-400 mt-1">
                Point camera at ear tag barcode, QR tag, or RFID reader
              </p>
            </div>
            <div className="text-[11px] text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              Select tag below or type tag ID
            </div>
          </div>
        )}

        {/* Feedback message */}
        {feedback && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Fast Tag Quick Selector List */}
        <div className="w-full max-w-sm mt-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quick Scan Recent Ear Tags:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {goats.slice(0, 6).map(g => (
              <button
                key={g.id}
                onClick={() => handleSelectGoat(g.id, g.tagNumber)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/30 border border-white/10 text-xs font-mono font-semibold text-white whitespace-nowrap active:scale-95 transition-all"
              >
                {g.tagNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Search Fallback at Bottom */}
      <div className="p-4 bg-slate-900 border-t border-white/10">
        <form onSubmit={handleManualSearch} className="flex gap-2 max-w-sm mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Or enter tag number (e.g. G-00247)..."
              value={manualTagInput}
              onChange={e => setManualTagInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
          >
            Find
          </button>
        </form>
      </div>
    </div>
  );
};
