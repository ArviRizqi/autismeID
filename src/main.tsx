import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { A11yProvider } from './hooks/useA11y'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <A11yProvider>
        <App />
      </A11yProvider>
    </BrowserRouter>
  </StrictMode>,
)
