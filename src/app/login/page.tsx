'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/FarmContext';
import { getDefaultRouteForRole } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const { login, isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick fill helper for development/testing demo credentials
  const handleSelectDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const result = await login(email.trim(), password);

      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'Invalid email or password.');
        setSubmitting(false);
        return;
      }

      // Successful login redirect based on role
      const dest = redirectTarget || getDefaultRouteForRole(result.user.role);
      router.push(dest);
    } catch (err: any) {
      setErrorMsg('Unable to complete sign in. Please verify your connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0E221A] flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6A4F]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#1B4332]/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F] via-[#1B4332] to-[#11291F] items-center justify-center text-3xl shadow-xl border border-emerald-400/30">
            🐐
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            MSK GoatFarm OS
          </h1>
          <p className="text-xs text-emerald-300/80 font-medium tracking-wide uppercase">
            Commercial Livestock ERP & POS Engine
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 text-slate-900">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Staff Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your credentials to access farm operations
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication failed</span>
                <p className="mt-0.5 text-rose-700">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email-input">
                Email Address / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@mskgoat.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password-input">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#133024] active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Operating System</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* DEMO / DEVELOPMENT ACCOUNTS SECTION */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Demo Accounts (Development Only)</span>
              </span>
              <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                DEMO MODE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('admin@mskgoat.com', 'admin123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                  Owner / Admin
                </div>
                <div className="text-[10px] text-slate-400">Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('vet@mskgoat.com', 'vet123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                  Veterinarian
                </div>
                <div className="text-[10px] text-slate-400">Health & Vaccines</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('worker@mskgoat.com', 'worker123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                  Field Worker
                </div>
                <div className="text-[10px] text-slate-400">Weights & Sheds</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('cashier@mskgoat.com', 'cashier123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                  POS Cashier
                </div>
                <div className="text-[10px] text-slate-400">Sales Terminal</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-emerald-400/70">
          MSK Commercial Livestock Feedlot • Pollachi, TN • Secure ERP Auth
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0E221A] flex items-center justify-center text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
