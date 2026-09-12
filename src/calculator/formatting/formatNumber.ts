import { CalculatorError } from '../engine/types'

const SIGNIFICANT_DIGITS = 12

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) throw new CalculatorError('RESULT', 'Resultatet kan inte visas.')
  const normalized = Object.is(value, -0) || Math.abs(value) < 1e-14 ? 0 : value
  const absolute = Math.abs(normalized)

  let output: string
  if (absolute !== 0 && (absolute >= 1e12 || absolute < 1e-9)) {
    const [coefficient, exponent] = normalized.toExponential(SIGNIFICANT_DIGITS - 1).split('e')
    output = `${trimZeros(coefficient)}e${Number(exponent) >= 0 ? '+' : ''}${Number(exponent)}`
  } else {
    output = Number(normalized.toPrecision(SIGNIFICANT_DIGITS)).toString()
  }
  return output.replace('.', ',')
}

function trimZeros(value: string): string {
  return value.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
}
