import { assessmentService } from '@/services/assessmentService'
import { buildGenerationPlan, planDuration, snapshotAt, STAGE_LABELS } from './generationPlan'

const plan = buildGenerationPlan(assessmentService.createSampleDraft(), 'PROJ-1003')
const total = planDuration(plan)
const allLogs = plan.flatMap((stage) => stage.logs.map((log) => log.text))

describe('buildGenerationPlan', () => {
  it('has the seven required stages in order', () => {
    expect(plan.map((stage) => stage.label)).toEqual([...STAGE_LABELS])
    expect(STAGE_LABELS).toHaveLength(7)
  })

  it('writes logs from the assessment itself', () => {
    expect(allLogs).toContain('Selected Spring Boot boilerplate')
    expect(allLogs).toContain('Applying microservices architecture')
    expect(allLogs).toContain('Adding Docker configuration...')
    expect(allLogs).toContain('Generated 22 requirements across 7 sections')
    expect(allLogs).toContain('Generated 46 test cases across 21 competencies')
    expect(allLogs.at(-1)).toBe('PROJ-1003 is ready')
  })

  it('omits Docker for a startup project without Docker', () => {
    const draft = assessmentService.createSampleDraft()
    draft.companyLevel = 'startup'
    const texts = buildGenerationPlan(draft, 'P').flatMap((s) => s.logs.map((l) => l.text))
    expect(texts).not.toContain('Adding Docker configuration...')
  })
})

describe('snapshotAt', () => {
  it('starts with the first stage active', () => {
    const snap = snapshotAt(plan, 0)
    expect(snap.stages.map((s) => s.state)).toEqual(['active', ...Array(6).fill('pending')])
    expect(snap).toMatchObject({ percent: 0, activeIndex: 0, done: false })
    expect(snap.logs.map((l) => l.text)).toEqual(['Initializing project generation...'])
  })

  it('tracks the active stage mid-way', () => {
    const snap = snapshotAt(plan, plan[0].durationMs + plan[1].durationMs + 100) // into stage 3
    expect(snap.stages.map((s) => s.state).slice(0, 4)).toEqual([
      'done',
      'done',
      'active',
      'pending',
    ])
    expect(snap.activeIndex).toBe(2)
    expect(snap.percent).toBe(Math.floor(((3000 + 100) / total) * 100))
    expect(snap.remainingMs).toBe(total - 3100)
  })

  it('clamps to a finished state', () => {
    const snap = snapshotAt(plan, total * 3)
    expect(snap.done).toBe(true)
    expect(snap.percent).toBe(100)
    expect(snap.stages.every((s) => s.state === 'done')).toBe(true)
    expect(snap.logs).toHaveLength(allLogs.length)
    expect(snapshotAt(plan, -500).percent).toBe(0)
  })
})
