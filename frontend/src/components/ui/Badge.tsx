import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-medium',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/80 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    outline: 'bg-transparent text-slate-600 border border-slate-300 font-medium',
    primary: 'bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md tracking-wide ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
