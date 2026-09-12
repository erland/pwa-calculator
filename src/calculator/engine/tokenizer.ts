import { CalculatorError, type Token } from './types'

const MAX_EXPRESSION_LENGTH = 1_000

export function tokenize(source: string): Token[] {
  if (source.length > MAX_EXPRESSION_LENGTH) {
    throw new CalculatorError('TOO_LONG', 'Uttrycket är för långt.')
  }

  const input = source.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-').replaceAll('π', 'pi')
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const char = input[index]
    if (/\s/.test(char)) {
      index += 1
      continue
    }

    if (/[0-9.,]/.test(char)) {
      const start = index
      let separatorSeen = false
      let digitSeen = false
      while (index < input.length && /[0-9.,]/.test(input[index])) {
        if (input[index] === '.' || input[index] === ',') {
          if (separatorSeen) {
            throw new CalculatorError('SYNTAX', 'Ett tal kan bara innehålla ett decimaltecken.')
          }
          separatorSeen = true
        } else {
          digitSeen = true
        }
        index += 1
      }
      if (!digitSeen) throw new CalculatorError('SYNTAX', 'Decimaltecknet måste höra till ett tal.')
      const value = Number(input.slice(start, index).replace(',', '.'))
      if (!Number.isFinite(value)) throw new CalculatorError('RESULT', 'Talet är för stort.')
      tokens.push({ type: 'number', value })
      continue
    }

    if (/[a-zA-Z]/.test(char)) {
      const start = index
      while (index < input.length && /[a-zA-Z]/.test(input[index])) index += 1
      tokens.push({ type: 'identifier', value: input.slice(start, index).toLowerCase() })
      continue
    }

    if (char === '(') tokens.push({ type: 'leftParen' })
    else if (char === ')') tokens.push({ type: 'rightParen' })
    else if ('+-*/^%'.includes(char)) tokens.push({ type: 'operator', value: char as '+' | '-' | '*' | '/' | '^' | '%' })
    else throw new CalculatorError('SYNTAX', `Tecknet ”${char}” stöds inte.`)
    index += 1
  }

  tokens.push({ type: 'eof' })
  return tokens
}
