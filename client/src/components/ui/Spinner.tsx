import clsx from 'clsx'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'border-2 border-smoke border-t-forest rounded-full animate-spin',
          size === 'sm' && 'w-5 h-5',
          size === 'md' && 'w-8 h-8',
          size === 'lg' && 'w-12 h-12'
        )}
      />
    </div>
  )
}
