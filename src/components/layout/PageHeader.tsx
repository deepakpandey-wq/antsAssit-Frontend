import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Plain-text title for the browser tab (React 19 hoists <title>). */
  documentTitle: string
  actions?: ReactNode
}

export function PageHeader({ title, description, documentTitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <title>{`${documentTitle} · Ants Assessment`}</title>
      <div className="min-w-0">
        <h1 className="text-page-title text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
