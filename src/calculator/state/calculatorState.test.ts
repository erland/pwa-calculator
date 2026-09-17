import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_PERSISTED_STATE } from '../../persistence/storage'
import { calculatorReducer, createCalculatorState } from './calculatorState'

describe('calculator state', () => {
  it('evaluates, continues from a result and recovers after errors', () => {
    let state = createCalculatorState(DEFAULT_PERSISTED_STATE)
    state = calculatorReducer(state, { type: 'append', value: '12+7' })
    state = calculatorReducer(state, { type: 'evaluate' })
    expect(state.result).toBe('19')
    state = calculatorReducer(state, { type: 'append', value: '+1' })
    state = calculatorReducer(state, { type: 'evaluate' })
    expect(state.result).toBe('20')
    state = calculatorReducer(state, { type: 'append', value: '/0' })
    state = calculatorReducer(state, { type: 'evaluate' })
    expect(state.error).toMatch(/noll/)
    state = calculatorReducer(state, { type: 'clear' })
    expect(state.error).toBeNull()
  })

  it('starts a new graph expression when x is entered after a completed calculation', () => {
    let state = createCalculatorState(DEFAULT_PERSISTED_STATE)
    state = calculatorReducer(state, { type: 'append', value: '12+7' })
    state = calculatorReducer(state, { type: 'evaluate' })
    state = calculatorReducer(state, { type: 'append', value: 'x' })
    expect(state.expression).toBe('x')
    expect(state.justEvaluated).toBe(false)
  })

  it('stores calculation history in the unified calculator mode', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123)
    let state = createCalculatorState(DEFAULT_PERSISTED_STATE)
    state = calculatorReducer(state, { type: 'append', value: '2+2' })
    state = calculatorReducer(state, { type: 'evaluate' })
    expect(state.history[0]).toMatchObject({ expression: '2+2', result: '4' })
    expect(state.expression).toBe('4')
  })

  it('implements memory add, subtract, recall and clear', () => {
    let state = createCalculatorState(DEFAULT_PERSISTED_STATE)
    state = calculatorReducer(state, { type: 'append', value: '10' })
    state = calculatorReducer(state, { type: 'memory-add' })
    expect(state.memory).toBe(10)
    state = calculatorReducer(state, { type: 'append', value: '+3' })
    state = calculatorReducer(state, { type: 'evaluate' })
    state = calculatorReducer(state, { type: 'memory-subtract' })
    expect(state.memory).toBe(-3)
    state = calculatorReducer(state, { type: 'clear' })
    state = calculatorReducer(state, { type: 'memory-recall' })
    expect(state.expression).toBe('-3')
    state = calculatorReducer(state, { type: 'memory-clear' })
    expect(state.memory).toBeNull()
  })
})
