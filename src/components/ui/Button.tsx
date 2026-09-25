import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
    md: 'px-4 py-2 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5 font-semibold'
  }[size];

  const variantClasses = {
    primary: 'bg-[#1B4332] text-white hover:bg-[#133024] shadow-xs active:scale-[0.98]',
    secondary: 'bg-[#8D5B4C] text-white hover:bg-[#72483C] shadow-xs active:scale-[0.98]',
    accent: 'bg-[#C2822B] text-white hover:bg-[#A86E22] shadow-xs active:scale-[0.98]',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-[0.98]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]'
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
