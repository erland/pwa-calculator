import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('Calculator UI', () => {
  it('completes the simple calculation flow', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'Addition' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'Beräkna' }))
    expect(screen.getByRole('status')).toHaveTextContent('19')
    expect(screen.queryByRole('region', { name: 'Avancerade funktioner' })).not.toBeInTheDocument()
  })

  it('supports advanced functions, history and memory', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Avancerad' }))
    await user.click(screen.getByRole('button', { name: 'sin' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: ')' }))
    await user.click(screen.getByRole('button', { name: 'Beräkna' }))
    expect(screen.getByRole('status')).toHaveTextContent('0,5')

    await user.click(screen.getByRole('button', { name: 'Historik' }))
    const historyDialog = screen.getByRole('dialog', { name: 'Historik' })
    expect(within(historyDialog).getByRole('button', { name: /Återanvänd resultatet 0,5/ })).toBeInTheDocument()
    await user.click(within(historyDialog).getByRole('button', { name: 'Stäng historik' }))

    await user.click(screen.getByRole('button', { name: 'M+' }))
    expect(screen.getByText('M')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'MC' }))
    expect(screen.queryByText('M')).not.toBeInTheDocument()
  })

  it('supports keyboard input and recovers from mathematical errors', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('1/0{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent(/dividera med noll/)
    await user.keyboard('{Escape}7*8{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent('56')
  })

  it('persists theme selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tema' }), 'dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('calculator-pwa:v1')).toContain('"theme":"dark"')
  })

  it('has no automatically detectable accessibility violations in its main views', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    expect((await axe.run(container)).violations).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Avancerad' }))
    expect((await axe.run(container)).violations).toEqual([])
  })
})
