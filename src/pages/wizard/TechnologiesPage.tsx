import { useId, useState } from 'react'
import { Cpu, Plus, Search } from 'lucide-react'
import { Button, FormField, Input, TagInput, type TagAddResult } from '@/components/ui'
import { StepCard } from '@/features/wizard/components/StepCard'
import { StepError } from '@/features/wizard/components/StepError'
import { WizardFooter } from '@/features/wizard/components/WizardFooter'
import { useAssessmentDraft } from '@/features/wizard/store'
import { TechnologyTile } from '@/features/wizard/technologies/TechnologyTile'
import { stepComplete } from '@/features/wizard/validation'
import { technologyService } from '@/services/technologyService'

export function TechnologiesPage() {
  const selectedIds = useAssessmentDraft((state) => state.draft.technologies)
  const customSkills = useAssessmentDraft((state) => state.draft.customSkills)
  const complete = useAssessmentDraft((state) => stepComplete.technologies(state.draft))
  const actions = useAssessmentDraft.getState()
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const headingId = useId()

  const searching = query.trim().length > 0
  // Default view: popular grid plus any selected non-popular picks, so selections never hide.
  const visible = searching
    ? technologyService.search(query)
    : [
        ...technologyService.getPopular(),
        ...technologyService.getByIds(selectedIds).filter((tech) => !tech.popular),
      ]

  const addCustomSkill = (value: string): TagAddResult => {
    const known = technologyService.findByName(value)
    if (known) {
      actions.selectTechnology(known.id)
      return {
        clear: true,
        message: `${known.name} is in the catalog, so it was selected instead.`,
      }
    }
    if (actions.addCustomSkill(value)) return { clear: true }
    return { clear: false, message: `“${value}” is already added.`, tone: 'error' }
  }

  return (
    <StepCard
      icon={<Cpu strokeWidth={1.75} />}
      title="Technology Stack"
      description="Pick the technologies and skills the generated project should use"
      footer={
        <WizardFooter
          onNext={() => {
            setSubmitted(true)
            return complete
          }}
        />
      }
    >
      <Input
        type="search"
        aria-label="Search technologies"
        placeholder="Search technologies, frameworks, tools..."
        leadingIcon={<Search />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="[&::-webkit-search-cancel-button]:cursor-pointer"
      />

      <div className="mt-6 mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={headingId} className="text-sm font-semibold text-ink">
          {searching ? `Results for “${query.trim()}”` : 'Popular Technologies'}
        </h3>
        <p className="text-xs text-ink-muted" aria-live="polite">
          {selectedIds.length} selected
        </p>
      </div>

      {visible.length > 0 ? (
        <div
          role="group"
          aria-labelledby={headingId}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visible.map((tech) => (
            <TechnologyTile
              key={tech.id}
              tech={tech}
              selected={selectedIds.includes(tech.id)}
              onToggle={() => actions.toggleTechnology(tech.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-tile border border-dashed border-line-strong px-6 py-8 text-center">
          <p className="text-[13px] text-ink-muted">No technologies match “{query.trim()}”.</p>
          <Button
            variant="soft"
            size="sm"
            leftIcon={<Plus />}
            onClick={() => {
              const result = addCustomSkill(query.trim())
              if (result.clear) setQuery('')
            }}
          >
            Add “{query.trim()}” as a custom skill
          </Button>
        </div>
      )}

      <FormField label="Custom Skills" htmlFor="custom-skills" className="mt-7">
        <TagInput
          id="custom-skills"
          tags={customSkills}
          listLabel="Custom skills"
          placeholder="Enter custom skill and press Enter"
          onAdd={addCustomSkill}
          onRemove={actions.removeCustomSkill}
        />
      </FormField>

      {submitted && !complete && (
        <StepError message="Select at least one technology or add a custom skill to continue." />
      )}
    </StepCard>
  )
}
