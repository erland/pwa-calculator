import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  label?: string
  value?: string
  variant?: 'number' | 'operator' | 'action' | 'equals' | 'function'
  wide?: boolean
  onPress: (value?: string) => void
}

export function CalculatorButton({ children, label, value, variant = 'number', wide = false, onPress }: Props) {
  return (
    <button
      type="button"
      className={`calculator-key key-${variant}${wide ? ' key-wide' : ''}`}
      aria-label={label}
      onClick={() => onPress(value)}
    >
      {children}
    </button>
  )
}
