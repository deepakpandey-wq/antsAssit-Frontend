/** Wording for one use of the list editor (responsibilities vs competencies). */
export interface ListEditorCopy {
  singular: string
  plural: string
  /** Label for the bottom "+ Add Another …" action. */
  addAnother: string
  placeholder: string
}

export const pluralize = (count: number, copy: Pick<ListEditorCopy, 'singular' | 'plural'>) =>
  `${count} ${count === 1 ? copy.singular : copy.plural}`
