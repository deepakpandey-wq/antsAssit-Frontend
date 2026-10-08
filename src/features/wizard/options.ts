import {
  AppWindow,
  Boxes,
  Coffee,
  Database,
  FlaskConical,
  Infinity as InfinityIcon,
  Layers,
  Monitor,
  Server,
  Smartphone,
  SquareTerminal,
  Webhook,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export interface IconOption {
  value: string
  label: string
  icon: LucideIcon
}

export const targetRoles: IconOption[] = [
  { value: 'java-backend', label: 'Java Backend Developer', icon: Coffee },
  { value: 'frontend', label: 'Frontend Developer', icon: Monitor },
  { value: 'full-stack', label: 'Full Stack Developer', icon: Layers },
  { value: 'node-backend', label: 'Node.js Backend Developer', icon: Server },
  { value: 'devops', label: 'DevOps Engineer', icon: InfinityIcon },
  { value: 'mobile', label: 'Mobile Developer', icon: Smartphone },
  { value: 'data', label: 'Data Engineer', icon: Database },
  { value: 'qa', label: 'QA Automation Engineer', icon: FlaskConical },
]

export const projectTypes: IconOption[] = [
  { value: 'backend-service', label: 'Backend Service', icon: Server },
  { value: 'frontend-app', label: 'Frontend Application', icon: AppWindow },
  { value: 'full-stack-app', label: 'Full Stack Application', icon: Layers },
  { value: 'microservices', label: 'Microservices System', icon: Boxes },
  { value: 'rest-api', label: 'REST API', icon: Webhook },
  { value: 'cli', label: 'CLI Tool', icon: SquareTerminal },
  { value: 'data-pipeline', label: 'Data Pipeline', icon: Workflow },
]

export const findOption = (options: IconOption[], value: string) =>
  options.find((option) => option.value === value)
