import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getDeepLinkUrlParam } from './lib/deepLink'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// A deep link prefills the input, which the prerendered markup can't match,
// so those visits render fresh instead of hydrating.
if (container.hasChildNodes() && getDeepLinkUrlParam() === null) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
