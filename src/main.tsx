import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AppProviders } from './app/AppProviders'
import { EfoodApp } from './ui/EfoodApp'
import '@fontsource/roboto/latin-100.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/roboto/latin-900.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <HashRouter>
        <EfoodApp />
      </HashRouter>
    </AppProviders>
  </React.StrictMode>
)
