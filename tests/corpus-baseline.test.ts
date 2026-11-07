// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildBaseline, compareBaseline, formatComparison } from '../scripts/corpus-baseline.mjs'

// The corpus gate (`pnpm run corpus:check`) compares a run of scripts/corpus.mjs
// against the committed scripts/corpus-baseline.json. These tests cover the
// comparison itself: the part that must fail loudly when detection regresses.

const run = (groups: Record<string, { n: number; typeOk: number; osOk: number }>, commit = 'abc123') =>
  buildBaseline({ commit, groups: new Map(Object.entries(groups)) })

const baseline = run({
  'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
  'Android | tv': { n: 50, typeOk: 24, osOk: 50 },
  'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
})

describe('buildBaseline', () => {
  it('records the pinned corpus commit, every group and the total', () => {
    expect(baseline).toEqual({
      matomo: 'abc123',
      total: { n: 170, typeOk: 140 },
      groups: {
        'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
        'Android | tv': { n: 50, typeOk: 24, osOk: 50 },
        'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
      },
    })
  })

  it('sorts the groups so the JSON file diffs cleanly', () => {
    const out = run({ 'b | x': { n: 1, typeOk: 1, osOk: 1 }, 'a | x': { n: 1, typeOk: 1, osOk: 1 } })
    expect(Object.keys(out.groups)).toEqual(['a | x', 'b | x'])
  })
})

describe('compareBaseline', () => {
  it('passes when the run matches the baseline exactly', () => {
    const result = compareBaseline(baseline, baseline)
    expect(result).toEqual({ ok: true, corpusChanged: [], regressions: [], improvements: [] })
  })

  it('reports a drop in type accuracy for one group as a regression', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 20, osOk: 50 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
    })
    const result = compareBaseline(baseline, current)
    expect(result.ok).toBe(false)
    expect(result.regressions).toEqual([
      { key: 'Android | tv', metric: 'type', n: 50, before: 24, after: 20 },
      { key: 'total', metric: 'type', n: 170, before: 140, after: 136 },
    ])
    expect(result.improvements).toEqual([])
  })

  it('reports a drop in os accuracy as a regression', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 24, osOk: 50 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 0 },
    })
    const result = compareBaseline(baseline, current)
    expect(result.regressions).toEqual([{ key: 'Mac | desktop', metric: 'os', n: 20, before: 13, after: 0 }])
  })

  it('catches a class that regresses while the total improves', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 100, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 23, osOk: 50 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
    })
    const result = compareBaseline(baseline, current)
    expect(result.ok).toBe(false)
    expect(result.regressions).toEqual([{ key: 'Android | tv', metric: 'type', n: 50, before: 24, after: 23 }])
    expect(result.improvements).toEqual([
      { key: 'Android | smartphone', metric: 'type', n: 100, before: 96, after: 100 },
      { key: 'total', metric: 'type', n: 170, before: 140, after: 143 },
    ])
  })

  it('fails on an improvement too, so the baseline is updated to protect the gain', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 40, osOk: 50 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
    })
    const result = compareBaseline(baseline, current)
    expect(result.ok).toBe(false)
    expect(result.regressions).toEqual([])
    expect(result.improvements).toHaveLength(2)
  })

  it('treats a different pinned commit as a changed corpus, not a regression', () => {
    const current = run(
      {
        'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
        'Android | tv': { n: 50, typeOk: 24, osOk: 50 },
        'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
      },
      'def456'
    )
    const result = compareBaseline(baseline, current)
    expect(result.ok).toBe(false)
    expect(result.corpusChanged).toEqual(['the pinned Matomo commit is def456, the baseline was made from abc123'])
    expect(result.regressions).toEqual([])
  })

  it('treats a group whose size changed, appeared or disappeared as a changed corpus', () => {
    const current = run({
      'Android | smartphone': { n: 101, typeOk: 97, osOk: 100 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
      'iOS | tablet': { n: 5, typeOk: 5, osOk: 5 },
    })
    const result = compareBaseline(baseline, current)
    expect(result.ok).toBe(false)
    expect(result.corpusChanged).toEqual([
      'Android | smartphone has 101 user agents, the baseline has 100',
      'Android | tv is in the baseline but not in the corpus',
      'iOS | tablet is in the corpus but not in the baseline',
    ])
    // A group whose size changed cannot be compared for accuracy
    expect(result.regressions).toEqual([])
    expect(result.improvements).toEqual([])
  })
})

describe('formatComparison', () => {
  it('says the gate passed', () => {
    expect(formatComparison(compareBaseline(baseline, baseline), baseline)).toBe(
      'Detection matches scripts/corpus-baseline.json: 140/170 user agents typed correctly (82.4%).'
    )
  })

  it('lists regressions with counts and percentages, then how to accept them', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 20, osOk: 45 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
    })
    const text = formatComparison(compareBaseline(baseline, current), current)
    expect(text).toContain('Detection regressed against scripts/corpus-baseline.json:')
    expect(text).toContain('  Android | tv: type correct 24 -> 20 of 50 (48.0% -> 40.0%)')
    expect(text).toContain('  Android | tv: os correct 50 -> 45 of 50 (100.0% -> 90.0%)')
    expect(text).toContain('  total: type correct 140 -> 136 of 170 (82.4% -> 80.0%)')
    expect(text).toContain('pnpm run corpus:update')
  })

  it('lists improvements and asks for the baseline to be updated', () => {
    const current = run({
      'Android | smartphone': { n: 100, typeOk: 96, osOk: 99 },
      'Android | tv': { n: 50, typeOk: 40, osOk: 50 },
      'Mac | desktop': { n: 20, typeOk: 20, osOk: 13 },
    })
    const text = formatComparison(compareBaseline(baseline, current), current)
    expect(text).not.toContain('regressed')
    expect(text).toContain('Detection improved against scripts/corpus-baseline.json:')
    expect(text).toContain('  Android | tv: type correct 24 -> 40 of 50 (48.0% -> 80.0%)')
    expect(text).toContain('pnpm run corpus:update')
  })

  it('explains a changed corpus', () => {
    const current = run({ 'Android | tv': { n: 50, typeOk: 24, osOk: 50 } }, 'def456')
    const text = formatComparison(compareBaseline(baseline, current), current)
    expect(text).toContain('The corpus differs from the one scripts/corpus-baseline.json was made from:')
    expect(text).toContain('  the pinned Matomo commit is def456, the baseline was made from abc123')
    expect(text).toContain('pnpm run corpus:update')
  })
})
