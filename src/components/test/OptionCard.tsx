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
        'w-full flex items-center gap-[16px] p-[26px] rounded-2xl border-[1.689px] bg-white',
        'transition-all duration-200 ease-in-out',
        // Default state
        'border-stone-200',
        // Hover state (emerald-200 border + shadow sm)
        !disabled && !isSelected && 'hover:border-emerald-200 hover:shadow-sm cursor-pointer',
        // Selected state (emerald-600 border + shadow md)
        isSelected && 'border-emerald-600 shadow-md',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Label Circle */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
          'text-base leading-6 font-normal tracking-[-0.3125px]',
          'transition-colors duration-200',
          // Selected: emerald-600 bg + white text
          // Default: stone-100 bg + stone-500 text
          isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
        )}
      >
        {label}
      </div>

      {/* Option Text */}
      <p
        className={cn(
          'text-left text-base leading-6 font-medium tracking-[-0.3125px]',
          'transition-colors duration-200',
          isSelected ? 'text-stone-800' : 'text-stone-700'
        )}
      >
        {text}
      </p>
    </button>
  );
}
