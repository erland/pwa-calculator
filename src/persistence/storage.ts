import type { AngleMode } from '../calculator/engine/types'

export type CalculatorMode = 'simple' | 'advanced'
export type Theme = 'system' | 'light' | 'dark'

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  createdAt: number
}

export interface PersistedState {
  mode: CalculatorMode
  angleMode: AngleMode
  theme: Theme
  memory: number | null
  history: HistoryEntry[]
}

interface Envelope {
  version: 1
  state: PersistedState
}

export const DEFAULT_PERSISTED_STATE: PersistedState = {
  mode: 'simple',
  angleMode: 'DEG',
  theme: 'system',
  memory: null,
  history: [],
}

const KEY = 'calculator-pwa:v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function loadPersistedState(storage: StorageLike | null = getBrowserStorage()): PersistedState {
  if (!storage) return { ...DEFAULT_PERSISTED_STATE }
  try {
    const raw = storage.getItem(KEY)
    if (!raw) return { ...DEFAULT_PERSISTED_STATE }
    const value: unknown = JSON.parse(raw)
    if (!isEnvelope(value)) return { ...DEFAULT_PERSISTED_STATE }
    return { ...value.state, history: value.state.history.slice(0, 100) }
  } catch {
    return { ...DEFAULT_PERSISTED_STATE }
  }
}

export function savePersistedState(state: PersistedState, storage: StorageLike | null = getBrowserStorage()): boolean {
  if (!storage) return false
  try {
    const envelope: Envelope = { version: 1, state: { ...state, history: state.history.slice(0, 100) } }
    storage.setItem(KEY, JSON.stringify(envelope))
    return true
  } catch {
    return false
  }
}

function getBrowserStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function isEnvelope(value: unknown): value is Envelope {
  if (!value || typeof value !== 'object') return false
  const envelope = value as Partial<Envelope>
  if (envelope.version !== 1 || !envelope.state || typeof envelope.state !== 'object') return false
  const state = envelope.state as Partial<PersistedState>
  return (
    (state.mode === 'simple' || state.mode === 'advanced') &&
    (state.angleMode === 'DEG' || state.angleMode === 'RAD') &&
    (state.theme === 'system' || state.theme === 'light' || state.theme === 'dark') &&
    (state.memory === null || typeof state.memory === 'number') &&
    Array.isArray(state.history) &&
    state.history.every(isHistoryEntry)
  )
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<HistoryEntry>
  return typeof entry.id === 'string' && typeof entry.expression === 'string' && typeof entry.result === 'string' && typeof entry.createdAt === 'number'
}
