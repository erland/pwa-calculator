import { useEffect, useMemo, useReducer } from 'react'
import { calculatorReducer, createCalculatorState, type CalculatorAction } from '../calculator/state/calculatorState'
import { AdvancedKeypad } from '../components/AdvancedKeypad'
import { BasicKeypad } from '../components/BasicKeypad'
import { HistoryPanel } from '../components/HistoryPanel'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { loadPersistedState, savePersistedState, type PersistedState, type Theme } from '../persistence/storage'

export function App() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, () => createCalculatorState(loadPersistedState()))
  const persisted = useMemo<PersistedState>(() => ({
    mode: state.mode,
    angleMode: state.angleMode,
    theme: state.theme,
    memory: state.memory,
    history: state.history,
  }), [state.mode, state.angleMode, state.theme, state.memory, state.history])

  useEffect(() => { savePersistedState(persisted) }, [persisted])
  useEffect(() => applyTheme(state.theme), [state.theme])
  useEffect(() => bindKeyboard(dispatch), [])

  return (
    <>
      <a className="skip-link" href="#calculator">Hoppa till miniräknaren</a>
      <main className={`app-layout mode-${state.mode}`}>
        <header className="app-header">
          <div>
            <p className="eyebrow">Offlineklar PWA</p>
            <h1>Miniräknaren</h1>
          </div>
          <label className="theme-picker">
            <span>Tema</span>
            <select value={state.theme} onChange={(event) => dispatch({ type: 'set-theme', theme: event.target.value as Theme })}>
              <option value="system">System</option>
              <option value="light">Ljust</option>
              <option value="dark">Mörkt</option>
            </select>
          </label>
        </header>

        <nav className="segmented mode-switch" aria-label="Miniräknarläge">
          <button type="button" aria-pressed={state.mode === 'simple'} onClick={() => dispatch({ type: 'set-mode', mode: 'simple' })}>Enkel</button>
          <button type="button" aria-pressed={state.mode === 'advanced'} onClick={() => dispatch({ type: 'set-mode', mode: 'advanced' })}>Avancerad</button>
        </nav>

        <div className="workspace">
          <section id="calculator" className="calculator-card" aria-label={`${state.mode === 'simple' ? 'Enkel' : 'Avancerad'} miniräknare`}>
            <div className="display" role="status" aria-live="polite" aria-atomic="true">
              <span className="expression">{displayExpression(state.expression) || 'Skriv en beräkning'}</span>
              {state.error ? <strong className="error">{state.error}</strong> : <strong className="result">{state.result}</strong>}
            </div>
            {state.mode === 'advanced' && <AdvancedKeypad dispatch={dispatch} angleMode={state.angleMode} hasMemory={state.memory !== null} />}
            <BasicKeypad dispatch={dispatch} />
          </section>
          {state.mode === 'advanced' && <HistoryPanel history={state.history} dispatch={dispatch} />}
        </div>

        <details className="install-help">
          <summary>Installera eller använd offline</summary>
          <p>Öppna webbläsarens meny och välj att installera eller lägga till appen på hemskärmen. Efter första fullständiga laddningen fungerar beräkningar och sparade inställningar utan nätverk.</p>
        </details>
      </main>
      <UpdatePrompt />
    </>
  )
}

function displayExpression(expression: string): string {
  return expression.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('pi', 'π').replaceAll('.', ',')
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

function bindKeyboard(dispatch: (action: CalculatorAction) => void): () => void {
  const listener = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    let action: CalculatorAction | null = null
    if (/^[0-9+\-*/^%().,]$/.test(event.key)) action = { type: 'append', value: event.key }
    else if (event.key === 'Enter' || event.key === '=') action = { type: 'evaluate' }
    else if (event.key === 'Backspace') action = { type: 'backspace' }
    else if (event.key === 'Escape' || event.key === 'Delete') action = { type: 'clear' }
    if (action) {
      event.preventDefault()
      dispatch(action)
    }
  }
  window.addEventListener('keydown', listener)
  return () => window.removeEventListener('keydown', listener)
}
