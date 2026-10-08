import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAssessmentDraft } from '@/features/wizard/store'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

beforeEach(() => sessionStorage.clear())

describe('Sidebar draft card', () => {
  it('offers to start an assessment when there is no draft', () => {
    useAssessmentDraft.setState({ draft: assessmentService.createBlankDraft() })
    renderRoute('/dashboard')
    expect(screen.getByText('No draft in progress')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start assessment' })).toHaveAttribute(
      'href',
      '/assessments/create/basic-info',
    )
  })

  it('resumes at the next incomplete step', async () => {
    const user = userEvent.setup()
    const draft = assessmentService.createSampleDraft()
    draft.technologies = []
    draft.customSkills = []
    useAssessmentDraft.setState({ draft })
    const { router } = renderRoute('/dashboard')

    expect(
      screen.getByText('Java Backend Developer Assessment', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(screen.getByText('4 of 5 steps · Next: Technologies')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Draft completion' })).toHaveAttribute(
      'aria-valuenow',
      '4',
    )
    await user.click(screen.getByRole('link', { name: 'Continue' }))
    expect(router.state.location.pathname).toBe('/assessments/create/technologies')
  })

  it('points to Review when every step is complete', () => {
    useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
    renderRoute('/dashboard')
    expect(screen.getByText('Ready to generate')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Review & generate' })).toHaveAttribute(
      'href',
      '/assessments/create/review',
    )
  })
})
