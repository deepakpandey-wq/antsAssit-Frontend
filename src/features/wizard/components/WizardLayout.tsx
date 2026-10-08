import { Navigate, Outlet } from 'react-router'
import { PageHeader } from '@/components/layout'
import { useWizardProgress } from '../useWizardProgress'
import { AssessmentStepper } from './AssessmentStepper'

/**
 * Parent route for /assessments/create/*: page header + stepper + current step.
 * Deep links to a step whose predecessors are incomplete redirect to the first
 * incomplete step, so the wizard can never be entered in an invalid state.
 */
export function WizardLayout() {
  const { steps, current, currentIndex, lastReachable } = useWizardProgress()

  if (currentIndex > lastReachable) {
    return <Navigate to={steps[lastReachable].path} replace />
  }

  return (
    <>
      <PageHeader
        title={current.pageTitle}
        description={current.pageDescription}
        documentTitle={`${current.label} · Create Assessment`}
      />
      <div className="space-y-5">
        <AssessmentStepper />
        <Outlet />
      </div>
    </>
  )
}
