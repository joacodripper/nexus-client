import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Aplica el tema guardado antes del primer render para evitar el parpadeo
// y para que la clase viva en <html> desde el inicio.
if (localStorage.getItem('nexus-theme') === 'light') {
  document.documentElement.classList.add('light-theme');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
