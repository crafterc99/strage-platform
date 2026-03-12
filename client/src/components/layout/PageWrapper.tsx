import type { ReactNode } from 'react'
import clsx from 'clsx'

interface PageWrapperProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export default function PageWrapper({ title, subtitle, children, className, action }: PageWrapperProps) {
  return (
    <div className={clsx('min-h-[calc(100vh-64px)] pb-20 lg:pb-8', className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(title || subtitle || action) && (
          <div className="flex items-start justify-between mb-6">
            <div>
              {title && <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
