import { searchService } from './searchService'

describe('searchService', () => {
  it('returns nothing for a blank query', () => {
    expect(searchService.search('   ')).toEqual([])
  })

  it('matches titles and subtitles case-insensitively', () => {
    const titles = searchService.search('JAVA').map((result) => result.title)
    expect(titles).toContain('Java Backend Developer')
    expect(searchService.search('nestjs').length).toBeGreaterThan(0)
  })

  it('respects the limit', () => {
    expect(searchService.search('developer', 2)).toHaveLength(2)
  })
})
