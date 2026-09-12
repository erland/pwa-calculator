import { useEffect, useState } from 'react'

type UpdateFunction = (reloadPage?: boolean) => Promise<void>

export function UpdatePrompt() {
  const [update, setUpdate] = useState<UpdateFunction | null>(null)

  useEffect(() => {
    const listener = (event: Event) => setUpdate(() => (event as CustomEvent<UpdateFunction>).detail)
    window.addEventListener('calculator-pwa-update', listener)
    return () => window.removeEventListener('calculator-pwa-update', listener)
  }, [])

  if (!update) return null
  return (
    <aside className="update-prompt" aria-live="polite">
      <span>En ny version är klar.</span>
      <button type="button" onClick={() => void update(true)}>Uppdatera</button>
      <button type="button" className="text-button" onClick={() => setUpdate(null)}>Senare</button>
    </aside>
  )
}
