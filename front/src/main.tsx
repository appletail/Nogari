import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import routers from './routes'
// theme
import ThemeProvider from './theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <HelmetProvider>
    <ThemeProvider>
      <RouterProvider router={routers} />
    </ThemeProvider>
  </HelmetProvider>
  // </React.StrictMode>
)
