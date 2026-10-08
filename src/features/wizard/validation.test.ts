import { assessmentService } from '@/services/assessmentService'
import { stepComplete, validateBasicInfo } from './validation'

const valid = assessmentService.createSampleDraft().basicInfo

describe('validateBasicInfo', () => {
  it('accepts the sample assessment', () => {
    expect(validateBasicInfo(valid)).toEqual({})
  })

  it('requires every field', () => {
    const errors = validateBasicInfo({
      title: ' ',
      description: '',
      targetRole: '',
      projectType: '',
    })
    expect(Object.keys(errors).sort()).toEqual([
      'description',
      'projectType',
      'targetRole',
      'title',
    ])
  })

  it('enforces minimum lengths on trimmed text', () => {
    expect(validateBasicInfo({ ...valid, title: '  ab  ' }).title).toMatch(/at least 3/)
    expect(validateBasicInfo({ ...valid, description: 'too short' }).description).toMatch(
      /at least 20/,
    )
  })
})

describe('stepComplete', () => {
  it('marks every data step of the sample draft complete', () => {
    const draft = assessmentService.createSampleDraft()
    expect(stepComplete['basic-info'](draft)).toBe(true)
    expect(stepComplete.responsibilities(draft)).toBe(true)
    expect(stepComplete.competencies(draft)).toBe(true)
    expect(stepComplete.technologies(draft)).toBe(true)
    expect(stepComplete['company-level'](draft)).toBe(true)
  })

  it('marks every step of a blank draft incomplete', () => {
    const draft = assessmentService.createBlankDraft()
    expect(Object.values(stepComplete).some((isComplete) => isComplete(draft))).toBe(false)
  })

  it('ignores sections whose items are all blank', () => {
    const draft = assessmentService.createBlankDraft()
    draft.responsibilities = [
      { id: 's', name: 'S', icon: 'code', items: [{ id: 'i', text: '  ' }] },
    ]
    expect(stepComplete.responsibilities(draft)).toBe(false)
  })
})
