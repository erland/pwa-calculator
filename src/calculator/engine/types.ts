export type AngleMode = 'DEG' | 'RAD'

export interface EvaluationVariables {
  x?: number
}

export type Token =
  | { type: 'number'; value: number }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' | '^' | '%' }
  | { type: 'leftParen' }
  | { type: 'rightParen' }
  | { type: 'eof' }

export class CalculatorError extends Error {
  constructor(
    public readonly code: 'SYNTAX' | 'DIVISION_BY_ZERO' | 'DOMAIN' | 'TOO_LONG' | 'RESULT' | 'VARIABLE',
    message: string,
  ) {
    super(message)
    this.name = 'CalculatorError'
  }
}
