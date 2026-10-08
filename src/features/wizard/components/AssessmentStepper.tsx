import { Link } from 'react-router'
import { Check } from 'lucide-react'
import { Card, Progress } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useWizardProgress } from '../useWizardProgress'

type StepState = 'current' | 'complete' | 'upcoming'

/** The one stepper shared by every assessment creation screen. */
export function AssessmentStepper() {
  const { steps, currentIndex, current, completed, lastReachable } = useWizardProgress()

  const stateOf = (index: number): StepState =>
    index === currentIndex ? 'current' : completed[index] ? 'complete' : 'upcoming'

  return (
    <nav aria-label="Assessment steps">
      <Card className="px-4 py-4 sm:px-5">
        {/* Compact variant for small screens */}
        <div className="md:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold text-ink">{current.label}</p>
            <p className="text-xs text-ink-muted">
              Step {currentIndex + 1} of {steps.length}
            </p>
          </div>
          <Progress
            className="mt-3"
            size="sm"
            label="Assessment progress"
            value={currentIndex + 1}
            max={steps.length}
          />
        </div>

        <ol className="hidden items-start md:flex">
          {steps.map((step, index) => {
            const state = stateOf(index)
            const reachable = index <= lastReachable && state !== 'current'
            const isLast = index === steps.length - 1

            const marker = (
              <>
                <span
                  className={cn(
                    'relative z-10 flex size-8 items-center justify-center rounded-full text-[13px] font-semibold transition-colors',
                    state === 'current' &&
                      'bg-primary-600 text-white shadow-primary ring-4 ring-primary-100',
                    state === 'complete' &&
                      'border border-primary-300 bg-surface text-primary-600 group-hover:bg-primary-50',
                    state === 'upcoming' &&
                      'border border-line-strong bg-surface text-ink-muted group-hover:border-ink-subtle',
                  )}
                >
                  {state === 'complete' ? (
                    <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'mt-2 px-1 text-center text-xs leading-tight',
                    state === 'current' && 'font-semibold text-ink',
                    state === 'complete' && 'font-medium text-ink-body group-hover:text-ink',
                    state === 'upcoming' && 'text-ink-muted',
                  )}
                >
                  {step.label}
                  <span className="sr-only">
                    {state === 'current'
                      ? ' (current step)'
                      : state === 'complete'
                        ? ' (completed)'
                        : ''}
                  </span>
                </span>
              </>
            )

            return (
              <li
                key={step.id}
                className={cn(
                  'relative flex flex-1 flex-col items-center rounded-control py-2',
                  state === 'current' && 'bg-linear-to-b from-primary-50 to-transparent',
                )}
              >
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-6 right-[calc(-50%+1.25rem)] left-[calc(50%+1.25rem)] h-px',
                      completed[index] ? 'bg-primary-300' : 'bg-line-strong',
                    )}
                  />
                )}
                {state === 'current' ? (
                  <span aria-current="step" className="flex flex-col items-center">
                    {marker}
                  </span>
                ) : reachable ? (
                  <Link
                    to={step.path}
                    className="group flex flex-col items-center rounded-control focus-visible:outline-offset-4"
                  >
                    {marker}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex cursor-not-allowed flex-col items-center"
                  >
                    {marker}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </Card>
    </nav>
  )
}
