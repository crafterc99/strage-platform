import clsx from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'info' | 'success' | 'warning' | 'danger' | 'primary'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export default function Badge({ variant = 'info', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'info' && 'bg-blue-500/15 text-blue-400',
        variant === 'success' && 'bg-emerald/15 text-emerald',
        variant === 'warning' && 'bg-amber/15 text-amber',
        variant === 'danger' && 'bg-red-500/15 text-red-400',
        variant === 'primary' && 'bg-forest/15 text-mint',
        className
      )}
    >
      {children}
    </span>
  )
}
