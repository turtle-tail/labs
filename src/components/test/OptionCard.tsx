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
        'w-full flex items-center gap-4 p-4 rounded-xl border transition-all',
        'hover:border-primary hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'active:scale-[0.98]', // Mobile touch feedback
        'min-h-[60px]', // Minimum 60px for better touch target
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-white'
      )}
    >
      {/* Label Circle */}
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0',
          isSelected
            ? 'bg-primary text-white'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {label}
      </div>

      {/* Option Text */}
      <div className="text-left text-base">{text}</div>
    </button>
  )
}
