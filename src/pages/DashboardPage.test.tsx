import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from '@/test/renderRoute'

const tableRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1)

describe('DashboardPage', () => {
  it('renders the shell, stats, CTA and recent assessments', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { level: 1, name: /Admin!/ })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('combobox', { name: /Search/ })).toBeInTheDocument()
    expect(screen.getByText('Total Assessments')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Review & generate' })).toHaveAttribute(
      'href',
      '/assessments/create/review',
    )
    expect(screen.getByRole('heading', { name: 'Create a New Assessment' })).toBeInTheDocument()
    expect(tableRows()).toHaveLength(4)
  })

  it('switches the statistics range', async () => {
    const user = userEvent.setup()
    renderRoute('/dashboard')
    expect(screen.getByText('24')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Date range/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Last 90 days' }))
    expect(screen.getByText('61')).toBeInTheDocument()
    expect(screen.queryByText('24')).not.toBeInTheDocument()
  })

  it('duplicates and deletes assessments from the row menu', async () => {
    const user = userEvent.setup()
    renderRoute('/dashboard')

    await user.click(screen.getByRole('button', { name: 'Actions for Backend Developer' }))
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }))
    expect(tableRows()).toHaveLength(5)
    expect(tableRows()[0]).toHaveTextContent('Backend Developer (Copy)')
    expect(tableRows()[0]).toHaveTextContent('Draft')

    await user.click(screen.getByRole('button', { name: 'Actions for Frontend Developer' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }))
    const dialog = screen.getByRole('dialog', { name: 'Delete assessment?' })
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(tableRows()).toHaveLength(4))
    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
  })

  it('navigates to the wizard from the CTA', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/dashboard')
    const cta = screen.getByRole('region', { name: 'Create a New Assessment' })
    await user.click(within(cta).getByRole('link', { name: 'Create Assessment' }))
    expect(router.state.location.pathname).toBe('/assessments/create/basic-info')
  })
})
