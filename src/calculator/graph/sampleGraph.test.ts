import { describe, expect, it } from 'vitest'
import { CalculatorError } from '../engine/types'
import { sampleGraph, type GraphViewport } from './sampleGraph'

const viewport: GraphViewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
  width: 400,
}

describe('sampleGraph', () => {
  it('samples a linear expression across the full x range', () => {
    const result = sampleGraph('2*x + 1', viewport)

    expect(result.sampleCount).toBe(500)
    expect(result.segments).toHaveLength(1)
    expect(result.segments[0].points[0]).toEqual({ x: -10, y: -19 })
    expect(result.segments[0].points.at(-1)).toEqual({ x: 10, y: 21 })
  })

  it('samples quadratic and trigonometric expressions through the expression engine', () => {
    const quadratic = sampleGraph('x^2 - 4', viewport)
    const sine = sampleGraph('sin(x)', { ...viewport, xMin: -180, xMax: 180 }, 'DEG')

    expect(quadratic.segments).toHaveLength(1)
    expect(quadratic.segments[0].points.some(({ x, y }) => Math.abs(x) < 0.03 && Math.abs(y + 4) < 0.01)).toBe(true)
    expect(sine.segments).toHaveLength(1)
    expect(sine.segments[0].points.some(({ x, y }) => Math.abs(x - 90) < 0.5 && Math.abs(y - 1) < 0.001)).toBe(true)
  })

  it('continues sampling after pointwise domain errors', () => {
    const result = sampleGraph('sqrt(x)', viewport)

    expect(result.segments).toHaveLength(1)
    expect(result.segments[0].points[0].x).toBeGreaterThanOrEqual(0)
    expect(result.segments[0].points.at(-1)?.x).toBe(10)
  })

  it('splits the curve around the asymptote in 1/x', () => {
    const result = sampleGraph('1/x', viewport)

    expect(result.segments.length).toBeGreaterThanOrEqual(2)
    expect(result.segments.every((segment) => {
      const xs = segment.points.map((point) => point.x)
      return xs.every((x) => x < 0) || xs.every((x) => x > 0)
    })).toBe(true)
  })

  it('splits obvious tangent discontinuities instead of connecting across them', () => {
    const result = sampleGraph(
      'tan(x)',
      { xMin: -180, xMax: 180, yMin: -10, yMax: 10, width: 720 },
      'DEG',
    )

    expect(result.segments.length).toBeGreaterThanOrEqual(3)
    for (const segment of result.segments) {
      expect(segment.points.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('propagates expression errors that are not point-specific graph domain failures', () => {
    expect(() => sampleGraph('x +', viewport)).toThrowError(CalculatorError)
    expect(() => sampleGraph('unknown(x)', viewport)).toThrowError(CalculatorError)
  })

  it('derives bounded sampling density from viewport width', () => {
    expect(sampleGraph('x', { ...viewport, width: 1 }).sampleCount).toBe(64)
    expect(sampleGraph('x', { ...viewport, width: 10_000 }).sampleCount).toBe(2_048)
  })

  it('rejects invalid viewport definitions', () => {
    expect(() => sampleGraph('x', { ...viewport, xMax: -10 })).toThrow('xMax')
    expect(() => sampleGraph('x', { ...viewport, yMax: -10 })).toThrow('yMax')
    expect(() => sampleGraph('x', { ...viewport, width: 0 })).toThrow('width')
  })
})
