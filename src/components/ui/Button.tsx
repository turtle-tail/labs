import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export function Button({
  variant = 'primary',
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'bg-white text-text-primary border border-border hover:border-text-secondary':
            variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}
