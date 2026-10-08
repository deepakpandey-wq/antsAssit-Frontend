import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAssessmentDraft } from '@/features/wizard/store'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

const titleInput = () => screen.getByRole('textbox', { name: /Assessment Title/ })
const stepper = () => screen.getByRole('navigation', { name: 'Assessment steps' })

beforeEach(() => {
  sessionStorage.clear()
  useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
})

describe('Basic Information step', () => {
  it('opens from /assessments/create with the shared shell, stepper and draft data', async () => {
    const { router } = renderRoute('/assessments/create')
    expect(await screen.findByRole('heading', { name: 'Basic Information' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/assessments/create/basic-info')
    expect(screen.getByRole('link', { name: 'Create Assessment' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(stepper().querySelector('[aria-current="step"]')).toHaveTextContent('Basic Info')
    expect(titleInput()).toHaveValue('Java Backend Developer Assessment')
    expect(screen.getByRole('combobox', { name: /Target Role/ })).toHaveValue('java-backend')
    expect(screen.getByRole('combobox', { name: /Project Type/ })).toHaveValue('backend-service')
    expect(screen.getByText('33/100')).toBeInTheDocument()
  })

  it('blocks Next and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/assessments/create/basic-info')
    await user.clear(titleInput())
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(router.state.location.pathname).toBe('/assessments/create/basic-info')
    expect(screen.getByRole('alert')).toHaveTextContent('Assessment title is required.')
    expect(titleInput()).toHaveAttribute('aria-invalid', 'true')
    expect(titleInput()).toHaveFocus()
  })

  it('keeps edits when moving between steps and after a remount', async () => {
    const user = userEvent.setup()
    const { router, unmount } = renderRoute('/assessments/create/basic-info')
    await user.clear(titleInput())
    await user.type(titleInput(), 'Platform Engineer Assessment')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(router.state.location.pathname).toBe('/assessments/create/responsibilities')

    // Step 1 is now shown as completed and is clickable from the stepper.
    await user.click(within(stepper()).getByRole('link', { name: /Basic Info.*completed/ }))
    expect(titleInput()).toHaveValue('Platform Engineer Assessment')

    expect(sessionStorage.getItem('interview-assessment:draft')).toContain(
      'Platform Engineer Assessment',
    )
    unmount()
    renderRoute('/assessments/create/basic-info')
    expect(titleInput()).toHaveValue('Platform Engineer Assessment')
  })

  it('redirects deep links past an incomplete step', () => {
    useAssessmentDraft.getState().resetDraft('blank')
    const { router } = renderRoute('/assessments/create/review')
    expect(router.state.location.pathname).toBe('/assessments/create/basic-info')
  })

  it('goes back to the dashboard from the first step', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/assessments/create/basic-info')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(router.state.location.pathname).toBe('/dashboard')
  })
})
