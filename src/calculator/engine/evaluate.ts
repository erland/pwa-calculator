import { tokenize } from './tokenizer'
import { CalculatorError, type AngleMode, type Token } from './types'

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'inv', 'sqr'])

class Parser {
  private index = 0

  constructor(
    private readonly tokens: Token[],
    private readonly angleMode: AngleMode,
  ) {}

  parse(): number {
    const result = this.parseAddition()
    if (this.current().type !== 'eof') throw new CalculatorError('SYNTAX', 'Uttrycket innehåller oväntad syntax.')
    this.assertFinite(result)
    return Object.is(result, -0) ? 0 : result
  }

  private parseAddition(): number {
    let value = this.parseMultiplication()
    while (this.isOperator('+') || this.isOperator('-')) {
      const operator = (this.current() as Extract<Token, { type: 'operator' }>).value
      this.consume()
      const right = this.parseMultiplication()
      value = operator === '+' ? value + right : value - right
      this.assertFinite(value)
    }
    return value
  }

  private parseMultiplication(): number {
    let value = this.parseUnary()
    while (this.isOperator('*') || this.isOperator('/')) {
      const operator = (this.current() as Extract<Token, { type: 'operator' }>).value
      this.consume()
      const right = this.parseUnary()
      if (operator === '/' && right === 0) throw new CalculatorError('DIVISION_BY_ZERO', 'Det går inte att dividera med noll.')
      value = operator === '*' ? value * right : value / right
      this.assertFinite(value)
    }
    return value
  }

  private parseUnary(): number {
    if (this.isOperator('+')) {
      this.consume()
      return this.parseUnary()
    }
    if (this.isOperator('-')) {
      this.consume()
      return -this.parseUnary()
    }
    return this.parsePower()
  }

  private parsePower(): number {
    const base = this.parsePostfix()
    if (!this.isOperator('^')) return base
    this.consume()
    const value = Math.pow(base, this.parseUnary())
    this.assertFinite(value)
    return value
  }

  private parsePostfix(): number {
    let value = this.parsePrimary()
    while (this.isOperator('%')) {
      this.consume()
      value /= 100
    }
    return value
  }

  private parsePrimary(): number {
    const token = this.consume()
    if (token.type === 'number') return token.value
    if (token.type === 'leftParen') {
      const value = this.parseAddition()
      if (this.consume().type !== 'rightParen') throw new CalculatorError('SYNTAX', 'En högerparentes saknas.')
      return value
    }
    if (token.type === 'identifier') {
      if (token.value === 'pi') return Math.PI
      if (token.value === 'e') return Math.E
      if (!FUNCTIONS.has(token.value)) throw new CalculatorError('SYNTAX', `Funktionen ”${token.value}” stöds inte.`)
      if (this.consume().type !== 'leftParen') throw new CalculatorError('SYNTAX', 'Funktionens argument måste stå inom parentes.')
      const argument = this.parseAddition()
      if (this.consume().type !== 'rightParen') throw new CalculatorError('SYNTAX', 'En högerparentes saknas.')
      return this.applyFunction(token.value, argument)
    }
    throw new CalculatorError('SYNTAX', 'Uttrycket är inte fullständigt.')
  }

  private applyFunction(name: string, value: number): number {
    const angle = this.angleMode === 'DEG' ? (value * Math.PI) / 180 : value
    let result: number
    switch (name) {
      case 'sin': result = Math.sin(angle); break
      case 'cos': result = Math.cos(angle); break
      case 'tan': {
        const cosine = Math.cos(angle)
        if (Math.abs(cosine) < 1e-14) throw new CalculatorError('DOMAIN', 'Tangens är inte definierad för den vinkeln.')
        result = Math.tan(angle)
        break
      }
      case 'log':
        if (value <= 0) throw new CalculatorError('DOMAIN', 'Logaritmen kräver ett positivt tal.')
        result = Math.log10(value)
        break
      case 'ln':
        if (value <= 0) throw new CalculatorError('DOMAIN', 'Den naturliga logaritmen kräver ett positivt tal.')
        result = Math.log(value)
        break
      case 'sqrt':
        if (value < 0) throw new CalculatorError('DOMAIN', 'Kvadratroten kräver ett tal som är noll eller större.')
        result = Math.sqrt(value)
        break
      case 'inv':
        if (value === 0) throw new CalculatorError('DIVISION_BY_ZERO', 'Det går inte att dividera med noll.')
        result = 1 / value
        break
      case 'sqr': result = value * value; break
      default: throw new CalculatorError('SYNTAX', 'Funktionen stöds inte.')
    }
    this.assertFinite(result)
    return result
  }

  private current(): Token {
    return this.tokens[this.index] ?? { type: 'eof' }
  }

  private consume(): Token {
    const token = this.current()
    this.index += 1
    return token
  }

  private isOperator(value: string): boolean {
    const token = this.current()
    return token.type === 'operator' && token.value === value
  }

  private assertFinite(value: number): void {
    if (!Number.isFinite(value)) throw new CalculatorError('RESULT', 'Resultatet kan inte visas.')
  }
}

export function evaluateExpression(expression: string, angleMode: AngleMode = 'DEG'): number {
  if (!expression.trim()) throw new CalculatorError('SYNTAX', 'Skriv ett uttryck först.')
  return new Parser(tokenize(expression), angleMode).parse()
}
