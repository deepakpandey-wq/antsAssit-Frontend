import { act, fireEvent, screen, within } from '@testing-library/react'
import { buildGenerationPlan, planDuration } from '@/features/projects/generationPlan'
import { useGeneration } from '@/features/projects/generationStore'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

const PATH = '/projects/generating'
const TOTAL = planDuration(buildGenerationPlan(assessmentService.createSampleDraft(), 'X'))
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))
const stageStates = () =>
  within(screen.getByRole('list', { name: 'Generation stages' }))
    .getAllByRole('listitem')
    .map((li) => li.textContent?.split('— ')[1])

beforeEach(() => {
  vi.useFakeTimers()
  sessionStorage.clear()
  useGeneration.setState({ job: null })
})
afterEach(() => vi.useRealTimers())

describe('Project Generation Progress', () => {
  it('explains when there is nothing to generate', () => {
    renderRoute(PATH)
    expect(screen.getByText('No project is being generated')).toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).getByRole('link', { name: 'Create Assessment' }),
    ).toHaveAttribute('href', '/assessments/create/basic-info')
  })

  it('advances through the stages, then opens the generated project', () => {
    const job = useGeneration.getState().start(assessmentService.createSampleDraft())
    const { router } = renderRoute(PATH)

    expect(screen.getByRole('link', { name: 'Generated Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(stageStates()).toEqual(['in progress', ...Array(6).fill('pending')])
    expect(screen.getByRole('progressbar', { name: 'Generation progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )

    advance(3200) // into stage 3
    expect(stageStates().slice(0, 3)).toEqual(['completed', 'completed', 'in progress'])
    expect(screen.getByText(/^Stage 3 of 7/)).toHaveTextContent(
      /^Stage 3 of 7 · Customizing project structure · about \d+ seconds remaining$/,
    )
    expect(
      within(screen.getByRole('log')).getByText(/Selected Spring Boot boilerplate/),
    ).toBeVisible()

    advance(TOTAL)
    expect(screen.getByRole('heading', { name: 'Project ready' })).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(useGeneration.getState().job?.status).toBe('completed')
    expect(within(screen.getByRole('log')).getByText(`${job.projectId} is ready`)).toBeVisible()

    advance(1000)
    expect(router.state.location.pathname).toBe(`/projects/${job.projectId}`)
  })

  it('resumes from the job’s start time after a reload', () => {
    useGeneration.getState().start(assessmentService.createSampleDraft())
    useGeneration.setState((state) => ({
      job: { ...state.job!, startedAt: new Date(Date.now() - 6000).toISOString() },
    }))
    renderRoute(PATH)
    const value = Number(
      screen
        .getByRole('progressbar', { name: 'Generation progress' })
        .getAttribute('aria-valuenow'),
    )
    expect(value).toBe(Math.floor((6000 / TOTAL) * 100))
  })

  // fireEvent (synchronous) instead of userEvent: userEvent's internal delays stall under fake timers.
  it('cancels after confirmation and can restart', () => {
    useGeneration.getState().start(assessmentService.createSampleDraft())
    renderRoute(PATH)
    advance(2000)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Keep generating' }))
    expect(useGeneration.getState().job?.status).toBe('running')

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel generation' }))
    expect(screen.getByText('Generation cancelled')).toBeInTheDocument()
    expect(useGeneration.getState().job?.status).toBe('cancelled')
    expect(screen.getByRole('link', { name: 'Back to review' })).toHaveAttribute(
      'href',
      '/assessments/create/review',
    )

    const cancelledId = useGeneration.getState().job!.id
    fireEvent.click(screen.getByRole('button', { name: 'Restart generation' }))
    expect(useGeneration.getState().job).toMatchObject({ status: 'running' })
    expect(useGeneration.getState().job!.id).not.toBe(cancelledId)
    expect(stageStates()[0]).toBe('in progress')
  })
})
