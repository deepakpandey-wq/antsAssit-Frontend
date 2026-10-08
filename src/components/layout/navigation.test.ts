import { navItems } from './navigation'

const activeFor = (pathname: string) =>
  navItems.filter((item) => item.isActive(pathname)).map((item) => item.label)

describe('sidebar active state', () => {
  it.each([
    ['/dashboard', 'Dashboard'],
    ['/assessments/create/basic-info', 'Create Assessment'],
    ['/assessments/create/review', 'Create Assessment'],
    ['/assessments', 'Assessments'],
    ['/projects/generating', 'Generated Projects'],
    ['/projects/PROJ-1001', 'Generated Projects'],
    ['/settings', 'Settings'],
  ])('%s highlights exactly "%s"', (pathname, label) => {
    expect(activeFor(pathname)).toEqual([label])
  })

  it('does not treat a shared prefix as a match', () => {
    expect(activeFor('/dashboards')).toEqual([])
  })
})
