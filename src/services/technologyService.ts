import type { Technology } from '@/types'
import { technologyCatalog } from './mock/technologies'

const normalize = (value: string) => value.trim().toLowerCase()

export const technologyService = {
  getPopular(): Technology[] {
    return technologyCatalog.filter((tech) => tech.popular)
  },
  /** Case-insensitive substring match on name; popular entries rank first. */
  search(query: string): Technology[] {
    const needle = normalize(query)
    if (!needle) return this.getPopular()
    return technologyCatalog
      .filter((tech) => normalize(tech.name).includes(needle))
      .sort((a, b) => Number(b.popular) - Number(a.popular))
  },
  /** Exact (case-insensitive) name match — used to catch custom skills that already exist. */
  findByName(name: string): Technology | undefined {
    const needle = normalize(name)
    return technologyCatalog.find((tech) => normalize(tech.name) === needle)
  },
  getByIds(ids: string[]): Technology[] {
    return ids
      .map((id) => technologyCatalog.find((tech) => tech.id === id))
      .filter((tech): tech is Technology => tech !== undefined)
  },
}
