import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGeneration } from '@/features/projects/generationStore'
import { useAssessmentDraft } from '@/features/wizard/store'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

const REVIEW = '/assessments/create/review'
const summaryLink = (name: RegExp) =>
  within(screen.getByRole('list', { name: 'Step summary' })).getByRole('link', { name })
const chipTexts = () =>
  within(screen.getByRole('list', { name: 'Selected technologies' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent)

beforeEach(() => {
  sessionStorage.clear()
  useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
  useGeneration.setState({ job: null })
})

describe('Review & Generate step', () => {
  it('summarises every step of the draft', () => {
    renderRoute(REVIEW)
    expect(screen.getByRole('heading', { level: 1, name: 'Review & Generate' })).toBeInTheDocument()
    expect(
      screen
        .getByRole('navigation', { name: 'Assessment steps' })
        .querySelector('[aria-current="step"]'),
    ).toHaveTextContent('Review & Generate')

    const main = within(screen.getByRole('main'))
    expect(main.getByText('Java Backend Developer Assessment')).toBeInTheDocument()
    expect(screen.getByText('Java Backend Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Service')).toBeInTheDocument()

    expect(summaryLink(/Job Responsibilities/)).toHaveTextContent('22 items7 sections')
    expect(summaryLink(/^Competencies/)).toHaveTextContent('21 items7 sections')
    expect(summaryLink(/^Technologies/)).toHaveTextContent('6 items2 custom')
    expect(summaryLink(/Company Level/)).toHaveTextContent('Enterprise')
    expect(summaryLink(/Candidate Level/)).toHaveTextContent('Senior')

    expect(chipTexts()).toEqual([
      'Java',
      'Spring Boot',
      'Kafka',
      'PostgreSQL',
      'Elasticsearch',
      'RabbitMQ',
    ])
  })

  it('collapses long technology lists behind “+ N more”', async () => {
    const user = userEvent.setup()
    useAssessmentDraft.setState((state) => ({
      draft: {
        ...state.draft,
        technologies: [...state.draft.technologies, 'docker', 'maven', 'redis', 'git'],
      },
    }))
    renderRoute(REVIEW)
    expect(chipTexts()).toHaveLength(8) // 7 chips + the toggle
    await user.click(screen.getByRole('button', { name: '+ 3 more' }))
    expect(chipTexts()).toHaveLength(11)
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it.each([
    [/Edit assessment details/, '/assessments/create/basic-info'],
    [/Edit technologies/, '/assessments/create/technologies'],
    [/^Competencies/, '/assessments/create/competencies'],
    [/Candidate Level/, '/assessments/create/company-level'],
  ])('edit control %s jumps to its step', async (name, path) => {
    const user = userEvent.setup()
    const { router } = renderRoute(REVIEW)
    const summary = screen.getByRole('list', { name: 'Step summary' })
    const link = within(summary).queryByRole('link', { name }) ?? screen.getByRole('link', { name })
    await user.click(link)
    expect(router.state.location.pathname).toBe(path)
  })

  it('starts a generation job with a snapshot of the draft', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute(REVIEW)
    await user.click(screen.getByRole('button', { name: 'Generate Project' }))

    expect(router.state.location.pathname).toBe('/projects/generating')
    const job = useGeneration.getState().job!
    expect(job.status).toBe('running')
    expect(job.projectId).toMatch(/^PROJ-\d{4}$/)
    expect(job.assessment).toEqual(useAssessmentDraft.getState().draft)

    // Later edits to the draft must not change the job's snapshot.
    useAssessmentDraft.getState().updateBasicInfo({ title: 'Changed later' })
    expect(useGeneration.getState().job!.assessment.basicInfo.title).toBe(
      'Java Backend Developer Assessment',
    )
  })

  it('starts over only after confirmation', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute(REVIEW)
    await user.click(screen.getByRole('button', { name: 'Start over' }))
    await user.click(screen.getByRole('button', { name: 'Keep editing' }))
    expect(useAssessmentDraft.getState().draft.basicInfo.title).not.toBe('')

    await user.click(screen.getByRole('button', { name: 'Start over' }))
    await user.click(screen.getByRole('button', { name: 'Clear and start over' }))
    expect(router.state.location.pathname).toBe('/assessments/create/basic-info')
    expect(screen.getByRole('textbox', { name: /Assessment Title/ })).toHaveValue('')
    expect(useAssessmentDraft.getState().draft).toEqual(assessmentService.createBlankDraft())
  })
})
