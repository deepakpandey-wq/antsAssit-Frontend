import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { projectService } from '@/services/projectService'
import type { AssessmentDraft, GenerationJob } from '@/types'
import { useProjects } from './projectsStore'

interface GenerationState {
  job: GenerationJob | null
  /** Starts a new job from the current draft and returns it. */
  start: (assessment: AssessmentDraft) => GenerationJob
  /** Marks the job completed and saves the generated project (idempotent). */
  complete: () => void
  cancel: () => void
  clear: () => void
}

/** The current (most recent) generation job, shared by Review → Generating → Project. */
export const useGeneration = create<GenerationState>()(
  persist(
    (set, get) => ({
      job: null,
      start: (assessment) => {
        const projects = Object.values(useProjects.getState().projects)
        const current = get().job
        const job = projectService.startGeneration(assessment, {
          projectIds: [...projects.map((p) => p.id), current?.projectId],
          assessmentIds: [...projects.map((p) => p.assessmentId), current?.assessmentId],
        })
        set({ job })
        return job
      },
      complete: () => {
        const job = get().job
        if (!job) return
        if (!useProjects.getState().projects[job.projectId]) {
          useProjects.getState().save(projectService.projectFromJob(job))
        }
        if (job.status !== 'completed') set({ job: { ...job, status: 'completed' } })
      },
      cancel: () =>
        set((state) => (state.job ? { job: { ...state.job, status: 'cancelled' } } : state)),
      clear: () => set({ job: null }),
    }),
    {
      name: 'interview-assessment:generation',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ job: state.job }),
    },
  ),
)
