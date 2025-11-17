'use client';

import { cn } from '@/lib/utils';

interface OptionCardProps {
  label: string; // A, B, C, D
  text: string;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({ label, text, isSelected = false, onClick, disabled = false }: OptionCardProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        // Base styles - Figma Design System
        'w-full flex items-center gap-4 p-6 rounded-2xl border-2 bg-white',
        'font-inter',
        // Figma-style transition
        'transition-all duration-300 ease-in-out',
        // Default state
        'border-stone-200',
        // Hover state
        !disabled &&
          'hover:border-emerald-200 hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer',
        // Focus state
        !disabled &&
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
        // Active state (click)
        !disabled && 'active:scale-[0.98] active:translate-y-0',
        // Selected state
        isSelected && 'border-emerald-600 shadow-md',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Label Circle */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full',
          'text-base leading-6 font-normal shrink-0 tracking-tight',
          'transition-colors duration-200',
          isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
        )}
      >
        {label}
      </div>

      {/* Option Text */}
      <div
        className={cn(
          'text-left text-base leading-6 font-normal tracking-tight',
          'transition-colors duration-200',
          isSelected ? 'text-stone-800' : 'text-stone-700'
        )}
      >
        {text}
      </div>
    </button>
  );
}
