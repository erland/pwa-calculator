import { describe, expect, it } from 'vitest'
import { evaluateExpression } from './evaluate'
import { CalculatorError } from './types'

describe('evaluateExpression', () => {
  it.each([
    ['12 + 7', 19],
    ['2 + 3 * 4', 14],
    ['(2 + 3) * 4', 20],
    ['20 / 5 / 2', 2],
    ['2 ^ 3 ^ 2', 512],
    ['-2^2', -4],
    ['(-2)^2', 4],
    ['+4 + -2', 2],
    ['12.5+2,5', 15],
    ['50 * 10%', 5],
    ['10%', 0.1],
    ['sqrt(81)', 9],
    ['sqr(5)', 25],
    ['inv(4)', 0.25],
    ['log(1000)', 3],
    ['ln(e)', 1],
  ])('evaluates %s', (expression, expected) => {
    expect(evaluateExpression(expression)).toBeCloseTo(expected, 12)
  })

  it('supports degrees and radians', () => {
    expect(evaluateExpression('sin(30)', 'DEG')).toBeCloseTo(0.5, 12)
    expect(evaluateExpression('sin(pi / 2)', 'RAD')).toBeCloseTo(1, 12)
  })

  it.each([
    ['1 / 0', 'DIVISION_BY_ZERO'],
    ['sqrt(-1)', 'DOMAIN'],
    ['log(0)', 'DOMAIN'],
    ['tan(90)', 'DOMAIN'],
    ['2 +', 'SYNTAX'],
    ['2..3', 'SYNTAX'],
    ['alert(1)', 'SYNTAX'],
  ])('returns a controlled error for %s', (expression, code) => {
    expect(() => evaluateExpression(expression)).toThrowError(CalculatorError)
    try {
      evaluateExpression(expression)
    } catch (error) {
      expect((error as CalculatorError).code).toBe(code)
    }
  })

  it('rejects expressions longer than the safety limit', () => {
    expect(() => evaluateExpression('1'.repeat(1001))).toThrow('för långt')
  })
})
