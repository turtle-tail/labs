import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-border rounded-lg p-4',
        {
          'transition-all hover:border-primary hover:shadow-sm cursor-pointer': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
