import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { setupPwa } from './pwa/setupPwa'
import './styles/app.css'
import './styles/system-theme.css'
import './styles/advanced-responsive.css'
import './styles/advanced-tablet-compact.css'
import './styles/landscape-safe-area.css'
import './styles/compact-portrait.css'

setupPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
