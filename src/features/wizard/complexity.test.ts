import { previewComplexity } from './complexity'

describe('previewComplexity', () => {
  it('needs both levels', () => {
    expect(previewComplexity('enterprise', null, [])).toBeNull()
    expect(previewComplexity(null, 'senior', [])).toBeNull()
  })

  it('matches the reference for Enterprise + Senior with Kafka', () => {
    expect(previewComplexity('enterprise', 'senior', ['java', 'kafka'])).toEqual({
      tier: 'High',
      estimate: '5–8 hours',
      features: [
        'Microservices architecture',
        'Kafka integration',
        'Docker configuration',
        'Advanced error handling',
        'Comprehensive test cases',
        'Security implementation',
      ],
    })
  })

  it('keeps small projects small and de-duplicates features', () => {
    const startup = previewComplexity('startup', 'junior', [])!
    expect(startup.tier).toBe('Low')
    expect(startup.features).not.toContain('Docker configuration')
    expect(previewComplexity('startup', 'junior', ['docker'])!.features).toContain(
      'Docker configuration',
    )

    const lead = previewComplexity('enterprise', 'lead', [])!
    expect(lead.tier).toBe('Very high')
    expect(lead.features.filter((f) => f === 'Comprehensive test cases')).toHaveLength(1)
  })
})
