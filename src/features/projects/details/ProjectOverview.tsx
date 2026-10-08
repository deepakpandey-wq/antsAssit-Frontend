import {
  Braces,
  ChevronRight,
  ClipboardList,
  Container,
  Database,
  Download,
  Eye,
  FileCode2,
  FileText,
  FlaskConical,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react'
import { Badge, Button, Card, IconTile } from '@/components/ui'
import { formatBytes } from '@/lib/download'
import { formatDateTime } from '@/lib/format'
import { candidateLevelLabel, companyLevelLabel } from '@/lib/labels'
import type { GeneratedProject } from '@/types'
import type { ContentKind, ProjectContent } from '../content'

const contentIcons: Record<ContentKind, LucideIcon> = {
  source: FileCode2,
  readme: FileText,
  requirements: ClipboardList,
  tests: FlaskConical,
  docker: Container,
  database: Database,
  data: Braces,
}

interface ProjectOverviewProps {
  project: GeneratedProject
  content: ProjectContent
  zipSize: number
  onDownload: () => void
  onOpenTab: (tab: 'requirements' | 'tests') => void
  /** Opens a file/folder in the Project Structure tab. */
  onOpenPath: (path: string) => void
}

export function ProjectOverview({
  project,
  content,
  zipSize,
  onDownload,
  onOpenTab,
  onOpenPath,
}: ProjectOverviewProps) {
  const { assessment } = project
  const rows: [string, string][] = [
    ['Project ID', project.id],
    ['Assessment ID', project.assessmentId],
    ['Technology', content.technology],
    ['Company Level', assessment.companyLevel ? companyLevelLabel[assessment.companyLevel] : '—'],
    [
      'Candidate Level',
      assessment.candidateLevel ? candidateLevelLabel[assessment.candidateLevel] : '—',
    ],
    ['Generated At', formatDateTime(project.generatedAt)],
    ['File Size', formatBytes(zipSize)],
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="p-5">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <IconTile tone="solid" size="md">
              <PackageCheck strokeWidth={1.75} />
            </IconTile>
            <h2 className="min-w-0 flex-1 text-card-title text-ink">{content.title}</h2>
            <Badge tone="success">Completed</Badge>
          </div>
          <dl className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-6 gap-y-3 text-[13px]">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="text-ink-body">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-card-title text-ink">Project Contents</h2>
          <ul className="-mx-2 space-y-0.5">
            {content.contents.map((entry) => {
              const Icon = contentIcons[entry.kind]
              return (
                <li key={entry.kind}>
                  <button
                    type="button"
                    onClick={() => onOpenPath(entry.path)}
                    className="group flex w-full items-center gap-3 rounded-control px-2 py-2 text-left text-[13px] text-ink-body transition-colors hover:bg-surface-sunken hover:text-ink"
                  >
                    <Icon className="size-4 shrink-0 text-ink-muted" aria-hidden />
                    <span className="flex-1">{entry.label}</span>
                    <ChevronRight
                      aria-hidden
                      className="size-4 text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    <span className="sr-only">, open in project structure</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" leftIcon={<Download />} onClick={onDownload}>
          Download ZIP
        </Button>
        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Eye />}
          onClick={() => onOpenTab('requirements')}
        >
          Preview Requirements
        </Button>
        <Button variant="secondary" size="lg" onClick={() => onOpenTab('tests')}>
          View Test Cases
        </Button>
      </div>
    </div>
  )
}
