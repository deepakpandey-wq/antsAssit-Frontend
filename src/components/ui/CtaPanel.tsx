import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconTile } from './IconTile'

interface CtaPanelProps {
  icon: ReactNode
  title: string
  description: ReactNode
  action: ReactNode
  /** Optional decorative layer, absolutely positioned behind the content. */
  artwork?: ReactNode
  className?: string
}

/** Peach call-to-action panel (Dashboard "Create a New Assessment", Review "Generate Project"). */
export function CtaPanel({ icon, title, description, action, artwork, className }: CtaPanelProps) {
  const titleId = useId()
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'relative isolate h-full overflow-hidden rounded-card border border-primary-100 bg-linear-to-br from-primary-100 via-primary-50 to-primary-100/70 p-6 shadow-card sm:p-7',
        className,
      )}
    >
      {artwork}
      <div className="relative flex max-w-md flex-col gap-5 sm:flex-row sm:items-start">
        <IconTile tone="solid" size="xl">
          {icon}
        </IconTile>
        <div>
          <h2 id={titleId} className="text-lg font-bold tracking-tight text-ink">
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-body">{description}</p>
          <div className="mt-5">{action}</div>
        </div>
      </div>
    </section>
  )
}
