import type { BadgeTone } from '@/components/ui'
import type { AssessmentStatus, CandidateLevel, CompanyLevel } from '@/types'

export const companyLevelLabel: Record<CompanyLevel, string> = {
  startup: 'Startup',
  'mid-size': 'Mid-Size',
  enterprise: 'Enterprise',
}

export const candidateLevelLabel: Record<CandidateLevel, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  lead: 'Lead',
}

export const statusMeta: Record<AssessmentStatus, { label: string; tone: BadgeTone }> = {
  generated: { label: 'Generated', tone: 'success' },
  'in-progress': { label: 'In Progress', tone: 'info' },
  draft: { label: 'Draft', tone: 'neutral' },
}
