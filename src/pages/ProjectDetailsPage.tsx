import { useMemo, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, Check, CircleCheck, Download, FileQuestion, Link2, X } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Button, ButtonLink, Card, EmptyState, TabPanel, Tabs } from '@/components/ui'
import { buildProjectContent } from '@/features/projects/content'
import { ProjectOverview } from '@/features/projects/details/ProjectOverview'
import { ProjectStructure } from '@/features/projects/details/ProjectStructure'
import { ReadmeTab } from '@/features/projects/details/ReadmeTab'
import { RequirementsTab } from '@/features/projects/details/RequirementsTab'
import { TestCasesTab } from '@/features/projects/details/TestCasesTab'
import { useProjects } from '@/features/projects/projectsStore'
import { downloadBytes, formatBytes } from '@/lib/download'
import { useCopyToClipboard } from '@/lib/hooks'
import { createZip } from '@/lib/zip'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'tests', label: 'Test Cases' },
  { id: 'structure', label: 'Project Structure' },
  { id: 'readme', label: 'README Preview' },
] as const
type TabId = (typeof TABS)[number]['id']

const isTab = (value: string | null): value is TabId => TABS.some((tab) => tab.id === value)

export function ProjectDetailsPage() {
  const { id = '' } = useParams()
  const project = useProjects((state) => state.projects[id])
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const justGenerated = (location.state as { justGenerated?: boolean } | null)?.justGenerated
  const [showBanner, setShowBanner] = useState(Boolean(justGenerated))
  const [selectedPath, setSelectedPath] = useState('README.md')
  const { copied, copy } = useCopyToClipboard()

  const rawTab = params.get('tab')
  const tab: TabId = isTab(rawTab) ? rawTab : 'overview'
  const setTab = (next: TabId) => setParams(next === 'overview' ? {} : { tab: next })

  const content = useMemo(() => (project ? buildProjectContent(project) : null), [project])
  const zip = useMemo(
    () =>
      project && content
        ? createZip(
            content.files.map((file) => ({
              path: `${content.slug}/${file.path}`,
              content: file.content,
            })),
            new Date(project.generatedAt),
          )
        : null,
    [project, content],
  )

  if (!project || !content || !zip) {
    return (
      <>
        <PageHeader title="Generated Project" documentTitle="Project not found" />
        <Card>
          <EmptyState
            icon={<FileQuestion />}
            title="Project not found"
            description={`There is no generated project with the id “${id}”.`}
            action={
              <ButtonLink to="/dashboard" variant="secondary" leftIcon={<ArrowLeft />}>
                Back to dashboard
              </ButtonLink>
            }
          />
        </Card>
      </>
    )
  }

  const download = () => downloadBytes(zip, `${content.slug}.zip`)

  /** Opens a file (or a folder's first file) in the Project Structure tab. */
  const openPath = (path: string) => {
    const file =
      content.files.find((entry) => entry.path === path) ??
      content.files.find((entry) => entry.path.startsWith(`${path}/`))
    if (file) setSelectedPath(file.path)
    setTab('structure')
  }

  return (
    <>
      <PageHeader
        title="Generated Project"
        description="Your interview project has been generated successfully."
        documentTitle={`${project.id} · ${content.title}`}
        actions={
          <>
            <Button variant="secondary" leftIcon={<Download />} onClick={download}>
              Download ZIP
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label={copied ? 'Project link copied' : 'Copy project link'}
              onClick={() => copy(window.location.href)}
            >
              {copied ? <Check className="text-success-500" /> : <Link2 />}
            </Button>
          </>
        }
      />

      {showBanner && (
        <div
          role="status"
          className="mb-5 flex animate-pop-in items-start gap-3 rounded-card border border-success-500/25 bg-success-50 px-4 py-3"
        >
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-success-700">
              Project generated successfully
            </p>
            <p className="text-xs text-success-700/80">
              {content.files.length} files · {formatBytes(zip.length)} ·{' '}
              {content.requirements.length} requirements · {content.testCases.length} test cases —
              ready to share with candidates.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dismiss"
            onClick={() => setShowBanner(false)}
            className="text-success-700 hover:bg-success-500/10"
          >
            <X />
          </Button>
        </div>
      )}

      <Tabs
        label="Project sections"
        tabs={[...TABS]}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />

      <TabPanel key={tab}>
        {tab === 'overview' && (
          <ProjectOverview
            project={project}
            content={content}
            zipSize={zip.length}
            onDownload={download}
            onOpenTab={setTab}
            onOpenPath={openPath}
          />
        )}
        {tab === 'requirements' && <RequirementsTab requirements={content.requirements} />}
        {tab === 'tests' && <TestCasesTab testCases={content.testCases} />}
        {tab === 'structure' && (
          <ProjectStructure
            slug={content.slug}
            files={content.files}
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
          />
        )}
        {tab === 'readme' && <ReadmeTab readme={content.readme} />}
      </TabPanel>
    </>
  )
}
