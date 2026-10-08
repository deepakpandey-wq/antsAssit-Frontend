import { Check, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { GenerationSnapshot } from '../generationPlan'

const statusText = { done: 'completed', active: 'in progress', pending: 'pending' } as const

/** Vertical checklist of the seven generation stages. */
export function StageList({ stages }: { stages: GenerationSnapshot['stages'] }) {
  return (
    <ol aria-label="Generation stages" className="relative">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1
        return (
          <li key={stage.id} className="relative flex items-center gap-3.5 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-8 bottom-0 left-[13px] w-px',
                  stage.state === 'done' ? 'bg-success-500/40' : 'bg-line-strong',
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors',
                stage.state === 'done' && 'bg-success-500 text-white',
                stage.state === 'active' &&
                  'bg-primary-600 text-white shadow-primary ring-4 ring-primary-100',
                stage.state === 'pending' && 'border border-line-strong bg-surface',
              )}
            >
              {stage.state === 'done' && <Check className="size-4" strokeWidth={3} />}
              {stage.state === 'active' && <LoaderCircle className="size-4 animate-spin" />}
              {stage.state === 'pending' && (
                <span className="size-1.5 rounded-full bg-ink-subtle" />
              )}
            </span>
            <span
              className={cn(
                'text-[13px]',
                stage.state === 'active' && 'font-semibold text-ink',
                stage.state === 'done' && 'font-medium text-ink-body',
                stage.state === 'pending' && 'text-ink-muted',
              )}
            >
              {stage.label}
              <span className="sr-only"> — {statusText[stage.state]}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
