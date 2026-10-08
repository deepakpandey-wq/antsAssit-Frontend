import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { projectService } from '@/services/projectService'
import type { GeneratedProject } from '@/types'

interface ProjectsState {
  projects: Record<string, GeneratedProject>
  save: (project: GeneratedProject) => void
}

const seeds = Object.fromEntries(projectService.getSeedProjects().map((p) => [p.id, p]))

/** Generated projects, seeded with the ones referenced by the dashboard. */
export const useProjects = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: seeds,
      save: (project) =>
        set((state) => ({ projects: { ...state.projects, [project.id]: project } })),
    }),
    {
      name: 'interview-assessment:projects',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ projects: state.projects }),
    },
  ),
)
