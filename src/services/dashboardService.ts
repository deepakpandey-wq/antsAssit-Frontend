import type { AssessmentSummary, DashboardStat, StatRange } from '@/types'
import { dashboardStats, recentAssessments } from './mock/fixtures'

/**
 * Phase 1: synchronous mock data. Phase 2 swaps these bodies for API calls
 * without changing the call sites' data shapes.
 */
export const dashboardService = {
  getStats(range: StatRange): DashboardStat[] {
    return dashboardStats[range]
  },
  getRecentAssessments(): AssessmentSummary[] {
    return recentAssessments.map((assessment) => ({ ...assessment }))
  },
}
