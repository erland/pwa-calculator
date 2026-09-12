import type { CalculatorAction } from '../calculator/state/calculatorState'
import type { HistoryEntry } from '../persistence/storage'

interface Props {
  history: HistoryEntry[]
  dispatch: (action: CalculatorAction) => void
}

export function HistoryPanel({ history, dispatch }: Props) {
  return (
    <aside className="history-panel" aria-labelledby="history-heading">
      <div className="history-heading-row">
        <h2 id="history-heading">Historik</h2>
        {history.length > 0 && <button type="button" className="text-button" onClick={() => dispatch({ type: 'clear-history' })}>Rensa</button>}
      </div>
      {history.length === 0 ? <p className="empty-state">Dina avancerade beräkningar visas här.</p> : (
        <ol className="history-list">
          {history.map((entry) => (
            <li key={entry.id}>
              <button type="button" onClick={() => dispatch({ type: 'reuse-history', entry })} aria-label={`Återanvänd resultatet ${entry.result} från ${entry.expression}`}>
                <span>{displayExpression(entry.expression)}</span>
                <strong>= {entry.result}</strong>
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

function displayExpression(expression: string): string {
  return expression.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('pi', 'π')
}
