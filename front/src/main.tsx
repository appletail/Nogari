import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { RouterProvider } from 'react-router-dom'
import routers from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <RouterProvider router={routers} />
  </React.StrictMode>,
)
