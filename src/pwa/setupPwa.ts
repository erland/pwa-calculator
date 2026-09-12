import { registerSW } from 'virtual:pwa-register'

export function setupPwa(): void {
  if (!('serviceWorker' in navigator)) return
  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent('calculator-pwa-update', { detail: updateServiceWorker }))
    },
  })
}
