export type CompanyLevel = 'startup' | 'mid-size' | 'enterprise'
export type CandidateLevel = 'junior' | 'mid' | 'senior' | 'lead'
export type AssessmentStatus = 'draft' | 'in-progress' | 'generated'

export interface User {
  id: string
  name: string
  firstName: string
  email: string
}

export interface AssessmentSummary {
  id: string
  title: string
  technology: string
  companyLevel: CompanyLevel
  status: AssessmentStatus
  /** ISO date */
  createdAt: string
  /** Present once a project has been generated. */
  projectId?: string
}

export type StatRange = '7d' | '30d' | '90d'

export type StatKey = 'assessments' | 'projects' | 'candidates' | 'evaluations'

export interface DashboardStat {
  key: StatKey
  label: string
  value: number
  /** Percentage change versus previous period. */
  change: number
  /** Sparkline points, oldest → newest. */
  trend: number[]
}

export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
}

export interface SearchResult {
  id: string
  kind: 'assessment' | 'project' | 'candidate'
  title: string
  subtitle: string
  href: string
}

/* ---------- Assessment wizard ---------- */

export type WizardStepId =
  'basic-info' | 'responsibilities' | 'competencies' | 'technologies' | 'company-level' | 'review'

/** Icon keys for list sections; mapped to icons in the UI layer. */
export type SectionIcon =
  'code' | 'leaf' | 'boxes' | 'database' | 'message' | 'flask' | 'network' | 'shield' | 'list'

export interface ListItem {
  id: string
  text: string
}

export interface ListSection {
  id: string
  name: string
  icon: SectionIcon
  items: ListItem[]
}

export interface BasicInfo {
  title: string
  description: string
  targetRole: string
  projectType: string
}

/** Draft keys that hold sectioned lists (edited with the shared list editor). */
export type ListKey = 'responsibilities' | 'competencies'

export interface AssessmentDraft {
  basicInfo: BasicInfo
  responsibilities: ListSection[]
  competencies: ListSection[]
  /** Ids from the technology catalog. */
  technologies: string[]
  customSkills: string[]
  companyLevel: CompanyLevel | null
  candidateLevel: CandidateLevel | null
}

/* ---------- Technology catalog ---------- */

export type TechIcon =
  | 'coffee'
  | 'leaf'
  | 'workflow'
  | 'database'
  | 'container'
  | 'flask'
  | 'package'
  | 'layers'
  | 'atom'
  | 'server'
  | 'file-code'
  | 'boxes'
  | 'git-branch'
  | 'refresh'
  | 'terminal'
  | 'ship'
  | 'cloud'
  | 'braces'
  | 'hexagon'
  | 'zap'
  | 'globe'

export type TechTone =
  'primary' | 'info' | 'success' | 'warning' | 'teal' | 'purple' | 'danger' | 'neutral'

export interface Technology {
  id: string
  name: string
  category: 'language' | 'framework' | 'data' | 'messaging' | 'devops' | 'testing' | 'architecture'
  icon: TechIcon
  tone: TechTone
  /** Shown in the "Popular Technologies" grid when not searching. */
  popular: boolean
}

/* ---------- Project generation ---------- */

export type GenerationStatus = 'running' | 'completed' | 'cancelled'

export interface GenerationJob {
  id: string
  /** Assigned up front so the success screen can link to /projects/:id. */
  projectId: string
  assessmentId: string
  /** Snapshot of the draft at the moment Generate was pressed. */
  assessment: AssessmentDraft
  status: GenerationStatus
  /** ISO timestamp */
  startedAt: string
}

export interface GeneratedProject {
  id: string
  assessmentId: string
  /** The assessment the project was generated from (snapshot). */
  assessment: AssessmentDraft
  /** ISO timestamp */
  generatedAt: string
}
