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
        'w-full flex items-center gap-4 p-[26px] rounded-2xl border-[1.689px] transition-all bg-white',
        'hover:border-[#a4f4cf] hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009966] focus-visible:ring-offset-2',
        'active:scale-[0.98]',
        isSelected
          ? 'border-[#009966] shadow-md'
          : 'border-[#e7e5e4]'
      )}
    >
      {/* Label Circle */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full text-base leading-6 font-normal flex-shrink-0 tracking-[-0.3125px]',
          isSelected
            ? 'bg-[#009966] text-white'
            : 'bg-[#f5f4f3] text-[#79716b]'
        )}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </div>

      {/* Option Text */}
      <div className="text-left text-base leading-6 font-medium text-[#44403b] tracking-[-0.3125px]">
        {text}
      </div>
    </button>
  )
}
