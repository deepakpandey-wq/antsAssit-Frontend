import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useWizardProgress } from '../useWizardProgress'

interface WizardFooterProps {
  /** Return false to block navigation (e.g. validation failed). */
  onNext?: () => boolean | void
  /** Replaces the default Next button. */
  primaryAction?: ReactNode
  /** Rendered on the left (e.g. "Start over" on the Review step). */
  leading?: ReactNode
}

/** Back / Next buttons shared by every wizard step. */
export function WizardFooter({ onNext, primaryAction, leading }: WizardFooterProps) {
  const navigate = useNavigate()
  const { previous, next } = useWizardProgress()

  const goNext = () => {
    if (onNext?.() === false) return
    if (next) navigate(next.path)
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
      {leading && <div className="mr-auto">{leading}</div>}
      <Button
        variant="secondary"
        leftIcon={<ArrowLeft />}
        onClick={() => navigate(previous ? previous.path : '/dashboard')}
      >
        Back
      </Button>
      {primaryAction ??
        (next && (
          <Button rightIcon={<ArrowRight />} onClick={goNext} className="min-w-24">
            Next
          </Button>
        ))}
    </div>
  )
}
