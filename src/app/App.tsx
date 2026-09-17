import { useEffect, useLayoutEffect, useMemo, useReducer, useState } from 'react'
import { GraphCanvas } from '../calculator/graph/GraphCanvas'
import { sampleGraph } from '../calculator/graph/sampleGraph'
import { DEFAULT_GRAPH_VIEWPORT, isDefaultGraphViewport, panGraphViewport, zoomGraphViewport } from '../calculator/graph/viewport'
import { calculatorReducer, createCalculatorState, type CalculatorAction } from '../calculator/state/calculatorState'
import { AdvancedKeypad } from '../components/AdvancedKeypad'
import { BasicKeypad } from '../components/BasicKeypad'
import { HistoryPanel } from '../components/HistoryPanel'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { loadPersistedState, savePersistedState, type PersistedState } from '../persistence/storage'

export function App() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, () => createCalculatorState(loadPersistedState()))
  const [functionsOpen, setFunctionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [graphViewport, setGraphViewport] = useState(DEFAULT_GRAPH_VIEWPORT)
  const graphActive = containsVariableX(state.expression)
  const graphSample = useMemo(() => {
    if (!graphActive) return null
    try {
      return sampleGraph(state.expression, { ...graphViewport, width: 720 }, state.angleMode)
    } catch {
      return { segments: [], sampleCount: 0 }
    }
  }, [graphActive, graphViewport, state.angleMode, state.expression])
  const persisted = useMemo<PersistedState>(() => ({
    angleMode: state.angleMode,
    memory: state.memory,
    history: state.history,
  }), [state.angleMode, state.memory, state.history])

  useEffect(() => { savePersistedState(persisted) }, [persisted])
  useLayoutEffect(() => bindKeyboard(dispatch), [])

  return (
    <>
      <a className="skip-link" href="#calculator">Hoppa till miniräknaren</a>
      <main className={`app-layout mode-advanced${graphActive ? ' graph-active' : ''}${functionsOpen ? ' functions-open' : ''}`}>
        <div className="workspace">
          <section id="calculator" className="calculator-card" aria-label="Miniräknare">
            <div className="display" role="status" aria-live="polite" aria-atomic="true">
              <span className="expression">{displayExpression(state.expression) || 'Skriv en beräkning'}</span>
              {state.error ? <strong className="error">{state.error}</strong> : <strong className="result">{state.result}</strong>}
            </div>
            <div className="advanced-toolbar">
              <button
                type="button"
                className="panel-toggle functions-toggle"
                aria-expanded={functionsOpen}
                aria-controls="advanced-functions-panel"
                onClick={() => setFunctionsOpen((open) => !open)}
              >
                Funktioner <span aria-hidden="true">{functionsOpen ? '▴' : '▾'}</span>
              </button>
              <button
                type="button"
                className="panel-toggle history-toggle"
                aria-expanded={historyOpen}
                aria-controls="history-panel"
                onClick={() => setHistoryOpen(true)}
              >
                Historik
              </button>
            </div>
            <div id="advanced-functions-panel" className="advanced-panel" data-open={functionsOpen ? 'true' : 'false'}>
              <AdvancedKeypad
                dispatch={dispatch}
                angleMode={state.angleMode}
                hasMemory={state.memory !== null}
                onFunctionChosen={() => setFunctionsOpen(false)}
              />
            </div>
            <BasicKeypad dispatch={dispatch} />
            {graphActive && (
              <p className="graph-portrait-hint" role="status">Grafen visas i landskap.</p>
            )}
            <div className="graph-workspace" aria-hidden={!graphActive}>
              {graphActive && (
                <GraphCanvas
                  expression={state.expression}
                  viewport={graphViewport}
                  segments={graphSample?.segments ?? []}
                  onPan={(deltaPixels, size) => setGraphViewport((viewport) => panGraphViewport(viewport, deltaPixels, size))}
                  onZoom={(factor, anchor) => setGraphViewport((viewport) => zoomGraphViewport(viewport, factor, anchor))}
                  onReset={() => setGraphViewport(DEFAULT_GRAPH_VIEWPORT)}
                  resetDisabled={isDefaultGraphViewport(graphViewport)}
                />
              )}
            </div>
          </section>
        </div>
      </main>
      {historyOpen && (
        <div className="history-overlay">
          <button type="button" className="history-backdrop" aria-label="Stäng historik" onClick={() => setHistoryOpen(false)} />
          <HistoryPanel history={state.history} dispatch={dispatch} onClose={() => setHistoryOpen(false)} />
        </div>
      )}
      <UpdatePrompt />
    </>
  )
}

function containsVariableX(expression: string): boolean {
  return /(^|[^A-Za-z])x([^A-Za-z]|$)/.test(expression)
}

function displayExpression(expression: string): string {
  return expression.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('pi', 'π').replaceAll('.', ',')
}

function bindKeyboard(dispatch: (action: CalculatorAction) => void): () => void {
  const listener = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    let action: CalculatorAction | null = null
    if (/^[0-9+\-*/^%().,x]$/i.test(event.key)) action = { type: 'append', value: event.key.toLowerCase() }
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
