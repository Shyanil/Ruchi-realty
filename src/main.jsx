import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PROJECTS } from './data/projects'
import App from './App'
import '../css/tokens.css'
import '../css/site.css'
import '../css/admin.css'
import '../js/supabase-config.js'
import '../js/backend-client.jsx'

const root = document.getElementById('root')
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}

