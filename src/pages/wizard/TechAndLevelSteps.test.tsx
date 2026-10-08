import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAssessmentDraft } from '@/features/wizard/store'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

const techGroup = () => screen.getByRole('group', { name: /Popular Technologies|Results for/ })
const tile = (name: string) => within(techGroup()).getByRole('checkbox', { name })
const skills = () => screen.queryByRole('list', { name: 'Custom skills' })

beforeEach(() => {
  sessionStorage.clear()
  useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
})

describe('Technologies step', () => {
  it('shows the popular grid with the draft selection', () => {
    renderRoute('/assessments/create/technologies')
    const boxes = within(techGroup()).getAllByRole('checkbox')
    expect(boxes).toHaveLength(16)
    expect(boxes.filter((box) => (box as HTMLInputElement).checked)).toHaveLength(4)
    expect(tile('Java')).toBeChecked()
    expect(screen.getByText('4 selected')).toBeInTheDocument()
    expect(
      within(skills()!)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['Elasticsearch', 'RabbitMQ'])
  })

  it('toggles tiles and keeps search picks visible afterwards', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/technologies')
    await user.click(tile('Docker'))
    expect(tile('Docker')).toBeChecked()
    await user.click(tile('Java'))
    expect(tile('Java')).not.toBeChecked()

    const search = screen.getByRole('searchbox', { name: 'Search technologies' })
    await user.type(search, 'pyth')
    expect(within(techGroup()).getAllByRole('checkbox')).toHaveLength(1)
    await user.click(tile('Python'))
    await user.clear(search)
    expect(tile('Python')).toBeChecked() // appended to the default grid
    expect(useAssessmentDraft.getState().draft.technologies).toEqual([
      'spring-boot',
      'kafka',
      'postgresql',
      'docker',
      'python',
    ])
  })

  it('adds, de-duplicates, redirects and removes custom skills', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/technologies')
    const input = screen.getByRole('textbox', { name: 'Custom Skills' })

    await user.type(input, 'Ansible{Enter}')
    expect(within(skills()!).getByText('Ansible')).toBeInTheDocument()
    expect(input).toHaveValue('')

    await user.type(input, 'rabbitmq{Enter}')
    expect(screen.getByText('“rabbitmq” is already added.')).toBeInTheDocument()
    expect(input).toHaveValue('rabbitmq')

    await user.clear(input)
    await user.type(input, 'docker{Enter}')
    expect(screen.getByText(/Docker is in the catalog/)).toBeInTheDocument()
    expect(tile('Docker')).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Remove Elasticsearch' }))
    await user.click(input)
    await user.keyboard('{Backspace}') // removes the last tag (Ansible)
    expect(
      within(skills()!)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['RabbitMQ'])
  })

  it('offers to add an unknown search term as a custom skill', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/technologies')
    await user.type(screen.getByRole('searchbox', { name: 'Search technologies' }), 'Fortran')
    expect(screen.getByText('No technologies match “Fortran”.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add “Fortran” as a custom skill' }))
    expect(within(skills()!).getByText('Fortran')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Popular Technologies' })).toBeInTheDocument()
  })

  it('requires a technology or custom skill before continuing', async () => {
    const user = userEvent.setup()
    useAssessmentDraft.setState((state) => ({
      draft: { ...state.draft, technologies: [], customSkills: [] },
    }))
    const { router } = renderRoute('/assessments/create/technologies')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Select at least one technology')
    await user.click(tile('Git'))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(router.state.location.pathname).toBe('/assessments/create/company-level')
  })
})

describe('Company & Candidate Level step', () => {
  it('selects levels as radio groups and updates the preview', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/company-level')
    const company = screen.getByRole('group', { name: 'Company Level' })
    const candidate = screen.getByRole('group', { name: 'Candidate Level' })
    expect(within(company).getByRole('radio', { name: /Enterprise/ })).toBeChecked()
    expect(within(candidate).getByRole('radio', { name: /Senior/ })).toBeChecked()
    expect(screen.getByText('Microservices architecture')).toBeInTheDocument()
    expect(screen.getByText('High complexity')).toBeInTheDocument()

    await user.click(within(company).getByRole('radio', { name: /Startup/ }))
    await user.click(within(candidate).getByRole('radio', { name: /Junior/ }))
    expect(within(company).getByRole('radio', { name: /Enterprise/ })).not.toBeChecked()
    expect(screen.getByText('Simple layered architecture')).toBeInTheDocument()
    expect(screen.getByText('Low complexity')).toBeInTheDocument()
    expect(useAssessmentDraft.getState().draft).toMatchObject({
      companyLevel: 'startup',
      candidateLevel: 'junior',
    })
  })

  it('requires both levels before continuing', async () => {
    const user = userEvent.setup()
    useAssessmentDraft.setState((state) => ({
      draft: { ...state.draft, companyLevel: null, candidateLevel: null },
    }))
    const { router } = renderRoute('/assessments/create/company-level')
    expect(
      screen.getByText(/Select a company level and a candidate level to preview/),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Select a company level and a candidate level to continue.',
    )
    await user.click(screen.getByRole('radio', { name: /Mid-Size/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('Select a candidate level to continue.')
    await user.click(screen.getByRole('radio', { name: /Lead/ }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(router.state.location.pathname).toBe('/assessments/create/review')
  })
})
