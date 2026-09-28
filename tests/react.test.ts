import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { act, cleanup, renderHook } from '@testing-library/react'
import device from '../src/index'
import { useDevice, useOrientation } from '../src/react'

function setViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true, writable: true })
}

// jsdom has no orientationchange event, so the library listens to resize
function rotate(width: number, height: number): void {
  act(() => {
    setViewport(width, height)
    window.dispatchEvent(new Event('resize'))
  })
}

beforeEach(() => {
  rotate(768, 1024)
})

afterEach(() => {
  cleanup()
})

describe('useDevice()', () => {
  it('returns the type, os and orientation of the device', () => {
    const { result } = renderHook(() => useDevice())
    expect(result.current).toEqual({
      type: device.type,
      os: device.os,
      orientation: 'portrait',
    })
  })

  it('updates when the orientation changes', () => {
    const { result } = renderHook(() => useDevice())
    rotate(1024, 768)
    expect(result.current.orientation).toBe('landscape')
    expect(result.current.type).toBe(device.type)
    rotate(768, 1024)
    expect(result.current.orientation).toBe('portrait')
  })

  it('returns the same object until the orientation changes', () => {
    const { result, rerender } = renderHook(() => useDevice())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
    // A resize that keeps the orientation
    rotate(600, 800)
    expect(result.current).toBe(first)
  })
})

describe('useOrientation()', () => {
  it('returns the orientation and updates when it changes', () => {
    const { result } = renderHook(() => useOrientation())
    expect(result.current).toBe('portrait')
    rotate(1024, 768)
    expect(result.current).toBe('landscape')
  })

  it('stops listening when the component unmounts', () => {
    let renders = 0
    const { unmount } = renderHook(() => {
      renders++
      return useOrientation()
    })
    unmount()
    const rendersAtUnmount = renders
    rotate(1024, 768)
    expect(renders).toBe(rendersAtUnmount)
  })
})

describe('Hydration', () => {
  it('matches the server HTML first, then shows the real values', async () => {
    function Probe() {
      const { type, orientation } = useDevice()
      return createElement('p', null, `${type} ${orientation}`)
    }
    // What a server renders: see tests/ssr.test.ts
    const container = document.createElement('div')
    container.innerHTML = '<p>unknown unknown</p>'
    document.body.appendChild(container)

    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(container, createElement(Probe), {
        onRecoverableError: (error) => errors.push(error),
      })
    })

    expect(errors).toEqual([])
    expect(container.innerHTML).toBe(`<p>${device.type} portrait</p>`)
    // In a browser, rendering to a string is not a server render
    expect(renderToString(createElement(Probe))).toBe('<p>unknown unknown</p>')

    act(() => root?.unmount())
    container.remove()
  })
})
