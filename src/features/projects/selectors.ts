import type { AssessmentSummary, GeneratedProject } from '@/types'
import { describeStack } from './stack'

/** Dashboard rows for projects generated in this session (newest first). */
export function generatedSummaries(
  projects: GeneratedProject[],
  existing: AssessmentSummary[],
): AssessmentSummary[] {
  return projects
    .filter((project) => !existing.some((row) => row.projectId === project.id))
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
    .map((project) => ({
      id: project.assessmentId,
      title: project.assessment.basicInfo.title,
      technology: describeStack(project.assessment).boilerplate,
      companyLevel: project.assessment.companyLevel ?? 'startup',
      status: 'generated',
      createdAt: project.generatedAt.slice(0, 10),
      projectId: project.id,
    }))
}
