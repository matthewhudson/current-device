import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

function setViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true, writable: true })
}

function htmlClasses(): string[] {
  return document.documentElement.className.split(/\s+/).filter(Boolean)
}

const originalWidth = window.innerWidth
const originalHeight = window.innerHeight

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  setViewport(originalWidth, originalHeight)
  document.documentElement.className = ''
})

// The page's own <html> classes can contain a class name the library uses
// (e.g. "landscape-hero" contains "landscape")
describe('<html> classes that contain a library class name', () => {
  it('still adds the orientation class', async () => {
    document.documentElement.className = 'landscape-hero'
    setViewport(1200, 800)
    await import('../src/index')

    expect(htmlClasses()).toContain('landscape')
    expect(htmlClasses()).toContain('landscape-hero')
  })

  it('leaves them untouched when the orientation class is removed', async () => {
    document.documentElement.className = 'theme portrait-gallery'
    setViewport(1200, 800)
    await import('../src/index')

    expect(htmlClasses()).toEqual(expect.arrayContaining(['theme', 'portrait-gallery', 'landscape']))
    expect(htmlClasses()).not.toContain('portrait')
  })

  it('removes the old orientation class when it is the first class', async () => {
    document.documentElement.className = 'portrait'
    setViewport(1200, 800)
    await import('../src/index')

    expect(htmlClasses()).toContain('landscape')
    expect(htmlClasses()).not.toContain('portrait')
  })
})

describe('<html> classes', () => {
  it('does not add a class twice', async () => {
    setViewport(1200, 800)
    await import('../src/index')
    window.dispatchEvent(new Event('resize'))

    const classes = htmlClasses()
    expect(classes.filter((name) => name === 'landscape')).toHaveLength(1)
    expect(new Set(classes).size).toBe(classes.length)
  })
})
