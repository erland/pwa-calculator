import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GraphCanvas, drawGraphCanvas, mapGraphPointToCanvas, niceGridStep } from './GraphCanvas'
import type { GraphSegment } from './sampleGraph'

const viewport = { xMin: -10, xMax: 10, yMin: -5, yMax: 5 }

function createContextMock() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineJoin: 'miter',
    lineCap: 'butt',
  }
}

describe('GraphCanvas', () => {
  const context = createContextMock()

  beforeEach(() => {
    Object.values(context).forEach((value) => {
      if (typeof value === 'function' && 'mockClear' in value) value.mockClear()
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 400,
      height: 240,
      top: 0,
      right: 400,
      bottom: 240,
      left: 0,
      toJSON: () => ({}),
    })
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a compact help state when no graphable expression is supplied', () => {
    render(<GraphCanvas expression="" viewport={viewport} segments={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent('Skriv ett uttryck med x')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders an accessible, device-pixel-ratio aware canvas', async () => {
    const segments: GraphSegment[] = [{ points: [{ x: -10, y: -2 }, { x: 10, y: 2 }] }]
    render(<GraphCanvas expression="x / 5" viewport={viewport} segments={segments} />)

    const canvas = screen.getByRole('img', { name: 'Graf för uttrycket x / 5' }) as HTMLCanvasElement
    await waitFor(() => {
      expect(canvas.width).toBe(800)
      expect(canvas.height).toBe(480)
    })
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
    expect(context.stroke).toHaveBeenCalled()
  })

  it('describes an expression whose curve is outside the visible viewport', () => {
    render(<GraphCanvas expression="sqrt(x)" viewport={viewport} segments={[]} />)

    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Graf för uttrycket sqrt(x). Ingen kurva är synlig i det aktuella området.',
    )
  })

  it('maps mathematical coordinates to canvas pixels with an inverted y-axis', () => {
    expect(mapGraphPointToCanvas({ x: 0, y: 0 }, viewport, { width: 400, height: 200 })).toEqual({ x: 200, y: 100 })
    expect(mapGraphPointToCanvas({ x: -10, y: 5 }, viewport, { width: 400, height: 200 })).toEqual({ x: 0, y: 0 })
    expect(mapGraphPointToCanvas({ x: 10, y: -5 }, viewport, { width: 400, height: 200 })).toEqual({ x: 400, y: 200 })
  })

  it('chooses stable human-friendly grid steps', () => {
    expect(niceGridStep(20)).toBe(5)
    expect(niceGridStep(2)).toBe(0.5)
    expect(niceGridStep(0.2)).toBe(0.05)
    expect(() => niceGridStep(0)).toThrow('positive finite')
  })

  it('renders supplied segments without owning graph sampling', () => {
    const canvas = document.createElement('canvas')
    const segments: GraphSegment[] = [{ points: [{ x: -10, y: 0 }, { x: 0, y: 2 }, { x: 10, y: 0 }] }]

    drawGraphCanvas(canvas, viewport, segments)

    expect(context.moveTo).toHaveBeenCalled()
    expect(context.lineTo).toHaveBeenCalled()
    expect(context.stroke).toHaveBeenCalled()
  })
})
