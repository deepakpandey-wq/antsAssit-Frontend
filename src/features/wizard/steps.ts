import type { WizardStepId } from '@/types'

export interface WizardStep {
  id: WizardStepId
  /** Short label used in the stepper. */
  label: string
  path: string
  /** Page header copy (matches the reference per step). */
  pageTitle: string
  pageDescription: string
}

const CREATE_DESCRIPTION =
  'Define job requirements, competencies and technologies to generate a customized interview project.'

export const WIZARD_BASE = '/assessments/create'

export const wizardSteps: WizardStep[] = [
  {
    id: 'basic-info',
    label: 'Basic Info',
    path: `${WIZARD_BASE}/basic-info`,
    pageTitle: 'Create Assessment',
    pageDescription: CREATE_DESCRIPTION,
  },
  {
    id: 'responsibilities',
    label: 'Job Responsibilities',
    path: `${WIZARD_BASE}/responsibilities`,
    pageTitle: 'Create Assessment',
    pageDescription: CREATE_DESCRIPTION,
  },
  {
    id: 'competencies',
    label: 'Competencies',
    path: `${WIZARD_BASE}/competencies`,
    pageTitle: 'Competencies',
    pageDescription: 'Add required competencies for this assessment (Supports multiple sections)',
  },
  {
    id: 'technologies',
    label: 'Technologies',
    path: `${WIZARD_BASE}/technologies`,
    pageTitle: 'Technologies / Skills',
    pageDescription: 'Select technologies and skills required for this assessment',
  },
  {
    id: 'company-level',
    label: 'Company & Level',
    path: `${WIZARD_BASE}/company-level`,
    pageTitle: 'Company & Candidate Level',
    pageDescription: 'Select company context and candidate level to customize project complexity',
  },
  {
    id: 'review',
    label: 'Review & Generate',
    path: `${WIZARD_BASE}/review`,
    pageTitle: 'Review & Generate',
    pageDescription: 'Review your assessment configuration and generate the project',
  },
]

export const stepIndex = (id: WizardStepId) => wizardSteps.findIndex((step) => step.id === id)
