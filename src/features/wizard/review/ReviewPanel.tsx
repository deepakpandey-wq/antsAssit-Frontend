import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { ButtonLink, Card } from '@/components/ui'

interface ReviewPanelProps {
  title: string
  /** Step path the Edit control jumps to. */
  editTo?: string
  editLabel?: string
  children: ReactNode
}

/** A titled review card with an optional Edit control. */
export function ReviewPanel({ title, editTo, editLabel, children }: ReviewPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-card-title text-ink">{title}</h3>
        {editTo && (
          <ButtonLink
            to={editTo}
            variant="secondary"
            size="sm"
            leftIcon={<Pencil className="text-primary-600" />}
            aria-label={editLabel ?? `Edit ${title.toLowerCase()}`}
          >
            Edit
          </ButtonLink>
        )}
      </div>
      {children}
    </Card>
  )
}
