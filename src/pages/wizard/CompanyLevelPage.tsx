import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { ComplexityPreviewPanel } from '@/features/wizard/components/ComplexityPreviewPanel'
import { LevelCardGroup } from '@/features/wizard/components/LevelCardGroup'
import { StepCard } from '@/features/wizard/components/StepCard'
import { StepError } from '@/features/wizard/components/StepError'
import { WizardFooter } from '@/features/wizard/components/WizardFooter'
import { previewComplexity } from '@/features/wizard/complexity'
import { candidateLevels, companyLevels } from '@/features/wizard/levels'
import { useAssessmentDraft } from '@/features/wizard/store'
import { stepComplete } from '@/features/wizard/validation'

export function CompanyLevelPage() {
  const companyLevel = useAssessmentDraft((state) => state.draft.companyLevel)
  const candidateLevel = useAssessmentDraft((state) => state.draft.candidateLevel)
  const technologies = useAssessmentDraft((state) => state.draft.technologies)
  const complete = useAssessmentDraft((state) => stepComplete['company-level'](state.draft))
  const actions = useAssessmentDraft.getState()
  const [submitted, setSubmitted] = useState(false)

  const preview = previewComplexity(companyLevel, candidateLevel, technologies)
  const missing = [!companyLevel && 'a company level', !candidateLevel && 'a candidate level']
    .filter(Boolean)
    .join(' and ')

  return (
    <StepCard
      icon={<Building2 strokeWidth={1.75} />}
      title="Context & Seniority"
      description="Tune the project's scope to the company and the candidate you're hiring"
      footer={
        <WizardFooter
          onNext={() => {
            setSubmitted(true)
            return complete
          }}
        />
      }
    >
      <div className="space-y-7">
        <LevelCardGroup
          legend="Company Level"
          name="companyLevel"
          options={companyLevels}
          value={companyLevel}
          onChange={actions.setCompanyLevel}
          className="md:grid-cols-3"
        />
        <LevelCardGroup
          legend="Candidate Level"
          name="candidateLevel"
          options={candidateLevels}
          value={candidateLevel}
          onChange={actions.setCandidateLevel}
          className="sm:grid-cols-2 xl:grid-cols-4"
        />
        <ComplexityPreviewPanel preview={preview} />
      </div>

      {submitted && !complete && <StepError message={`Select ${missing} to continue.`} />}
    </StepCard>
  )
}
