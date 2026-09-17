import type { GraphRenderViewport } from './GraphCanvas'

export const DEFAULT_GRAPH_VIEWPORT: GraphRenderViewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
}

const MIN_SPAN = 1e-4
const MAX_SPAN = 1e6

export function panGraphViewport(
  viewport: GraphRenderViewport,
  deltaPixels: { x: number; y: number },
  size: { width: number; height: number },
): GraphRenderViewport {
  validateSize(size)
  const xSpan = viewport.xMax - viewport.xMin
  const ySpan = viewport.yMax - viewport.yMin
  const xShift = -(deltaPixels.x / size.width) * xSpan
  const yShift = (deltaPixels.y / size.height) * ySpan
  return {
    xMin: viewport.xMin + xShift,
    xMax: viewport.xMax + xShift,
    yMin: viewport.yMin + yShift,
    yMax: viewport.yMax + yShift,
  }
}

export function zoomGraphViewport(
  viewport: GraphRenderViewport,
  factor: number,
  anchor: { x: number; y: number } = { x: 0.5, y: 0.5 },
): GraphRenderViewport {
  if (!Number.isFinite(factor) || factor <= 0) throw new Error('Graph zoom factor must be positive and finite.')
  const xSpan = clampSpan((viewport.xMax - viewport.xMin) * factor)
  const ySpan = clampSpan((viewport.yMax - viewport.yMin) * factor)
  const anchorX = viewport.xMin + clamp01(anchor.x) * (viewport.xMax - viewport.xMin)
  const anchorY = viewport.yMax - clamp01(anchor.y) * (viewport.yMax - viewport.yMin)
  const leftRatio = clamp01(anchor.x)
  const bottomRatio = 1 - clamp01(anchor.y)

  return {
    xMin: anchorX - xSpan * leftRatio,
    xMax: anchorX + xSpan * (1 - leftRatio),
    yMin: anchorY - ySpan * bottomRatio,
    yMax: anchorY + ySpan * (1 - bottomRatio),
  }
}

export function isDefaultGraphViewport(viewport: GraphRenderViewport): boolean {
  return viewport.xMin === DEFAULT_GRAPH_VIEWPORT.xMin &&
    viewport.xMax === DEFAULT_GRAPH_VIEWPORT.xMax &&
    viewport.yMin === DEFAULT_GRAPH_VIEWPORT.yMin &&
    viewport.yMax === DEFAULT_GRAPH_VIEWPORT.yMax
}

function clampSpan(span: number): number {
  return Math.max(MIN_SPAN, Math.min(MAX_SPAN, span))
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0.5
  return Math.max(0, Math.min(1, value))
}

function validateSize(size: { width: number; height: number }): void {
  if (!Number.isFinite(size.width) || !Number.isFinite(size.height) || size.width <= 0 || size.height <= 0) {
    throw new Error('Graph viewport size must be positive and finite.')
  }
}
