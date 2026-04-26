import React from 'react';

type FlagVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'violet';
type FlagSize = 'sm' | 'md' | 'lg';

interface FlagProps {
  children: React.ReactNode;
  variant?: FlagVariant;
  size?: FlagSize;
  dot?: boolean;
  className?: string;
}

const Flag: React.FC<FlagProps> = ({ 
  children, 
  variant = 'info', 
  size = 'md', 
  dot = false,
  className = '',
}) => {
  // Mapeamento de estilos por variante ajustado para o tema dark do RPG
  const variants: Record<FlagVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };

  const sizes: Record<FlagSize, string> = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-xs',
  };

  const dotColors: Record<FlagVariant, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-500',
    violet: 'bg-violet-500',
  };

  return (
    <span className={`inline-flex items-center font-black uppercase tracking-widest border rounded-full transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export default Flag;