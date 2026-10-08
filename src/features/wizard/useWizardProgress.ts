import { useLocation } from 'react-router'
import { useAssessmentDraft } from './store'
import { wizardSteps } from './steps'
import { stepComplete } from './validation'

/** Where the user is in the wizard, and which steps are complete/reachable. */
export function useWizardProgress() {
  const { pathname } = useLocation()
  const draft = useAssessmentDraft((state) => state.draft)

  const found = wizardSteps.findIndex((step) => pathname.startsWith(step.path))
  const currentIndex = Math.max(0, found)
  const completed = wizardSteps.map((step) => stepComplete[step.id](draft))
  const firstIncomplete = completed.findIndex((done) => !done)
  /** A step is reachable when every step before it is complete. */
  const lastReachable = firstIncomplete === -1 ? wizardSteps.length - 1 : firstIncomplete

  return {
    steps: wizardSteps,
    currentIndex,
    current: wizardSteps[currentIndex],
    previous: wizardSteps[currentIndex - 1],
    next: wizardSteps[currentIndex + 1],
    completed,
    lastReachable,
  }
}
