import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from '@/pages/Home'
import '@/styles/index.css'
import { RouterProvider } from 'react-router-dom'
import routers from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <RouterProvider router={routers} />
  </React.StrictMode>,
)
