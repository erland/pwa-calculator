import { describe, expect, it } from 'vitest'
import { DEFAULT_GRAPH_VIEWPORT, isDefaultGraphViewport, panGraphViewport, zoomGraphViewport } from './viewport'

describe('graph viewport transforms', () => {
  it('pans according to canvas pixel movement', () => {
    const moved = panGraphViewport(DEFAULT_GRAPH_VIEWPORT, { x: 100, y: -50 }, { width: 400, height: 200 })
    expect(moved).toEqual({ xMin: -15, xMax: 5, yMin: -15, yMax: 5 })
  })

  it('zooms around the center by default', () => {
    expect(zoomGraphViewport(DEFAULT_GRAPH_VIEWPORT, 0.5)).toEqual({ xMin: -5, xMax: 5, yMin: -5, yMax: 5 })
  })

  it('keeps the chosen graph point under the zoom anchor', () => {
    const zoomed = zoomGraphViewport(DEFAULT_GRAPH_VIEWPORT, 0.5, { x: 0.75, y: 0.25 })
    expect(zoomed).toEqual({ xMin: -2.5, xMax: 7.5, yMin: -2.5, yMax: 7.5 })
  })

  it('caps extreme zoom ranges', () => {
    const zoomedIn = zoomGraphViewport(DEFAULT_GRAPH_VIEWPORT, 1e-12)
    expect(zoomedIn.xMax - zoomedIn.xMin).toBeCloseTo(1e-4)
    const zoomedOut = zoomGraphViewport(DEFAULT_GRAPH_VIEWPORT, 1e12)
    expect(zoomedOut.xMax - zoomedOut.xMin).toBe(1e6)
  })

  it('identifies the deterministic reset viewport', () => {
    expect(isDefaultGraphViewport(DEFAULT_GRAPH_VIEWPORT)).toBe(true)
    expect(isDefaultGraphViewport({ ...DEFAULT_GRAPH_VIEWPORT, xMin: -9 })).toBe(false)
  })
})
