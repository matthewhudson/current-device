// The comparison behind the corpus gate. scripts/corpus.mjs runs the built
// bundle against the pinned Matomo fixtures and counts, per "OS family | device
// type" group, how many user agents got the right device.type and device.os.
// scripts/corpus-baseline.json holds those counts for main; `--check` fails
// when a run differs from it in either direction, so a detection change has to
// update the baseline and the PR diff shows what it did to every device class.
//
// Pure functions, tested in tests/corpus-baseline.test.ts.

const BASELINE_FILE = 'scripts/corpus-baseline.json'
const UPDATE_COMMAND = 'pnpm run corpus:update'

/**
 * @param {{ commit: string, groups: Map<string, { n: number, typeOk: number, osOk: number }> }} run
 */
export function buildBaseline({ commit, groups }) {
  const total = { n: 0, typeOk: 0 }
  const sorted = {}
  for (const key of [...groups.keys()].sort()) {
    const { n, typeOk, osOk } = groups.get(key)
    sorted[key] = { n, typeOk, osOk }
    total.n += n
    total.typeOk += typeOk
  }
  return { matomo: commit, total, groups: sorted }
}

/**
 * @param {ReturnType<typeof buildBaseline>} baseline
 * @param {ReturnType<typeof buildBaseline>} current
 */
export function compareBaseline(baseline, current) {
  const corpusChanged = []
  const regressions = []
  const improvements = []

  if (baseline.matomo !== current.matomo) {
    corpusChanged.push(`the pinned Matomo commit is ${current.matomo}, the baseline was made from ${baseline.matomo}`)
  }

  const keys = [...new Set([...Object.keys(baseline.groups), ...Object.keys(current.groups)])].sort()
  for (const key of keys) {
    const before = baseline.groups[key]
    const after = current.groups[key]
    if (!after) {
      corpusChanged.push(`${key} is in the baseline but not in the corpus`)
      continue
    }
    if (!before) {
      corpusChanged.push(`${key} is in the corpus but not in the baseline`)
      continue
    }
    if (before.n !== after.n) {
      corpusChanged.push(`${key} has ${after.n} user agents, the baseline has ${before.n}`)
      continue
    }
    compareMetric(key, 'type', before.n, before.typeOk, after.typeOk, regressions, improvements)
    compareMetric(key, 'os', before.n, before.osOk, after.osOk, regressions, improvements)
  }

  if (corpusChanged.length === 0) {
    compareMetric(
      'total',
      'type',
      baseline.total.n,
      baseline.total.typeOk,
      current.total.typeOk,
      regressions,
      improvements
    )
  }

  const ok = corpusChanged.length === 0 && regressions.length === 0 && improvements.length === 0
  return { ok, corpusChanged, regressions, improvements }
}

function compareMetric(key, metric, n, before, after, regressions, improvements) {
  if (after < before) regressions.push({ key, metric, n, before, after })
  else if (after > before) improvements.push({ key, metric, n, before, after })
}

/**
 * @param {ReturnType<typeof compareBaseline>} result
 * @param {ReturnType<typeof buildBaseline>} current the run that was compared
 */
export function formatComparison(result, current) {
  const lines = []
  if (result.ok) {
    const { n, typeOk } = current.total
    return `Detection matches ${BASELINE_FILE}: ${typeOk}/${n} user agents typed correctly (${pct(typeOk, n)}).`
  }
  if (result.corpusChanged.length > 0) {
    lines.push(`The corpus differs from the one ${BASELINE_FILE} was made from:`)
    for (const reason of result.corpusChanged) lines.push(`  ${reason}`)
    lines.push('')
  }
  if (result.regressions.length > 0) {
    lines.push(`Detection regressed against ${BASELINE_FILE}:`)
    for (const change of result.regressions) lines.push(`  ${describe(change)}`)
    lines.push('')
  }
  if (result.improvements.length > 0) {
    lines.push(`Detection improved against ${BASELINE_FILE}:`)
    for (const change of result.improvements) lines.push(`  ${describe(change)}`)
    lines.push('')
  }
  lines.push(
    `Review the changes (\`pnpm run corpus --dump\` writes the misdetected user agents), then run \`${UPDATE_COMMAND}\``,
    `and commit ${BASELINE_FILE} so the PR diff shows what changed and the gate protects the new figures.`
  )
  return lines.join('\n')
}

function describe({ key, metric, n, before, after }) {
  return `${key}: ${metric} correct ${before} -> ${after} of ${n} (${pct(before, n)} -> ${pct(after, n)})`
}

function pct(part, whole) {
  return `${whole ? ((100 * part) / whole).toFixed(1) : '0.0'}%`
}
