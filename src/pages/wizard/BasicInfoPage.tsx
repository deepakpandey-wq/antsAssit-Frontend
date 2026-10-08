import { useRef, useState } from 'react'
import { BriefcaseBusiness, ClipboardPen } from 'lucide-react'
import { FormField, IconTile, Input, Select, Textarea } from '@/components/ui'
import { StepCard } from '@/features/wizard/components/StepCard'
import { WizardFooter } from '@/features/wizard/components/WizardFooter'
import { findOption, projectTypes, targetRoles } from '@/features/wizard/options'
import { useAssessmentDraft } from '@/features/wizard/store'
import { LIMITS, validateBasicInfo } from '@/features/wizard/validation'
import type { BasicInfo } from '@/types'

type Field = keyof BasicInfo
const FIELD_ORDER: Field[] = ['title', 'description', 'targetRole', 'projectType']

const toSelectOptions = (options: typeof targetRoles) =>
  options.map(({ value, label }) => ({ value, label }))

export function BasicInfoPage() {
  const info = useAssessmentDraft((state) => state.draft.basicInfo)
  const update = useAssessmentDraft((state) => state.updateBasicInfo)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const errors = validateBasicInfo(info)
  const errorFor = (field: Field) => (submitted || touched[field] ? errors[field] : undefined)
  const touch = (field: Field) => () => setTouched((state) => ({ ...state, [field]: true }))

  /** Shared a11y wiring for each control. */
  const controlProps = (field: Field) => ({
    id: `basic-${field}`,
    name: field,
    onBlur: touch(field),
    'aria-invalid': errorFor(field) ? true : undefined,
    'aria-describedby': errorFor(field) ? `basic-${field}-message` : undefined,
  })

  const validateAndContinue = () => {
    setSubmitted(true)
    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (!firstInvalid) return true
    formRef.current?.querySelector<HTMLElement>(`#basic-${firstInvalid}`)?.focus()
    return false
  }

  const role = findOption(targetRoles, info.targetRole)
  const projectType = findOption(projectTypes, info.projectType)
  const RoleIcon = role?.icon ?? BriefcaseBusiness
  const ProjectIcon = projectType?.icon ?? BriefcaseBusiness

  return (
    <StepCard
      icon={<ClipboardPen strokeWidth={1.75} />}
      title="Basic Information"
      description="Enter basic details for the assessment"
      footer={<WizardFooter onNext={validateAndContinue} />}
    >
      <form
        ref={formRef}
        noValidate
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormField
          label="Assessment Title"
          htmlFor="basic-title"
          required
          error={errorFor('title')}
          counter={{ current: info.title.length, max: LIMITS.titleMax }}
        >
          <Input
            {...controlProps('title')}
            value={info.title}
            maxLength={LIMITS.titleMax}
            placeholder="e.g. Java Backend Developer Assessment"
            autoComplete="off"
            onChange={(event) => update({ title: event.target.value })}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="basic-description"
          required
          error={errorFor('description')}
          counter={{ current: info.description.length, max: LIMITS.descriptionMax }}
        >
          <Textarea
            {...controlProps('description')}
            value={info.description}
            maxLength={LIMITS.descriptionMax}
            rows={3}
            placeholder="What should this assessment evaluate?"
            onChange={(event) => update({ description: event.target.value })}
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Target Role"
            htmlFor="basic-targetRole"
            required
            error={errorFor('targetRole')}
          >
            <Select
              {...controlProps('targetRole')}
              value={info.targetRole}
              placeholder="Select a role"
              options={toSelectOptions(targetRoles)}
              leadingIcon={
                <IconTile tone="purple" size="xs">
                  <RoleIcon strokeWidth={1.75} />
                </IconTile>
              }
              onChange={(event) => update({ targetRole: event.target.value })}
            />
          </FormField>

          <FormField
            label="Project Type"
            htmlFor="basic-projectType"
            required
            error={errorFor('projectType')}
          >
            <Select
              {...controlProps('projectType')}
              value={info.projectType}
              placeholder="Select a project type"
              options={toSelectOptions(projectTypes)}
              leadingIcon={
                <IconTile tone="success" size="xs">
                  <ProjectIcon strokeWidth={1.75} />
                </IconTile>
              }
              onChange={(event) => update({ projectType: event.target.value })}
            />
          </FormField>
        </div>
      </form>
    </StepCard>
  )
}
