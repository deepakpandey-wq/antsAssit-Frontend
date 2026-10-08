import { useEffect, useMemo, useState } from 'react'
import type { GenerationJob } from '@/types'
import { buildGenerationPlan, snapshotAt } from './generationPlan'

const TICK_MS = 200

/**
 * Live snapshot of a job's simulated progress. Progress is derived from wall-clock time
 * since `job.startedAt`, so a page reload resumes exactly where it was.
 */
export function useGenerationProgress(job: GenerationJob | null) {
  const plan = useMemo(
    () => (job ? buildGenerationPlan(job.assessment, job.projectId) : null),
    [job],
  )
  const [now, setNow] = useState(() => Date.now())
  const running = job?.status === 'running'

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [running])

  if (!job || !plan) return null
  // A completed job always renders as 100%, even if the clock was paused.
  const elapsed = job.status === 'completed' ? Infinity : now - Date.parse(job.startedAt)
  return snapshotAt(plan, elapsed)
}
