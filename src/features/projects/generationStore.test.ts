import { nextSequentialId } from '@/lib/sequentialId'
import { assessmentService } from '@/services/assessmentService'
import { projectService } from '@/services/projectService'
import { useGeneration } from './generationStore'
import { useProjects } from './projectsStore'

const seeds = () => Object.fromEntries(projectService.getSeedProjects().map((p) => [p.id, p]))

beforeEach(() => {
  sessionStorage.clear()
  useProjects.setState({ projects: seeds() })
  useGeneration.setState({ job: null })
})

describe('nextSequentialId', () => {
  it('continues from the highest existing number', () => {
    expect(nextSequentialId('PROJ-', ['PROJ-1001', 'PROJ-1007', undefined, 'X-9'])).toBe(
      'PROJ-1008',
    )
    expect(nextSequentialId('PROJ-', [], { start: 1001 })).toBe('PROJ-1001')
    expect(nextSequentialId('ASM-', ['ASM-004'], { width: 3 })).toBe('ASM-005')
  })
})

describe('generation → saved project', () => {
  it('allocates ids that never repeat, even across reloads', () => {
    const draft = assessmentService.createSampleDraft()
    const first = useGeneration.getState().start(draft)
    expect(first).toMatchObject({ projectId: 'PROJ-1003', assessmentId: 'ASM-005' })

    useGeneration.getState().complete()
    expect(useProjects.getState().projects['PROJ-1003']).toMatchObject({
      id: 'PROJ-1003',
      assessmentId: 'ASM-005',
      assessment: { basicInfo: { title: 'Java Backend Developer Assessment' } },
    })

    // Simulates a reload: ids come from persisted data, not an in-memory counter.
    useGeneration.setState({ job: null })
    expect(useGeneration.getState().start(draft).projectId).toBe('PROJ-1004')
  })

  it('completes idempotently', () => {
    useGeneration.getState().start(assessmentService.createSampleDraft())
    useGeneration.getState().complete()
    const saved = useProjects.getState().projects['PROJ-1003']
    useGeneration.getState().complete()
    expect(useProjects.getState().projects['PROJ-1003']).toBe(saved)
    expect(Object.keys(useProjects.getState().projects)).toHaveLength(3)
  })
})
