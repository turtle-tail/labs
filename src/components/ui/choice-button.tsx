'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChoiceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 왼쪽에 표시될 문자 (A, B, C 등) */
  label: string;
  /** 선택 여부 */
  selected?: boolean;
  /** 버튼 텍스트 */
  children: React.ReactNode;
}

const ChoiceButton = React.forwardRef<HTMLButtonElement, ChoiceButtonProps>(
  ({ className, label, selected = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'group relative flex items-center gap-4 w-full',
          'bg-white rounded-2xl border-2 transition-all duration-200',
          'px-6 py-6',
          'font-inter',
          // Default state
          'border-stone-200',
          // Hover state
          'hover:border-emerald-200 hover:shadow-sm',
          // Selected state
          selected && 'border-emerald-600 shadow-md',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:shadow-none',
          className
        )}
        {...props}
      >
        {/* Circle badge */}
        <div
          className={cn(
            'flex items-center justify-center',
            'w-10 h-10 rounded-full shrink-0',
            'transition-colors duration-200',
            // Default: stone-100 background with stone-500 text
            !selected && 'bg-stone-100 text-stone-500',
            // Selected: emerald-600 background with white text
            selected && 'bg-emerald-600 text-white'
          )}
        >
          <span className="text-base font-normal leading-6 tracking-tight">
            {label}
          </span>
        </div>

        {/* Text content */}
        <div
          className={cn(
            'flex-1 text-left',
            'text-base font-normal leading-6 tracking-tight',
            'transition-colors duration-200',
            // Default: stone-700
            !selected && 'text-stone-700',
            // Selected: stone-800
            selected && 'text-stone-800'
          )}
        >
          {children}
        </div>
      </button>
    );
  }
);

ChoiceButton.displayName = 'ChoiceButton';

export { ChoiceButton };
