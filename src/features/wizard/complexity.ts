import type { CandidateLevel, CompanyLevel } from '@/types'

export type ComplexityTier = 'Low' | 'Medium' | 'High' | 'Very high'

export interface ComplexityPreview {
  tier: ComplexityTier
  /** Rough time a candidate needs to complete the project. */
  estimate: string
  features: string[]
}

const companyScore: Record<CompanyLevel, number> = { startup: 1, 'mid-size': 2, enterprise: 3 }
const candidateScore: Record<CandidateLevel, number> = { junior: 1, mid: 2, senior: 3, lead: 4 }

const architecture: Record<CompanyLevel, string> = {
  startup: 'Simple layered architecture',
  'mid-size': 'Modular monolith architecture',
  enterprise: 'Microservices architecture',
}

const companyExtras: Record<CompanyLevel, string[]> = {
  startup: ['Basic CRUD operations'],
  'mid-size': ['Caching strategy'],
  enterprise: ['Security implementation'],
}

const candidateFeatures: Record<CandidateLevel, string[]> = {
  junior: ['Guided starter code', 'Core unit tests'],
  mid: ['Error handling', 'Unit and integration tests'],
  senior: ['Advanced error handling', 'Comprehensive test cases'],
  lead: ['System design document', 'Comprehensive test cases', 'Performance requirements'],
}

/** Features unlocked by specific selected technologies. */
const techFeatures: [string, string][] = [
  ['kafka', 'Kafka integration'],
  ['redis', 'Redis caching'],
  ['kubernetes', 'Kubernetes manifests'],
  ['ci-cd', 'CI/CD pipeline'],
]

const tiers: [maxScore: number, tier: ComplexityTier, estimate: string][] = [
  [3, 'Low', '2–3 hours'],
  [5, 'Medium', '3–5 hours'],
  [6, 'High', '5–8 hours'],
  [Infinity, 'Very high', '8–12 hours'],
]

/**
 * What the generated project will include, derived from company level, candidate level
 * and selected technologies. Returns null until both levels are chosen.
 */
export function previewComplexity(
  company: CompanyLevel | null,
  candidate: CandidateLevel | null,
  technologies: string[],
): ComplexityPreview | null {
  if (!company || !candidate) return null

  const score = companyScore[company] + candidateScore[candidate]
  const [, tier, estimate] = tiers.find(([max]) => score <= max)!
  const containerised = company !== 'startup' || technologies.includes('docker')

  const features = [
    architecture[company],
    ...techFeatures.filter(([id]) => technologies.includes(id)).map(([, label]) => label),
    ...(containerised ? ['Docker configuration'] : []),
    ...candidateFeatures[candidate],
    ...companyExtras[company],
  ]

  return { tier, estimate, features: [...new Set(features)] }
}
