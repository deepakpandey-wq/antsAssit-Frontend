import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAssessmentDraft } from '@/features/wizard/store'
import { assessmentService } from '@/services/assessmentService'
import { renderRoute } from '@/test/renderRoute'

const list = (name: RegExp) => screen.getByRole('list', { name })
const rows = (name: RegExp) => within(list(name)).getAllByRole('listitem')

beforeEach(() => {
  sessionStorage.clear()
  useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
})

describe('Job Responsibilities step', () => {
  it('shows sections with counts and the selected section’s items', () => {
    renderRoute('/assessments/create/responsibilities')
    expect(screen.getByRole('heading', { name: 'Job Responsibilities' })).toBeInTheDocument()
    const sections = screen.getByRole('list', { name: 'Sections' })
    expect(within(sections).getByRole('button', { name: /Core Java\s*6/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByText('All Sections').nextElementSibling).toHaveTextContent('22')
    expect(screen.getByText('6 responsibilities')).toBeInTheDocument()
    expect(rows(/Core Java responsibilities/)).toHaveLength(6)
  })

  it('adds several items in a row, then closes with Escape', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/responsibilities')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const input = screen.getByRole('textbox', { name: 'New responsibility' })
    expect(input).toHaveFocus()
    await user.type(input, 'Profile and tune JVM performance{Enter}')
    await user.type(input, 'Review pull requests{Enter}')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('textbox', { name: 'New responsibility' })).not.toBeInTheDocument()
    expect(screen.getByText('8 responsibilities')).toBeInTheDocument()
    const last = rows(/Core Java responsibilities/).slice(-2)
    expect(last[0]).toHaveTextContent('Profile and tune JVM performance')
    expect(last[1]).toHaveTextContent('Review pull requests')
  })

  it('edits inline (Enter saves, Escape reverts)', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/responsibilities')
    await user.click(screen.getByRole('button', { name: /^Edit responsibility 2:/ }))
    const input = screen.getByRole('textbox', { name: 'Edit responsibility 2' })
    await user.clear(input)
    await user.type(input, 'Use Streams effectively{Enter}')
    expect(rows(/Core Java responsibilities/)[1]).toHaveTextContent('Use Streams effectively')

    await user.click(screen.getByRole('button', { name: /^Edit responsibility 1:/ }))
    await user.type(screen.getByRole('textbox', { name: 'Edit responsibility 1' }), ' CHANGED')
    await user.keyboard('{Escape}')
    expect(rows(/Core Java responsibilities/)[0]).not.toHaveTextContent('CHANGED')
  })

  it('deletes an item and restores it with Undo', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/responsibilities')
    const target = 'Handle exceptions and error scenarios'
    await user.click(screen.getByRole('button', { name: `Delete responsibility 4: ${target}` }))
    expect(rows(/Core Java responsibilities/)).toHaveLength(5)
    expect(screen.getByText(`Deleted “${target}”`)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(rows(/Core Java responsibilities/)[3]).toHaveTextContent(target)
  })

  it('switches sections and creates a new one', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/responsibilities')
    await user.click(screen.getByRole('button', { name: /Spring Boot\s*4/ }))
    expect(rows(/Spring Boot responsibilities/)).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'New section' }))
    await user.type(screen.getByRole('textbox', { name: 'New section name' }), 'Cloud{Enter}')
    expect(screen.getByRole('heading', { name: 'Cloud' })).toBeInTheDocument()
    expect(screen.getByText('No responsibilities in this section yet.')).toBeInTheDocument()
  })

  it('requires at least one responsibility before continuing', async () => {
    const user = userEvent.setup()
    useAssessmentDraft.setState((state) => ({ draft: { ...state.draft, responsibilities: [] } }))
    const { router } = renderRoute('/assessments/create/responsibilities')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Add at least one responsibility')
    expect(router.state.location.pathname).toBe('/assessments/create/responsibilities')

    await user.click(screen.getByRole('button', { name: 'Create “General” section' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(
      screen.getByRole('textbox', { name: 'New responsibility' }),
      'Own the service end to end{Enter}',
    )
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(router.state.location.pathname).toBe('/assessments/create/competencies')
  })
})

describe('Competencies step', () => {
  it('reuses the editor with numbered rows and its own data', async () => {
    const user = userEvent.setup()
    renderRoute('/assessments/create/competencies')
    const items = rows(/Core Java competencies/)
    expect(items).toHaveLength(6)
    expect(items[0]).toHaveTextContent(/^1\s*Java Fundamentals/)
    expect(screen.getByText('6 competencies')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Security\s*2/ }))
    expect(rows(/Security competencies/)[1]).toHaveTextContent(/2\s*Authorization/)
  })
})
