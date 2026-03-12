import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none',
        size === 'sm' && 'rounded-lg px-4 py-2 text-sm min-h-[36px]',
        size === 'md' && 'rounded-xl px-6 py-3 text-sm min-h-[44px]',
        size === 'lg' && 'rounded-xl px-8 py-4 text-base min-h-[52px]',
        variant === 'primary' && [
          'text-white gradient-brand',
          'shadow-[0_2px_12px_rgba(5,150,105,0.35)]',
          'hover:shadow-[0_4px_20px_rgba(5,150,105,0.5)]',
          'hover:brightness-110',
          'active:scale-[0.98]',
        ],
        variant === 'secondary' && [
          'bg-graphite text-white border border-smoke',
          'hover:border-forest hover:text-emerald',
          'active:scale-[0.98]',
        ],
        variant === 'ghost' && 'text-white/60 hover:text-white hover:bg-smoke/50 active:scale-[0.98]',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
        variant === 'outline' && [
          'border-2 border-forest text-emerald bg-transparent',
          'hover:bg-forest hover:text-white',
          'active:scale-[0.98]',
        ],
        (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
