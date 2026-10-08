import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconTile } from './IconTile'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
      <IconTile tone="primary" size="lg">
        {icon}
      </IconTile>
      <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
