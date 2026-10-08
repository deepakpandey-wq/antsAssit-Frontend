import { createId } from '@/lib/id'
import { nextSequentialId } from '@/lib/sequentialId'
import type { AssessmentDraft, GeneratedProject, GenerationJob } from '@/types'
import { recentAssessments } from './mock/fixtures'
import { seedProjects } from './mock/projects'

interface KnownIds {
  projectIds: (string | undefined)[]
  assessmentIds: (string | undefined)[]
}

/**
 * Phase 1: generation is simulated client-side. Phase 2 replaces this with
 * `POST /projects/generate` returning the same GenerationJob shape.
 */
export const projectService = {
  getSeedProjects(): GeneratedProject[] {
    return structuredClone(seedProjects)
  },

  /** Ids continue from everything already known, so they never repeat across reloads. */
  startGeneration(assessment: AssessmentDraft, known: KnownIds): GenerationJob {
    return {
      id: createId('job'),
      projectId: nextSequentialId('PROJ-', known.projectIds, { start: 1001 }),
      assessmentId: nextSequentialId(
        'ASM-',
        [...known.assessmentIds, ...recentAssessments.map((item) => item.id)],
        { width: 3 },
      ),
      assessment: structuredClone(assessment),
      status: 'running',
      startedAt: new Date().toISOString(),
    }
  },

  projectFromJob(job: GenerationJob): GeneratedProject {
    return {
      id: job.projectId,
      assessmentId: job.assessmentId,
      assessment: job.assessment,
      generatedAt: new Date().toISOString(),
    }
  },
}
