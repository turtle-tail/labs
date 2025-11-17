'use client'

import { cn } from '@/lib/utils'

interface OptionCardProps {
  label: string // A, B, C, D
  text: string
  isSelected?: boolean
  onClick: () => void
}

export function OptionCard({
  label,
  text,
  isSelected = false,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles - Figma Design System
        'w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 bg-white',
        'font-inter cursor-pointer',
        // Default state
        'border-stone-200',
        // Hover state
        'hover:border-emerald-200 hover:shadow-sm',
        // Focus state
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
        // Active state
        'active:scale-[0.98]',
        // Selected state
        isSelected && 'border-emerald-600 shadow-md'
      )}
    >
      {/* Label Circle */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full',
          'text-base leading-6 font-normal flex-shrink-0 tracking-tight',
          'transition-colors duration-200',
          isSelected
            ? 'bg-emerald-600 text-white'
            : 'bg-stone-100 text-stone-500'
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
  )
}
