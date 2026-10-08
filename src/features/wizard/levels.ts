import {
  Award,
  Building,
  Building2,
  Compass,
  Rocket,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { candidateLevelLabel, companyLevelLabel } from '@/lib/labels'
import type { CandidateLevel, CompanyLevel } from '@/types'

export interface LevelOption<T extends string> {
  value: T
  label: string
  description: string
  icon: LucideIcon
}

export const companyLevels: LevelOption<CompanyLevel>[] = [
  {
    value: 'startup',
    label: companyLevelLabel.startup,
    description: 'Basic features, simple architecture',
    icon: Rocket,
  },
  {
    value: 'mid-size',
    label: companyLevelLabel['mid-size'],
    description: 'Moderate complexity, real use cases',
    icon: Building,
  },
  {
    value: 'enterprise',
    label: companyLevelLabel.enterprise,
    description: 'Advanced features, scalability, security, event driven',
    icon: Building2,
  },
]

export const candidateLevels: LevelOption<CandidateLevel>[] = [
  {
    value: 'junior',
    label: candidateLevelLabel.junior,
    description: 'Basic implementation',
    icon: Sprout,
  },
  {
    value: 'mid',
    label: candidateLevelLabel.mid,
    description: 'Moderate complexity',
    icon: TrendingUp,
  },
  {
    value: 'senior',
    label: candidateLevelLabel.senior,
    description: 'Advanced features and best practices',
    icon: Award,
  },
  {
    value: 'lead',
    label: candidateLevelLabel.lead,
    description: 'System design, architecture',
    icon: Compass,
  },
]
