import type { AssessmentDraft, BasicInfo, WizardStepId } from '@/types'

export const LIMITS = {
  titleMin: 3,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 500,
} as const

export type BasicInfoErrors = Partial<Record<keyof BasicInfo, string>>

export function validateBasicInfo(info: BasicInfo): BasicInfoErrors {
  const errors: BasicInfoErrors = {}
  const title = info.title.trim()
  const description = info.description.trim()

  if (!title) errors.title = 'Assessment title is required.'
  else if (title.length < LIMITS.titleMin)
    errors.title = `Use at least ${LIMITS.titleMin} characters.`
  else if (title.length > LIMITS.titleMax)
    errors.title = `Keep it under ${LIMITS.titleMax} characters.`

  if (!description) errors.description = 'Description is required.'
  else if (description.length < LIMITS.descriptionMin)
    errors.description = `Add a bit more detail (at least ${LIMITS.descriptionMin} characters).`
  else if (description.length > LIMITS.descriptionMax)
    errors.description = `Keep it under ${LIMITS.descriptionMax} characters.`

  if (!info.targetRole) errors.targetRole = 'Select a target role.'
  if (!info.projectType) errors.projectType = 'Select a project type.'

  return errors
}

const hasItems = (sections: AssessmentDraft['responsibilities']) =>
  sections.some((section) => section.items.some((item) => item.text.trim()))

/** Whether each step holds enough data to move past it. */
export const stepComplete = {
  'basic-info': (draft: AssessmentDraft) =>
    Object.keys(validateBasicInfo(draft.basicInfo)).length === 0,
  responsibilities: (draft: AssessmentDraft) => hasItems(draft.responsibilities),
  competencies: (draft: AssessmentDraft) => hasItems(draft.competencies),
  technologies: (draft: AssessmentDraft) =>
    draft.technologies.length + draft.customSkills.length > 0,
  'company-level': (draft: AssessmentDraft) =>
    draft.companyLevel !== null && draft.candidateLevel !== null,
  review: () => false,
} satisfies Record<WizardStepId, (draft: AssessmentDraft) => boolean>
