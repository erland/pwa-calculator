import type { AngleMode } from '../calculator/engine/types'
import type { CalculatorAction } from '../calculator/state/calculatorState'
import { CalculatorButton } from './CalculatorButton'

interface Props {
  dispatch: (action: CalculatorAction) => void
  angleMode: AngleMode
  hasMemory: boolean
  onFunctionChosen?: () => void
}

export function AdvancedKeypad({ dispatch, angleMode, hasMemory, onFunctionChosen }: Props) {
  const append = (value?: string) => {
    if (!value) return
    dispatch({ type: 'append', value })
    onFunctionChosen?.()
  }
  return (
    <section className="advanced-controls" aria-label="Avancerade funktioner">
      <div className="setting-row">
        <span>Vinklar</span>
        <div className="segmented compact" role="group" aria-label="Vinkelenhet">
          {(['DEG', 'RAD'] as const).map((mode) => (
            <button type="button" aria-pressed={angleMode === mode} key={mode} onClick={() => dispatch({ type: 'set-angle', angleMode: mode })}>{mode}</button>
          ))}
        </div>
      </div>
      <div className="memory-row" aria-label="Minnesfunktioner">
        <button type="button" onClick={() => dispatch({ type: 'memory-clear' })}>MC</button>
        <button type="button" onClick={() => dispatch({ type: 'memory-recall' })} disabled={!hasMemory}>MR</button>
        <button type="button" onClick={() => dispatch({ type: 'memory-add' })}>M+</button>
        <button type="button" onClick={() => dispatch({ type: 'memory-subtract' })}>M−</button>
        <span className="memory-status" aria-live="polite">{hasMemory ? 'M' : ''}</span>
      </div>
      <div className="advanced-keypad">
        <CalculatorButton variant="function" value="(" onPress={append}>(</CalculatorButton>
        <CalculatorButton variant="function" value=")" onPress={append}>)</CalculatorButton>
        <CalculatorButton variant="function" label="Procent" value="%" onPress={append}>%</CalculatorButton>
        <CalculatorButton variant="function" label="Potens" value="^" onPress={append}>xʸ</CalculatorButton>
        <CalculatorButton variant="function" label="Kvadrat" value="sqr(" onPress={append}>x²</CalculatorButton>
        <CalculatorButton variant="function" label="Kvadratrot" value="sqrt(" onPress={append}>√</CalculatorButton>
        <CalculatorButton variant="function" value="sin(" onPress={append}>sin</CalculatorButton>
        <CalculatorButton variant="function" value="cos(" onPress={append}>cos</CalculatorButton>
        <CalculatorButton variant="function" value="tan(" onPress={append}>tan</CalculatorButton>
        <CalculatorButton variant="function" label="Tiologaritm" value="log(" onPress={append}>log</CalculatorButton>
        <CalculatorButton variant="function" label="Naturlig logaritm" value="ln(" onPress={append}>ln</CalculatorButton>
        <CalculatorButton variant="function" label="Invers" value="inv(" onPress={append}>1/x</CalculatorButton>
        <CalculatorButton variant="function" label="Pi" value="pi" onPress={append}>π</CalculatorButton>
        <CalculatorButton variant="function" label="Eulers tal" value="e" onPress={append}>e</CalculatorButton>
      </div>
    </section>
  )
}
