import { technologyService } from '@/services/technologyService'
import type { AssessmentDraft } from '@/types'

export type SourceKind = 'java' | 'node' | 'web' | 'python' | 'go' | 'generic'

/** Frameworks/languages that decide the boilerplate, in priority order. */
const BOILERPLATES: [id: string, kind: SourceKind][] = [
  ['spring-boot', 'java'],
  ['java', 'java'],
  ['nestjs', 'node'],
  ['nodejs', 'node'],
  ['nextjs', 'web'],
  ['react', 'web'],
  ['angular', 'web'],
  ['vue', 'web'],
  ['python', 'python'],
  ['go', 'go'],
  ['typescript', 'node'],
]

const DATABASES = ['postgresql', 'mysql', 'mongodb']

export interface StackSummary {
  /** Display name of the boilerplate, e.g. "Spring Boot". */
  boilerplate: string
  kind: SourceKind
  /** All technology names + custom skills, in selection order. */
  names: string[]
  database: string | null
}

export function describeStack(assessment: AssessmentDraft): StackSummary {
  const techs = technologyService.getByIds(assessment.technologies)
  const match = BOILERPLATES.find(([id]) => assessment.technologies.includes(id))
  const boilerplateTech = match ? techs.find((tech) => tech.id === match[0]) : undefined
  const database = techs.find((tech) => DATABASES.includes(tech.id))?.name ?? null
  return {
    boilerplate: boilerplateTech?.name ?? techs[0]?.name ?? 'Generic',
    kind: match?.[1] ?? 'generic',
    names: [...techs.map((tech) => tech.name), ...assessment.customSkills],
    database,
  }
}
