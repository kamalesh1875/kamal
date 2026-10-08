import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/40 text-emerald-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50/40 text-amber-950';
      case 'danger':
        return 'border-rose-200 bg-rose-50/40 text-rose-950';
      default:
        return 'border-slate-200/80 bg-white text-slate-900';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success': return 'text-emerald-700 bg-emerald-100';
      case 'warning': return 'text-amber-700 bg-amber-100';
      case 'danger': return 'text-rose-700 bg-rose-100';
      default: return 'text-[#1B4332] bg-[#E8F5E9]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:shadow-md ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getIconColor()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
    </div>
  );
};
