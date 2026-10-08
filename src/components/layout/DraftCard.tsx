import { Link } from 'react-router'
import { ArrowRight, FilePenLine, Plus } from 'lucide-react'
import { Progress } from '@/components/ui'
import { wizardSteps } from '@/features/wizard/steps'
import { useAssessmentDraft } from '@/features/wizard/store'
import { stepComplete } from '@/features/wizard/validation'

/** Data steps only — Review is where you finish, not something you complete. */
const DATA_STEPS = wizardSteps.filter((step) => step.id !== 'review')
const REVIEW = wizardSteps[wizardSteps.length - 1]

const actionClasses =
  'mt-3 inline-flex h-8 items-center gap-1.5 rounded-control bg-nav-active px-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-nav-active-hover [&_svg]:size-3.5'

/** Sidebar card that resumes the assessment draft in progress (or starts one). */
export function DraftCard({ onNavigate }: { onNavigate?: () => void }) {
  const draft = useAssessmentDraft((state) => state.draft)
  const done = DATA_STEPS.map((step) => stepComplete[step.id](draft))
  const completed = done.filter(Boolean).length
  const nextStep = DATA_STEPS[done.indexOf(false)] ?? REVIEW
  const title = draft.basicInfo.title.trim()

  if (!title && completed === 0) {
    return (
      <div className="rounded-card border border-line bg-surface/70 p-4">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <FilePenLine className="size-4 text-primary-600" aria-hidden />
          No draft in progress
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          Define a role and generate a tailored interview project.
        </p>
        <Link to={wizardSteps[0].path} onClick={onNavigate} className={actionClasses}>
          <Plus aria-hidden />
          Start assessment
        </Link>
      </div>
    )
  }

  const ready = completed === DATA_STEPS.length
  return (
    <div className="rounded-card border border-line bg-surface/70 p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-ink-muted">
        <FilePenLine className="size-4 text-primary-600" aria-hidden />
        Draft in progress
      </p>
      <p className="mt-1.5 truncate text-[13px] font-semibold text-ink" title={title}>
        {title || 'Untitled assessment'}
      </p>
      <Progress
        className="mt-2.5"
        size="sm"
        label="Draft completion"
        value={completed}
        max={DATA_STEPS.length}
      />
      <p className="mt-1.5 text-xs text-ink-muted">
        {ready
          ? 'Ready to generate'
          : `${completed} of ${DATA_STEPS.length} steps · Next: ${nextStep.label}`}
      </p>
      <Link to={nextStep.path} onClick={onNavigate} className={actionClasses}>
        {ready ? 'Review & generate' : 'Continue'}
        <ArrowRight aria-hidden />
      </Link>
    </div>
  )
}
