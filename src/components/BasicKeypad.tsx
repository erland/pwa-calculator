import type { CalculatorAction } from '../calculator/state/calculatorState'
import { CalculatorButton } from './CalculatorButton'

interface Props { dispatch: (action: CalculatorAction) => void }

export function BasicKeypad({ dispatch }: Props) {
  const append = (value?: string) => value && dispatch({ type: 'append', value })
  return (
    <section className="basic-keypad" aria-label="Grundläggande knappsats">
      <CalculatorButton variant="action" label="Nollställ" onPress={() => dispatch({ type: 'clear' })}>C</CalculatorButton>
      <CalculatorButton variant="action" label="Radera senaste tecknet" onPress={() => dispatch({ type: 'backspace' })}>⌫</CalculatorButton>
      <CalculatorButton variant="action" label="Byt tecken" onPress={() => dispatch({ type: 'toggle-sign' })}>±</CalculatorButton>
      <CalculatorButton variant="operator" label="Division" value="/" onPress={append}>÷</CalculatorButton>
      {['7', '8', '9'].map((value) => <CalculatorButton key={value} value={value} onPress={append}>{value}</CalculatorButton>)}
      <CalculatorButton variant="operator" label="Multiplikation" value="*" onPress={append}>×</CalculatorButton>
      {['4', '5', '6'].map((value) => <CalculatorButton key={value} value={value} onPress={append}>{value}</CalculatorButton>)}
      <CalculatorButton variant="operator" label="Subtraktion" value="-" onPress={append}>−</CalculatorButton>
      {['1', '2', '3'].map((value) => <CalculatorButton key={value} value={value} onPress={append}>{value}</CalculatorButton>)}
      <CalculatorButton variant="operator" label="Addition" value="+" onPress={append}>+</CalculatorButton>
      <CalculatorButton wide value="0" onPress={append}>0</CalculatorButton>
      <CalculatorButton label="Decimaltecken" value="," onPress={append}>,</CalculatorButton>
      <CalculatorButton variant="equals" label="Beräkna" onPress={() => dispatch({ type: 'evaluate' })}>=</CalculatorButton>
    </section>
  )
}
