import type { AssessmentDraft } from '@/types'
import { blankDraft, sampleDraft } from './mock/draft'

/** Deep copy so callers can never mutate the seed objects. */
const clone = (draft: AssessmentDraft): AssessmentDraft => structuredClone(draft)

export const assessmentService = {
  /** Draft a new assessment starts from (the reference example in Phase 1). */
  createSampleDraft(): AssessmentDraft {
    return clone(sampleDraft)
  },
  createBlankDraft(): AssessmentDraft {
    return clone(blankDraft)
  },
}
