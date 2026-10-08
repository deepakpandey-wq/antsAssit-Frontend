import {
  Boxes,
  Code,
  Database,
  FlaskConical,
  Leaf,
  ListChecks,
  MessageSquareText,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { SectionIcon } from '@/types'

/** Icon + color for each section icon key (colors follow the reference). */
export const sectionIcons: Record<SectionIcon, { icon: LucideIcon; className: string }> = {
  code: { icon: Code, className: 'text-ink' },
  leaf: { icon: Leaf, className: 'text-success-500' },
  boxes: { icon: Boxes, className: 'text-info-500' },
  database: { icon: Database, className: 'text-info-700' },
  message: { icon: MessageSquareText, className: 'text-warning-500' },
  flask: { icon: FlaskConical, className: 'text-purple-500' },
  network: { icon: Network, className: 'text-success-700' },
  shield: { icon: ShieldCheck, className: 'text-info-500' },
  list: { icon: ListChecks, className: 'text-ink-muted' },
}
