import { render, screen } from '@testing-library/react'
import { Markdown } from './Markdown'

describe('Markdown', () => {
  it('renders the supported subset as elements, shifting headings down a level', () => {
    const { container } = render(
      <Markdown
        source={[
          '# Title',
          'Intro **bold** and `code`.',
          '## Section',
          '- one',
          '- two',
          '```bash',
          'npm test',
          '```',
        ].join('\n')}
      />,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument()
    expect(screen.getByText('bold').tagName).toBe('STRONG')
    expect(screen.getByText('code').tagName).toBe('CODE')
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['one', 'two'])
    expect(container.querySelector('pre')).toHaveTextContent('npm test')
  })

  it('never injects HTML', () => {
    const { container } = render(<Markdown source={'<img src=x onerror=alert(1)>'} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>')
  })
})
