import { evaluateExpression } from '../engine/evaluate'
import { CalculatorError, type AngleMode } from '../engine/types'
import { formatNumber } from '../formatting/formatNumber'
import type { CalculatorMode, HistoryEntry, PersistedState, Theme } from '../../persistence/storage'

export interface CalculatorState extends PersistedState {
  expression: string
  result: string
  rawResult: number | null
  error: string | null
  justEvaluated: boolean
}

export type CalculatorAction =
  | { type: 'append'; value: string }
  | { type: 'evaluate' }
  | { type: 'clear' }
  | { type: 'backspace' }
  | { type: 'toggle-sign' }
  | { type: 'set-mode'; mode: CalculatorMode }
  | { type: 'set-angle'; angleMode: AngleMode }
  | { type: 'set-theme'; theme: Theme }
  | { type: 'memory-clear' }
  | { type: 'memory-recall' }
  | { type: 'memory-add' }
  | { type: 'memory-subtract' }
  | { type: 'reuse-history'; entry: HistoryEntry }
  | { type: 'clear-history' }

export function createCalculatorState(persisted: PersistedState): CalculatorState {
  return { ...persisted, expression: '', result: '0', rawResult: null, error: null, justEvaluated: false }
}

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'append': {
      if (state.expression.length + action.value.length > 1_000) return { ...state, error: 'Uttrycket är för långt.' }
      const replaceResult = state.justEvaluated && startsNewExpression(action.value)
      return {
        ...state,
        expression: replaceResult ? action.value : state.expression + action.value,
        error: null,
        justEvaluated: false,
      }
    }
    case 'evaluate': return evaluateState(state)
    case 'clear': return { ...state, expression: '', result: '0', rawResult: null, error: null, justEvaluated: false }
    case 'backspace': return { ...state, expression: state.expression.slice(0, -1), error: null, justEvaluated: false }
    case 'toggle-sign': return { ...state, expression: state.expression ? `-(${state.expression})` : '-', error: null, justEvaluated: false }
    case 'set-mode': return { ...state, mode: action.mode }
    case 'set-angle': return { ...state, angleMode: action.angleMode }
    case 'set-theme': return { ...state, theme: action.theme }
    case 'memory-clear': return { ...state, memory: null }
    case 'memory-recall': {
      if (state.memory === null) return state
      const value = String(state.memory)
      return { ...state, expression: state.justEvaluated ? value : state.expression + value, error: null, justEvaluated: false }
    }
    case 'memory-add': return updateMemory(state, 1)
    case 'memory-subtract': return updateMemory(state, -1)
    case 'reuse-history': return { ...state, expression: normalizeForInput(action.entry.result), result: action.entry.result, rawResult: parseDisplayed(action.entry.result), error: null, justEvaluated: true }
    case 'clear-history': return { ...state, history: [] }
  }
}

function evaluateState(state: CalculatorState): CalculatorState {
  try {
    const rawResult = evaluateExpression(state.expression, state.angleMode)
    const result = formatNumber(rawResult)
    const history: HistoryEntry[] = state.mode === 'advanced'
      ? [{ id: createId(), expression: state.expression, result, createdAt: Date.now() }, ...state.history].slice(0, 100)
      : state.history
    return { ...state, expression: normalizeForInput(result), result, rawResult, error: null, justEvaluated: true, history }
  } catch (error) {
    const message = error instanceof CalculatorError ? error.message : 'Beräkningen kunde inte genomföras.'
    return { ...state, error: message, justEvaluated: false }
  }
}

function updateMemory(state: CalculatorState, direction: 1 | -1): CalculatorState {
  try {
    const value = state.rawResult ?? evaluateExpression(state.expression, state.angleMode)
    return { ...state, memory: (state.memory ?? 0) + direction * value, error: null }
  } catch (error) {
    return { ...state, error: error instanceof CalculatorError ? error.message : 'Värdet kunde inte sparas i minnet.' }
  }
}

function startsNewExpression(value: string): boolean {
  return /^[0-9.,(πe]|^(sin|cos|tan|log|ln|sqrt|inv|sqr)\($/.test(value)
}

function normalizeForInput(value: string): string {
  return value.replace(',', '.')
}

function parseDisplayed(value: string): number {
  return Number(value.replace(',', '.'))
}

let idCounter = 0
function createId(): string {
  idCounter += 1
  return `${Date.now()}-${idCounter}`
}
