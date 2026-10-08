'use client';

import React from 'react';

export const ViewLoadingSkeleton: React.FC<{ title?: string }> = ({ title = 'Loading Module...' }) => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header bar placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="h-3 w-72 bg-slate-100 rounded mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded-xl" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Cards row placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-7 w-28 bg-slate-200 rounded" />
            <div className="h-2 w-36 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main content table / chart placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-full bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
