import { useEffect, useRef } from 'react'
import type { GraphPoint, GraphSegment, GraphViewport } from './sampleGraph'
import './GraphCanvas.css'

export type GraphRenderViewport = Pick<GraphViewport, 'xMin' | 'xMax' | 'yMin' | 'yMax'>

export interface GraphCanvasProps {
  expression: string
  viewport: GraphRenderViewport
  segments: GraphSegment[]
  className?: string
  onPan?: (deltaPixels: { x: number; y: number }, size: { width: number; height: number }) => void
  onZoom?: (factor: number, anchor: { x: number; y: number }) => void
  onReset?: () => void
  resetDisabled?: boolean
}

interface CanvasSize {
  width: number
  height: number
}

export function GraphCanvas({
  expression,
  viewport,
  segments,
  className = '',
  onPan,
  onZoom,
  onReset,
  resetDisabled = false,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null)
  const graphableExpression = expression.trim()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !graphableExpression) return

    const draw = () => drawGraphCanvas(canvas, viewport, segments)
    draw()

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw)
    resizeObserver?.observe(canvas)

    const themeObserver = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(draw)
    themeObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (!resizeObserver) window.addEventListener('resize', draw)

    return () => {
      resizeObserver?.disconnect()
      themeObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', draw)
    }
  }, [graphableExpression, segments, viewport])

  const classes = ['graph-canvas', className].filter(Boolean).join(' ')

  if (!graphableExpression) {
    return (
      <div className={`${classes} graph-canvas--empty`} role="status">
        Skriv ett uttryck med x för att visa en graf.
      </div>
    )
  }

  const curveDescription = segments.length > 0
    ? `Graf för uttrycket ${graphableExpression}`
    : `Graf för uttrycket ${graphableExpression}. Ingen kurva är synlig i det aktuella området.`

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!onPan) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current
    if (!onPan || !drag || drag.pointerId !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const delta = { x: event.clientX - drag.x, y: event.clientY - drag.y }
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
    onPan(delta, { width: Math.max(1, rect.width), height: Math.max(1, rect.height) })
  }

  const finishPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
  }

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!onZoom) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const factor = Math.exp(event.deltaY * 0.0015)
    onZoom(factor, {
      x: (event.clientX - rect.left) / Math.max(1, rect.width),
      y: (event.clientY - rect.top) / Math.max(1, rect.height),
    })
  }

  return (
    <figure className={classes}>
      {onReset && (
        <button
          type="button"
          className="graph-canvas__reset"
          onClick={onReset}
          disabled={resetDisabled}
        >
          Återställ graf
        </button>
      )}
      <canvas
        ref={canvasRef}
        className="graph-canvas__surface"
        role="img"
        aria-label={curveDescription}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onWheel={handleWheel}
      />
      <figcaption className="graph-canvas__caption">{curveDescription}</figcaption>
    </figure>
  )
}

export function drawGraphCanvas(
  canvas: HTMLCanvasElement,
  viewport: GraphRenderViewport,
  segments: GraphSegment[],
): void {
  validateRenderViewport(viewport)
  const context = canvas.getContext('2d')
  if (!context) return

  const size = measureCanvas(canvas)
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 4))
  canvas.width = Math.max(1, Math.round(size.width * dpr))
  canvas.height = Math.max(1, Math.round(size.height * dpr))
  context.setTransform(dpr, 0, 0, dpr, 0, 0)

  const styles = getComputedStyle(canvas)
  const background = readColor(styles, '--surface-soft', '#f3f6fb')
  const gridColor = readColor(styles, '--border', '#d2dae8')
  const axisColor = readColor(styles, '--muted', '#62708a')
  const curveColor = readColor(styles, '--accent', '#2864dc')

  context.clearRect(0, 0, size.width, size.height)
  context.fillStyle = background
  context.fillRect(0, 0, size.width, size.height)

  drawGrid(context, viewport, size, gridColor)
  drawAxes(context, viewport, size, axisColor)
  drawSegments(context, viewport, size, segments, curveColor)
}

