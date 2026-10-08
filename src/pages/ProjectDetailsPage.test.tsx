import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useProjects } from '@/features/projects/projectsStore'
import { assessmentService } from '@/services/assessmentService'
import { projectService } from '@/services/projectService'
import { renderRoute } from '@/test/renderRoute'

const PATH = '/projects/PROJ-1001'
const tableRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1)
const info = (label: string) => screen.getByText(label, { selector: 'dt' }).nextElementSibling

beforeEach(() => {
  sessionStorage.clear()
  useProjects.setState({
    projects: Object.fromEntries(projectService.getSeedProjects().map((p) => [p.id, p])),
  })
})

describe('Generated Project Details', () => {
  it('shows the overview with project information and contents', () => {
    renderRoute(PATH)
    expect(screen.getByRole('heading', { level: 1, name: 'Generated Project' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(info('Project ID')).toHaveTextContent('PROJ-1001')
    expect(info('Assessment ID')).toHaveTextContent('ASM-001')
    expect(info('Technology')).toHaveTextContent('Spring Boot')
    expect(info('Company Level')).toHaveTextContent('Enterprise')
    expect(info('Candidate Level')).toHaveTextContent('Senior')
    expect(info('Generated At')).toHaveTextContent('12 Mar 2025 12:15 PM')
    expect(info('File Size')).toHaveTextContent(/^\d+(\.\d)? KB$/)
    expect(screen.getByRole('button', { name: /Docker Configuration/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Generated Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('switches tabs through the URL (deep-linkable)', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute(PATH)
    await user.click(screen.getByRole('button', { name: /Preview Requirements/ }))
    expect(router.state.location.search).toBe('?tab=requirements')
    expect(tableRows()).toHaveLength(22)
    expect(tableRows()[0]).toHaveTextContent('REQ-001')

    await user.click(screen.getByRole('tab', { name: 'Test Cases' }))
    expect(tableRows()).toHaveLength(46)
    expect(screen.getByText('4 E2E')).toBeInTheDocument()
  })

  it('opens a deep-linked tab directly', () => {
    renderRoute(`${PATH}?tab=readme`)
    const readme = screen.getByRole('article', { name: 'README preview' })
    expect(within(readme).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Java Backend Developer Assessment',
    )
    expect(within(readme).getByText('./mvnw spring-boot:run', { exact: false })).toBeInTheDocument()
  })

  it('opens project contents in the file explorer and collapses folders', async () => {
    const user = userEvent.setup()
    renderRoute(PATH)
    await user.click(screen.getByRole('button', { name: /Docker Configuration/ }))
    expect(screen.getByRole('tab', { name: 'Project Structure' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    const files = screen.getByRole('navigation', { name: 'Project files' })
    expect(within(files).getByRole('button', { name: 'docker-compose.yml' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByLabelText('Contents of docker-compose.yml')).toHaveTextContent('postgres:16')

    const src = within(files).getByRole('button', { name: 'src' })
    expect(src).toHaveAttribute('aria-expanded', 'true')
    await user.click(src)
    expect(src).toHaveAttribute('aria-expanded', 'false')
    expect(
      within(files).queryByRole('button', { name: 'Application.java' }),
    ).not.toBeInTheDocument()
  })

  it('downloads a ZIP named after the project', async () => {
    const user = userEvent.setup()
    const createObjectURL = vi.fn((blob: Blob) => (void blob, 'blob:mock'))
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe('java-backend-developer-assessment.zip')
      expect(this.href).toBe('blob:mock')
    })

    renderRoute(PATH)
    await user.click(screen.getAllByRole('button', { name: 'Download ZIP' })[0])
    expect(click).toHaveBeenCalledTimes(1)
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('application/zip')
    const bytes = new Uint8Array(await blob.arrayBuffer())
    expect([...bytes.subarray(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]) // "PK\x03\x04"
    click.mockRestore()
  })

  it('shows the success banner right after generation', async () => {
    const user = userEvent.setup()
    renderRoute({ pathname: PATH, state: { justGenerated: true } })
    expect(screen.getByRole('status')).toHaveTextContent('Project generated successfully')
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Project generated successfully')).not.toBeInTheDocument()
  })

  it('handles unknown projects', () => {
    renderRoute('/projects/PROJ-9999')
    expect(screen.getByText('Project not found')).toBeInTheDocument()
    expect(screen.getByText(/PROJ-9999/)).toBeInTheDocument()
  })

  it('lists newly generated projects on the dashboard and the projects page', async () => {
    const user = userEvent.setup()
    const project = {
      ...projectService.projectFromJob({
        ...projectService.startGeneration(assessmentService.createSampleDraft(), {
          projectIds: ['PROJ-1001', 'PROJ-1002'],
          assessmentIds: [],
        }),
      }),
      generatedAt: '2026-10-08T09:30:00',
    }
    useProjects.getState().save(project)

    renderRoute('/dashboard')
    expect(tableRows()[0]).toHaveTextContent('Java Backend Developer Assessment')
    expect(tableRows()[0]).toHaveTextContent('Generated')

    await user.click(screen.getByRole('link', { name: 'Generated Projects' }))
    expect(tableRows()).toHaveLength(3)
    expect(tableRows()[0]).toHaveTextContent('PROJ-1003')
  })
})
