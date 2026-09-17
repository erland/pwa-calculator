import { evaluateExpression } from '../engine/evaluate'
import { CalculatorError, type AngleMode } from '../engine/types'

export interface GraphViewport {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  width: number
}

export interface GraphPoint {
  x: number
  y: number
}

export interface GraphSegment {
  points: GraphPoint[]
}

export interface GraphSampleResult {
  segments: GraphSegment[]
  sampleCount: number
}

const MIN_SAMPLES = 64
const MAX_SAMPLES = 2_048
const SAMPLES_PER_PIXEL = 1.25
const DISCONTINUITY_Y_SPANS = 2

export function sampleGraph(
  expression: string,
  viewport: GraphViewport,
  angleMode: AngleMode = 'DEG',
): GraphSampleResult {
  validateViewport(viewport)

  const sampleCount = clamp(Math.ceil(viewport.width * SAMPLES_PER_PIXEL), MIN_SAMPLES, MAX_SAMPLES)
  const xStep = (viewport.xMax - viewport.xMin) / (sampleCount - 1)
  const ySpan = viewport.yMax - viewport.yMin
  const jumpThreshold = ySpan * DISCONTINUITY_Y_SPANS
  const segments: GraphSegment[] = []
  let current: GraphPoint[] = []
  let previous: GraphPoint | null = null

  const flush = () => {
    if (current.length >= 2) segments.push({ points: current })
    current = []
    previous = null
  }

  for (let index = 0; index < sampleCount; index += 1) {
    const x = index === sampleCount - 1 ? viewport.xMax : viewport.xMin + index * xStep

    try {
      const point = { x, y: evaluateExpression(expression, angleMode, { x }) }

      if (previous && isObviousDiscontinuity(previous, point, jumpThreshold, viewport)) {
        flush()
      }

      current.push(point)
      previous = point
    } catch (error) {
      if (!isPointwiseGraphError(error)) throw error
      flush()
    }
  }

  flush()
  return { segments, sampleCount }
}

function isObviousDiscontinuity(
  previous: GraphPoint,
  current: GraphPoint,
  jumpThreshold: number,
  viewport: GraphViewport,
): boolean {
  const jump = Math.abs(current.y - previous.y)
  if (jump <= jumpThreshold) return false

  const previousOutside = previous.y < viewport.yMin || previous.y > viewport.yMax
  const currentOutside = current.y < viewport.yMin || current.y > viewport.yMax
  const crossesViewport =
    (previous.y < viewport.yMin && current.y > viewport.yMax) ||
    (previous.y > viewport.yMax && current.y < viewport.yMin)

  return crossesViewport || previousOutside || currentOutside
}

function isPointwiseGraphError(error: unknown): boolean {
  return error instanceof CalculatorError &&
    (error.code === 'DOMAIN' || error.code === 'DIVISION_BY_ZERO' || error.code === 'RESULT')
}

function validateViewport(viewport: GraphViewport): void {
  const values = [viewport.xMin, viewport.xMax, viewport.yMin, viewport.yMax, viewport.width]
  if (!values.every(Number.isFinite)) throw new Error('Graph viewport values must be finite.')
  if (viewport.xMax <= viewport.xMin) throw new Error('Graph viewport xMax must be greater than xMin.')
  if (viewport.yMax <= viewport.yMin) throw new Error('Graph viewport yMax must be greater than yMin.')
  if (viewport.width <= 0) throw new Error('Graph viewport width must be greater than zero.')
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
