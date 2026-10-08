import { useState, type ReactNode } from 'react'
import type { ListKey } from '@/types'
import { SectionedListEditor } from '../list-editor/SectionedListEditor'
import type { ListEditorCopy } from '../list-editor/types'
import { useAssessmentDraft } from '../store'
import { stepComplete } from '../validation'
import { StepCard } from './StepCard'
import { WizardFooter } from './WizardFooter'

interface ListStepProps {
  list: ListKey
  copy: ListEditorCopy
  numbered?: boolean
  icon: ReactNode
  title: string
  description: string
}

/** A wizard step whose body is the shared sectioned list editor. */
export function ListStep({ list, copy, numbered, icon, title, description }: ListStepProps) {
  const complete = useAssessmentDraft((state) => stepComplete[list](state.draft))
  const [submitted, setSubmitted] = useState(false)

  return (
    <StepCard
      icon={icon}
      title={title}
      description={description}
      footer={
        <WizardFooter
          onNext={() => {
            setSubmitted(true)
            return complete
          }}
        />
      }
    >
      <SectionedListEditor
        list={list}
        copy={copy}
        numbered={numbered}
        error={
          submitted && !complete ? `Add at least one ${copy.singular} to continue.` : undefined
        }
      />
    </StepCard>
  )
}
