import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '../css/tokens.css'
import '../css/site.css'
import '../css/admin.css'
import '../js/supabase-config.js'
import '../js/backend-client.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
