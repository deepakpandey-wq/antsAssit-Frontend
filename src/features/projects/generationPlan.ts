import type { AssessmentDraft, ListSection } from '@/types'
import { previewComplexity } from '../wizard/complexity'
import { describeStack } from './stack'

export interface PlanLog {
  /** Offset from the start of its stage, ms. */
  at: number
  text: string
  /** Success lines get a check mark in the terminal. */
  success?: boolean
}

export interface PlanStage {
  id: string
  label: string
  durationMs: number
  logs: PlanLog[]
}

/** The seven generation stages required by the Phase 1 spec, in order. */
export const STAGE_LABELS = [
  'Initializing project generation',
  'Selecting boilerplate template',
  'Customizing project structure',
  'Generating requirements',
  'Creating test cases',
  'Preparing documentation',
  'Packaging project',
] as const

const count = (sections: ListSection[]) =>
  sections.reduce((sum, section) => sum + section.items.length, 0)

/** Builds the simulated generation script for one assessment. */
export function buildGenerationPlan(assessment: AssessmentDraft, projectId: string): PlanStage[] {
  const { boilerplate, names } = describeStack(assessment)
  const stack = names.join(', ')
  const preview = previewComplexity(
    assessment.companyLevel,
    assessment.candidateLevel,
    assessment.technologies,
  )
  const architecture = preview?.features[0] ?? 'Layered architecture'
  const docker = preview?.features.includes('Docker configuration') ?? false
  const responsibilities = count(assessment.responsibilities)
  const competencies = count(assessment.competencies)
  const sections = assessment.responsibilities.filter((section) => section.items.length).length
  const testCases = competencies * 2 + 4

  const logs: PlanLog[][] = [
    [
      { at: 0, text: 'Initializing project generation...' },
      { at: 700, text: `Loaded “${assessment.basicInfo.title}”`, success: true },
    ],
    [
      { at: 0, text: `Analyzing stack: ${stack || 'none selected'}` },
      { at: 1100, text: `Selected ${boilerplate} boilerplate`, success: true },
    ],
    [
      { at: 0, text: 'Creating project structure...' },
      { at: 900, text: `Applying ${architecture.toLowerCase()}` },
      ...(docker ? [{ at: 1700, text: 'Adding Docker configuration...' }] : []),
    ],
    [
      { at: 0, text: 'Generating requirements...' },
      {
        at: 1500,
        text: `Generated ${responsibilities} requirements across ${sections} sections`,
        success: true,
      },
    ],
    [
      { at: 0, text: 'Creating test cases...' },
      {
        at: 1600,
        text: `Generated ${testCases} test cases across ${competencies} competencies`,
        success: true,
      },
    ],
    [
      { at: 0, text: 'Generating README...' },
      { at: 1000, text: 'Writing evaluation rubric...' },
    ],
    [
      { at: 0, text: 'Packaging project...' },
      { at: 1200, text: `${projectId} is ready`, success: true },
    ],
  ]
  const durations = [1200, 1800, 2400, 2200, 2400, 1800, 1600]

  return STAGE_LABELS.map((label, index) => ({
    id: `stage-${index + 1}`,
    label,
    durationMs: durations[index],
    logs: logs[index],
  }))
}

export type StageState = 'done' | 'active' | 'pending'

export interface GenerationSnapshot {
  stages: (PlanStage & { state: StageState })[]
  /** 0–100, integer. */
  percent: number
  activeIndex: number
  remainingMs: number
  done: boolean
  /** Visible log lines with their absolute offset from the job start. */
  logs: (PlanLog & { offset: number })[]
}

/** Pure: where a plan is after `elapsedMs`. Drives the UI and makes the flow testable. */
export function snapshotAt(plan: PlanStage[], elapsedMs: number): GenerationSnapshot {
  const total = plan.reduce((sum, stage) => sum + stage.durationMs, 0)
  const elapsed = Math.min(Math.max(elapsedMs, 0), total)
  const done = elapsed >= total

  let start = 0
  let activeIndex = plan.length - 1
  const logs: GenerationSnapshot['logs'] = []
  const stages = plan.map((stage, index) => {
    const end = start + stage.durationMs
    const state: StageState =
      done || elapsed >= end ? 'done' : elapsed >= start ? 'active' : 'pending'
    if (state === 'active') activeIndex = index
    for (const log of stage.logs) {
      if (start + log.at <= elapsed) logs.push({ ...log, offset: start + log.at })
    }
    start = end
    return { ...stage, state }
  })

  return {
    stages,
    percent: Math.floor((elapsed / total) * 100),
    activeIndex: done ? plan.length - 1 : activeIndex,
    remainingMs: total - elapsed,
    done,
    logs,
  }
}

export const planDuration = (plan: PlanStage[]) =>
  plan.reduce((sum, stage) => sum + stage.durationMs, 0)