export function mapGraphPointToCanvas(
  point: GraphPoint,
  viewport: GraphRenderViewport,
  size: CanvasSize,
): GraphPoint {
  const x = ((point.x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * size.width
  const y = size.height - ((point.y - viewport.yMin) / (viewport.yMax - viewport.yMin)) * size.height
  return { x, y }
}

export function niceGridStep(span: number, targetLines = 8): number {
  if (!Number.isFinite(span) || span <= 0) throw new Error('Graph span must be a positive finite number.')
  const roughStep = span / Math.max(1, targetLines)
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const normalized = roughStep / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
}

function drawGrid(
  context: CanvasRenderingContext2D,
  viewport: GraphRenderViewport,
  size: CanvasSize,
  color: string,
): void {
  const xStep = niceGridStep(viewport.xMax - viewport.xMin)
  const yStep = niceGridStep(viewport.yMax - viewport.yMin)

  context.beginPath()
  context.strokeStyle = color
  context.lineWidth = 1

  forEachGridValue(viewport.xMin, viewport.xMax, xStep, (value) => {
    const point = mapGraphPointToCanvas({ x: value, y: viewport.yMin }, viewport, size)
    context.moveTo(point.x, 0)
    context.lineTo(point.x, size.height)
  })

  forEachGridValue(viewport.yMin, viewport.yMax, yStep, (value) => {
    const point = mapGraphPointToCanvas({ x: viewport.xMin, y: value }, viewport, size)
    context.moveTo(0, point.y)
    context.lineTo(size.width, point.y)
  })

  context.stroke()
}

function drawAxes(
  context: CanvasRenderingContext2D,
  viewport: GraphRenderViewport,
  size: CanvasSize,
  color: string,
): void {
  context.beginPath()
  context.strokeStyle = color
  context.lineWidth = 1.5

  if (viewport.xMin <= 0 && viewport.xMax >= 0) {
    const origin = mapGraphPointToCanvas({ x: 0, y: viewport.yMin }, viewport, size)
    context.moveTo(origin.x, 0)
    context.lineTo(origin.x, size.height)
  }

  if (viewport.yMin <= 0 && viewport.yMax >= 0) {
    const origin = mapGraphPointToCanvas({ x: viewport.xMin, y: 0 }, viewport, size)
    context.moveTo(0, origin.y)
    context.lineTo(size.width, origin.y)
  }

  context.stroke()
}

function drawSegments(
  context: CanvasRenderingContext2D,
  viewport: GraphRenderViewport,
  size: CanvasSize,
  segments: GraphSegment[],
  color: string,
): void {
  context.strokeStyle = color
  context.lineWidth = 2
  context.lineJoin = 'round'
  context.lineCap = 'round'

  for (const segment of segments) {
    if (segment.points.length < 2) continue
    context.beginPath()
    segment.points.forEach((point, index) => {
      const mapped = mapGraphPointToCanvas(point, viewport, size)
      if (index === 0) context.moveTo(mapped.x, mapped.y)
      else context.lineTo(mapped.x, mapped.y)
    })
    context.stroke()
  }
}

function measureCanvas(canvas: HTMLCanvasElement): CanvasSize {
  const rect = canvas.getBoundingClientRect()
  return {
    width: Math.max(1, Math.round(rect.width || canvas.clientWidth || 640)),
    height: Math.max(1, Math.round(rect.height || canvas.clientHeight || 360)),
  }
}

function forEachGridValue(min: number, max: number, step: number, callback: (value: number) => void): void {
  const first = Math.ceil(min / step) * step
  const epsilon = step / 1_000
  for (let value = first, count = 0; value <= max + epsilon && count < 1_000; value += step, count += 1) {
    callback(Math.abs(value) < epsilon ? 0 : value)
  }
}

function readColor(styles: CSSStyleDeclaration, property: string, fallback: string): string {
  return styles.getPropertyValue(property).trim() || fallback
}

function validateRenderViewport(viewport: GraphRenderViewport): void {
  const values = [viewport.xMin, viewport.xMax, viewport.yMin, viewport.yMax]
  if (!values.every(Number.isFinite)) throw new Error('Graph render viewport values must be finite.')
  if (viewport.xMax <= viewport.xMin) throw new Error('Graph render viewport xMax must be greater than xMin.')
  if (viewport.yMax <= viewport.yMin) throw new Error('Graph render viewport yMax must be greater than yMin.')
}
