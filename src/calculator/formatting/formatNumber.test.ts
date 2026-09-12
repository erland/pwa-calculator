import { describe, expect, it } from 'vitest'
import { formatNumber } from './formatNumber'

describe('formatNumber', () => {
  it('uses a Swedish decimal separator and hides floating point noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0,3')
  })

  it('normalizes negative zero', () => {
    expect(formatNumber(-0)).toBe('0')
  })

  it('uses scientific notation for extreme values', () => {
    expect(formatNumber(1.25e15)).toBe('1,25e+15')
    expect(formatNumber(2.5e-10)).toBe('2,5e-10')
  })
})
