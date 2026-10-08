import { assessmentService } from '@/services/assessmentService'
import { useAssessmentDraft } from './store'

const state = () => useAssessmentDraft.getState()
const texts = (sectionIndex = 0) =>
  state().draft.responsibilities[sectionIndex].items.map((item) => item.text)

beforeEach(() => {
  sessionStorage.clear()
  useAssessmentDraft.setState({ draft: assessmentService.createSampleDraft() })
})

describe('draft store — sectioned lists', () => {
  it('adds, trims, edits and removes items in one section only', () => {
    const sectionId = state().draft.responsibilities[0].id
    const before = state().draft.competencies

    const id = state().addItem('responsibilities', sectionId, '  Write integration tests  ')
    expect(texts().at(-1)).toBe('Write integration tests')

    state().updateItem('responsibilities', sectionId, id, ' Write contract tests ')
    expect(texts().at(-1)).toBe('Write contract tests')

    state().removeItem('responsibilities', sectionId, id)
    expect(texts()).not.toContain('Write contract tests')
    expect(state().draft.competencies).toBe(before) // other list untouched
  })

  it('reorders items and re-inserts at a position (undo)', () => {
    const section = state().draft.responsibilities[0]
    const [first, second] = section.items
    state().moveItem('responsibilities', section.id, 0, 2)
    expect(texts().slice(0, 3)).toEqual([second.text, section.items[2].text, first.text])

    state().removeItem('responsibilities', section.id, second.id)
    state().insertItem('responsibilities', section.id, second, 0)
    expect(texts()[0]).toBe(second.text)
  })

  it('adds, renames and removes sections', () => {
    const id = state().addSection('competencies', '  Cloud  ')
    const added = state().draft.competencies.at(-1)!
    expect(added).toMatchObject({ id, name: 'Cloud', icon: 'list', items: [] })

    state().renameSection('competencies', id, 'Cloud & DevOps')
    expect(state().draft.competencies.at(-1)!.name).toBe('Cloud & DevOps')

    state().removeSection('competencies', id)
    expect(state().draft.competencies.some((section) => section.id === id)).toBe(false)
  })
})
