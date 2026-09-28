// Runs the built <script> bundle against the Matomo device-detector fixtures
// (https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures)
// and prints how often device.type and device.os agree with them, per Matomo
// device type and OS family.
//
//   pnpm run build && pnpm run corpus [--dump]
//
// The fixtures are downloaded once into node_modules/.cache. `--dump` also
// writes the misdetected user agents to node_modules/.cache/current-device/misses/.
// The corpus is historical and not weighted by traffic: the percentages
// describe coverage of user agent shapes, not the share of real users.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cache = path.join(root, 'node_modules', '.cache', 'current-device')
const fixtureDir = path.join(cache, 'matomo')
const bundle = path.join(root, 'dist', 'index.global.js')
const dump = process.argv.includes('--dump')

const BASE = 'https://raw.githubusercontent.com/matomo-org/device-detector/master/Tests/fixtures/'
const FILES = [
  'desktop', 'tv', 'feature_phone', 'phablet', 'tablet', 'smartphone', 'console', 'car_browser',
  'camera', 'portable_media_player', 'smart_display', 'smart_speaker', 'wearable', 'peripheral', 'unknown'
]

async function download() {
  fs.mkdirSync(fixtureDir, { recursive: true })
  for (const base of FILES) {
    // The fixtures are split into base.yml, base-1.yml, base-2.yml...
    for (let i = 0; ; i++) {
      const name = i === 0 ? `${base}.yml` : `${base}-${i}.yml`
      const file = path.join(fixtureDir, name)
      if (fs.existsSync(file)) continue
      const res = await fetch(BASE + name)
      if (res.status === 404) break
      if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
      fs.writeFileSync(file, await res.text())
      process.stderr.write(`downloaded ${name}\n`)
    }
  }
}

// Reads the fields this script needs from a fixture file. The files are flat
// enough (one "-" per entry, two-space keys, nested "device: type:") that a
// line scanner does it, so no YAML dependency is needed.
function parseFixtures(text) {
  const entries = []
  let entry = null
  let section = null
  for (const line of text.split('\n')) {
    if (line === '-') {
      entry = {}
      entries.push(entry)
      section = null
      continue
    }
    if (!entry) continue
    const top = /^  (\w+):\s*(.*)$/.exec(line)
    if (top) {
      section = top[1]
      if (top[1] === 'user_agent') entry.ua = unquote(top[2])
      else if (top[1] === 'os_family') entry.family = unquote(top[2])
      else if (top[1] === 'headers') entry.headers = true
      continue
    }
    const nested = /^    (\w+):\s*(.*)$/.exec(line)
    if (nested && section === 'device' && nested[1] === 'type') entry.type = unquote(nested[2])
  }
  return entries.filter((e) => typeof e.ua === 'string' && !e.headers)
}

function unquote(value) {
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'")
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value)
  return value
}

// Each run gets its own fake globals, which is much faster than a JSDOM per UA
const code = fs.readFileSync(bundle, 'utf8')
const run = new Function('window', 'document', 'navigator', 'screen', 'location', `${code}\nreturn window.device`)

function detect(ua) {
  const win = {
    navigator: { userAgent: ua, platform: 'Linux armv8l', maxTouchPoints: 0 },
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener() {}
  }
  win.document = { documentElement: { classList: { add() {}, remove() {} } } }
  const device = run(win, win.document, win.navigator, {}, { protocol: 'https:' })
  return { type: device.type, os: device.os, television: device.television() }
}

// What we expect from device.type and device.os for a Matomo device type / OS family
const TYPES = { smartphone: 'mobile', phablet: 'mobile', 'feature phone': 'mobile', tablet: 'tablet', desktop: 'desktop', tv: 'television' }
const FAMILIES = {
  Android: 'android', iOS: 'ios', Windows: 'windows', 'Windows Mobile': 'windows', Mac: 'macos',
  'GNU/Linux': 'linux', 'Chrome OS': 'chromeos', BlackBerry: 'blackberry', 'Firefox OS': 'fxos'
}

await download()

const groups = new Map()
const misses = new Map()
let total = 0
let totalOk = 0
for (const file of fs.readdirSync(fixtureDir).sort()) {
  for (const entry of parseFixtures(fs.readFileSync(path.join(fixtureDir, file), 'utf8'))) {
    const got = detect(entry.ua)
    const family = entry.family || 'Unknown'
    const type = entry.type || 'unknown'
    const key = `${family} | ${type}`
    if (!groups.has(key)) groups.set(key, { n: 0, typeOk: 0, osOk: 0, results: new Map() })
    const group = groups.get(key)
    const wantType = TYPES[type]
    const wantOs = FAMILIES[family]
    const typeOk = wantType === 'television' ? got.television : got.type === wantType
    const osOk = wantOs ? got.os === wantOs || (wantType === 'television' && got.os === 'television') : false
    group.n++
    if (typeOk) group.typeOk++
    if (osOk) group.osOk++
    total++
    if (typeOk) totalOk++
    const result = `${got.os} ${got.type}${got.television ? ' television' : ''}`
    group.results.set(result, (group.results.get(result) || 0) + 1)
    if (dump && (!typeOk || (wantOs && !osOk))) {
      if (!misses.has(key)) misses.set(key, [])
      misses.get(key).push(`${result}\t${entry.ua}`)
    }
  }
}

const pct = (part, whole) => `${((100 * part) / whole).toFixed(1)}%`.padStart(7)
console.log(`${'expected (Matomo)'.padEnd(38)}${'n'.padStart(7)}${'type'.padStart(8)}${'os'.padStart(8)}  most common results`)
for (const [key, group] of [...groups].sort((a, b) => b[1].n - a[1].n)) {
  if (group.n < 15) continue
  const top = [...group.results].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([result, n]) => `${n} ${result}`).join(', ')
  console.log(`${key.padEnd(38)}${String(group.n).padStart(7)}${pct(group.typeOk, group.n)}${pct(group.osOk, group.n)}  ${top}`)
}
console.log(`\n${total} user agents, type correct: ${pct(totalOk, total).trim()}`)

if (dump) {
  const dir = path.join(cache, 'misses')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  for (const [key, list] of misses) {
    fs.writeFileSync(path.join(dir, `${key.replace(/[^a-z0-9]+/gi, '_')}.txt`), `${list.join('\n')}\n`)
  }
  console.log(`misdetected user agents written to ${dir}`)
}
