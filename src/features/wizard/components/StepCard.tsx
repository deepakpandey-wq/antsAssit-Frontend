import type { ReactNode } from 'react'
import { Card, IconTile } from '@/components/ui'

interface StepCardProps {
  icon: ReactNode
  title: string
  description: string
  /** Usually a <WizardFooter/>; rendered at the bottom of the card like the reference. */
  footer?: ReactNode
  children: ReactNode
}

/** Content card every wizard step renders into (icon header → body → footer). */
export function StepCard({ icon, title, description, footer, children }: StepCardProps) {
  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-6 flex items-center gap-4">
        <IconTile tone="solid" size="lg">
          {icon}
        </IconTile>
        <div className="min-w-0">
          <h2 className="text-section-title text-ink">{title}</h2>
          <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>
        </div>
      </header>
      {children}
      {footer}
    </Card>
  )
}
