import type { SearchResult } from '@/types'
import { recentAssessments } from './mock/fixtures'

const index: SearchResult[] = [
  ...recentAssessments.map<SearchResult>((assessment) => ({
    id: assessment.id,
    kind: 'assessment',
    title: assessment.title,
    subtitle: `${assessment.technology} · ${assessment.id}`,
    href: assessment.projectId
      ? `/projects/${assessment.projectId}`
      : '/assessments/create/basic-info',
  })),
  {
    id: 'PROJ-1001',
    kind: 'project',
    title: 'Java Backend Developer Assessment',
    subtitle: 'Spring Boot · PROJ-1001',
    href: '/projects/PROJ-1001',
  },
  {
    id: 'PROJ-1002',
    kind: 'project',
    title: 'Backend Developer Assessment',
    subtitle: 'NestJS · PROJ-1002',
    href: '/projects/PROJ-1002',
  },
  {
    id: 'CND-001',
    kind: 'candidate',
    title: 'Priya Sharma',
    subtitle: 'Backend Developer · Candidate',
    href: '/candidates',
  },
  {
    id: 'CND-002',
    kind: 'candidate',
    title: 'Rahul Verma',
    subtitle: 'Frontend Developer · Candidate',
    href: '/candidates',
  },
]

export const searchService = {
  search(query: string, limit = 6): SearchResult[] {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return index
      .filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(needle))
      .slice(0, limit)
  },
}
