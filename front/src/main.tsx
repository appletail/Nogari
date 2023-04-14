import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { RouterProvider } from 'react-router-dom'
import routers from './routes'
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
  <HelmetProvider>
     <RouterProvider router={routers} />
  </HelmetProvider>
  </React.StrictMode>,
)
