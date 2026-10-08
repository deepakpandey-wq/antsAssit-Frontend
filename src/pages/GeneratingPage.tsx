import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleX,
  FolderOpen,
  LoaderCircle,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  IconTile,
  Modal,
  Progress,
} from '@/components/ui'
import { StageList } from '@/features/projects/components/StageList'
import { TerminalLog } from '@/features/projects/components/TerminalLog'
import { useGeneration } from '@/features/projects/generationStore'
import { useGenerationProgress } from '@/features/projects/useGenerationProgress'
import { formatRemaining } from '@/lib/format'

/** Delay between reaching 100% and opening the project, so the finish is visible. */
const OPEN_PROJECT_DELAY_MS = 900
const REVIEW_PATH = '/assessments/create/review'

export function GeneratingPage() {
  const navigate = useNavigate()
  const job = useGeneration((state) => state.job)
  const complete = useGeneration((state) => state.complete)
  const cancel = useGeneration((state) => state.cancel)
  const restart = useGeneration((state) => state.start)
  const snapshot = useGenerationProgress(job)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const finished = snapshot?.done ?? false
  const status = job?.status

  // The clock reached the end: complete the job and save the project (external store update).
  useEffect(() => {
    if (finished && status === 'running') complete()
  }, [finished, status, complete])

  // Completed: open the generated project after a short beat.
  useEffect(() => {
    if (status !== 'completed' || !job) return
    const timer = setTimeout(
      () =>
        navigate(`/projects/${job.projectId}`, { replace: true, state: { justGenerated: true } }),
      OPEN_PROJECT_DELAY_MS,
    )
    return () => clearTimeout(timer)
  }, [status, job, navigate])

  const header = (
    <PageHeader
      title="Generating Project"
      description="Please wait while we create your customized interview project."
      documentTitle="Generating Project"
    />
  )

  if (!job || !snapshot) {
    return (
      <>
        {header}
        <Card>
          <EmptyState
            icon={<FolderOpen />}
            title="No project is being generated"
            description="Create an assessment and choose Generate Project on the review step to start."
            action={
              <ButtonLink to="/assessments/create/basic-info" leftIcon={<Plus />}>
                Create Assessment
              </ButtonLink>
            }
          />
        </Card>
      </>
    )
  }

  if (job.status === 'cancelled') {
    return (
      <>
        {header}
        <Card>
          <EmptyState
            icon={<CircleX />}
            title="Generation cancelled"
            description={`“${job.assessment.basicInfo.title}” was not generated. Your assessment is unchanged.`}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink to={REVIEW_PATH} variant="secondary" leftIcon={<ArrowLeft />}>
                  Back to review
                </ButtonLink>
                <Button leftIcon={<RotateCcw />} onClick={() => restart(job.assessment)}>
                  Restart generation
                </Button>
              </div>
            }
          />
        </Card>
      </>
    )
  }

  const completed = job.status === 'completed'
  const active = snapshot.stages[snapshot.activeIndex]

  return (
    <>
      {header}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <IconTile tone={completed ? 'success' : 'solid'} size="lg">
            {completed ? <Check strokeWidth={2.5} /> : <LoaderCircle className="animate-spin" />}
          </IconTile>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-section-title text-ink">
              {completed ? 'Project ready' : `Generating “${job.assessment.basicInfo.title}”`}
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-muted" aria-live="polite">
              {completed ? (
                'Opening your project…'
              ) : (
                <>
                  Stage {snapshot.activeIndex + 1} of {snapshot.stages.length}
                  {/* The stage list already names the active stage on small screens. */}
                  <span className="hidden sm:inline"> · {active.label}</span> ·{' '}
                  {formatRemaining(snapshot.remainingMs)} remaining
                </>
              )}
            </p>
          </div>
          <Badge tone={completed ? 'success' : 'info'} shape="pill">
            {completed ? 'Completed' : 'In progress'}
          </Badge>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <StageList stages={snapshot.stages} />
          <div className="min-w-0">
            <TerminalLog logs={snapshot.logs} startedAt={job.startedAt} running={!completed} />
            <div className="mt-5 flex items-center gap-4">
              <Progress value={snapshot.percent} label="Generation progress" className="flex-1" />
              <span className="w-11 text-right text-sm font-semibold text-ink tabular-nums">
                {snapshot.percent}%
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              This may take a few minutes. Please don’t close this page.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {completed ? (
            <ButtonLink
              to={`/projects/${job.projectId}`}
              state={{ justGenerated: true }}
              rightIcon={<ArrowRight />}
            >
              View project
            </ButtonLink>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmCancel(true)}>
              Cancel
            </Button>
          )}
        </div>
      </Card>

      <Modal
        open={confirmCancel && !completed}
        onClose={() => setConfirmCancel(false)}
        size="sm"
        title="Cancel generation?"
        description="Progress so far will be discarded. You can restart generation at any time."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
              Keep generating
            </Button>
            <Button
              onClick={() => {
                cancel()
                setConfirmCancel(false)
              }}
            >
              Cancel generation
            </Button>
          </>
        }
      />
    </>
  )
}
