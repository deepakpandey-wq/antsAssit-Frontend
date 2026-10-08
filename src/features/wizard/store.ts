import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createId } from '@/lib/id'
import { assessmentService } from '@/services/assessmentService'
import type {
  AssessmentDraft,
  BasicInfo,
  CandidateLevel,
  CompanyLevel,
  ListItem,
  ListKey,
  ListSection,
} from '@/types'

interface DraftState {
  draft: AssessmentDraft
  updateBasicInfo: (patch: Partial<BasicInfo>) => void

  /* Sectioned lists (responsibilities, competencies) */
  addSection: (list: ListKey, name: string) => string
  renameSection: (list: ListKey, sectionId: string, name: string) => void
  removeSection: (list: ListKey, sectionId: string) => void
  addItem: (list: ListKey, sectionId: string, text: string) => string
  /** Re-insert an item at a position (used by undo). */
  insertItem: (list: ListKey, sectionId: string, item: ListItem, index: number) => void
  updateItem: (list: ListKey, sectionId: string, itemId: string, text: string) => void
  removeItem: (list: ListKey, sectionId: string, itemId: string) => void
  moveItem: (list: ListKey, sectionId: string, fromIndex: number, toIndex: number) => void

  /* Technologies & levels */
  toggleTechnology: (id: string) => void
  /** Adds a selected technology without toggling it off when already selected. */
  selectTechnology: (id: string) => void
  /** Returns false when the skill is empty or already present (case-insensitive). */
  addCustomSkill: (name: string) => boolean
  removeCustomSkill: (name: string) => void
  setCompanyLevel: (level: CompanyLevel) => void
  setCandidateLevel: (level: CandidateLevel) => void

  resetDraft: (mode?: 'sample' | 'blank') => void
}

/**
 * Single source of truth for the assessment wizard. Persisted to sessionStorage so
 * data survives moving between steps and a page refresh, but not a new tab/session.
 */
export const useAssessmentDraft = create<DraftState>()(
  persist(
    (set, get) => {
      /** Immutable update of one sectioned list. */
      const setList = (list: ListKey, update: (sections: ListSection[]) => ListSection[]) =>
        set((state) => ({ draft: { ...state.draft, [list]: update(state.draft[list]) } }))

      const setItems = (
        list: ListKey,
        sectionId: string,
        update: (items: ListItem[]) => ListItem[],
      ) =>
        setList(list, (sections) =>
          sections.map((section) =>
            section.id === sectionId ? { ...section, items: update(section.items) } : section,
          ),
        )

      return {
        draft: assessmentService.createSampleDraft(),

        updateBasicInfo: (patch) =>
          set((state) => ({
            draft: { ...state.draft, basicInfo: { ...state.draft.basicInfo, ...patch } },
          })),

        addSection: (list, name) => {
          const id = createId('section')
          setList(list, (sections) => [
            ...sections,
            { id, name: name.trim(), icon: 'list', items: [] },
          ])
          return id
        },
        renameSection: (list, sectionId, name) =>
          setList(list, (sections) =>
            sections.map((section) =>
              section.id === sectionId ? { ...section, name: name.trim() } : section,
            ),
          ),
        removeSection: (list, sectionId) =>
          setList(list, (sections) => sections.filter((section) => section.id !== sectionId)),

        addItem: (list, sectionId, text) => {
          const id = createId('item')
          setItems(list, sectionId, (items) => [...items, { id, text: text.trim() }])
          return id
        },
        insertItem: (list, sectionId, item, index) =>
          setItems(list, sectionId, (items) => {
            const next = [...items]
            next.splice(Math.min(Math.max(index, 0), next.length), 0, item)
            return next
          }),
        updateItem: (list, sectionId, itemId, text) =>
          setItems(list, sectionId, (items) =>
            items.map((item) => (item.id === itemId ? { ...item, text: text.trim() } : item)),
          ),
        removeItem: (list, sectionId, itemId) =>
          setItems(list, sectionId, (items) => items.filter((item) => item.id !== itemId)),
        moveItem: (list, sectionId, fromIndex, toIndex) =>
          setItems(list, sectionId, (items) => arrayMove(items, fromIndex, toIndex)),

        toggleTechnology: (id) =>
          set((state) => {
            const selected = state.draft.technologies
            return {
              draft: {
                ...state.draft,
                technologies: selected.includes(id)
                  ? selected.filter((entry) => entry !== id)
                  : [...selected, id],
              },
            }
          }),
        selectTechnology: (id) =>
          set((state) =>
            state.draft.technologies.includes(id)
              ? state
              : { draft: { ...state.draft, technologies: [...state.draft.technologies, id] } },
          ),
        addCustomSkill: (name) => {
          const skill = name.trim()
          const existing = get().draft.customSkills
          if (!skill || existing.some((entry) => entry.toLowerCase() === skill.toLowerCase())) {
            return false
          }
          set((state) => ({
            draft: { ...state.draft, customSkills: [...state.draft.customSkills, skill] },
          }))
          return true
        },
        removeCustomSkill: (name) =>
          set((state) => ({
            draft: {
              ...state.draft,
              customSkills: state.draft.customSkills.filter((entry) => entry !== name),
            },
          })),
        setCompanyLevel: (level) =>
          set((state) => ({ draft: { ...state.draft, companyLevel: level } })),
        setCandidateLevel: (level) =>
          set((state) => ({ draft: { ...state.draft, candidateLevel: level } })),

        resetDraft: (mode = 'blank') =>
          set({
            draft:
              mode === 'blank'
                ? assessmentService.createBlankDraft()
                : assessmentService.createSampleDraft(),
          }),
      }
    },
    {
      name: 'interview-assessment:draft',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
