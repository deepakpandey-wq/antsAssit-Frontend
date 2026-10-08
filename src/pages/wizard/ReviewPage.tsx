import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, ClipboardCheck, RotateCcw, Sparkles } from 'lucide-react'
import { Button, CtaPanel, Modal } from '@/components/ui'
import { useGeneration } from '@/features/projects/generationStore'
import { StepCard } from '@/features/wizard/components/StepCard'
import { WizardFooter } from '@/features/wizard/components/WizardFooter'
import { AssessmentDetails } from '@/features/wizard/review/AssessmentDetails'
import { SelectedTechnologies } from '@/features/wizard/review/SelectedTechnologies'
import { SummaryTiles } from '@/features/wizard/review/SummaryTiles'
import { wizardSteps } from '@/features/wizard/steps'
import { useAssessmentDraft } from '@/features/wizard/store'

export function ReviewPage() {
  const navigate = useNavigate()
  const draft = useAssessmentDraft((state) => state.draft)
  const resetDraft = useAssessmentDraft((state) => state.resetDraft)
  const startGeneration = useGeneration((state) => state.start)
  const [confirmReset, setConfirmReset] = useState(false)

  const generate = () => {
    startGeneration(draft)
    navigate('/projects/generating')
  }

  return (
    <StepCard
      icon={<ClipboardCheck strokeWidth={1.75} />}
      title="Final Review"
      description="Check the configuration, then generate the interview project"
      footer={
        <WizardFooter
          leading={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw />}
              onClick={() => setConfirmReset(true)}
            >
              Start over
            </Button>
          }
        />
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <AssessmentDetails info={draft.basicInfo} />
          <SelectedTechnologies
            technologyIds={draft.technologies}
            customSkills={draft.customSkills}
          />
        </div>
        <div className="flex flex-col gap-4">
          <SummaryTiles draft={draft} />
          <CtaPanel
            className="h-auto"
            icon={<Sparkles strokeWidth={1.75} />}
            title="Generate Project"
            description="This will create a customized interview project with source code, test cases and documentation."
            action={
              <Button variant="dark" size="lg" rightIcon={<ArrowRight />} onClick={generate}>
                Generate Project
              </Button>
            }
          />
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        size="sm"
        title="Start over?"
        description="This clears every step of the current assessment. This can’t be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                resetDraft('blank')
                setConfirmReset(false)
                navigate(wizardSteps[0].path)
              }}
            >
              Clear and start over
            </Button>
          </>
        }
      />
    </StepCard>
  )
}
