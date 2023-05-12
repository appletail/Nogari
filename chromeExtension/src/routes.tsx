import { createBrowserRouter } from 'react-router-dom'

import RootLayout from './layouts/RootLayout'
import ServiceLayout from './layouts/ServiceLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Settings from './pages/Settings'

const routers = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ServiceLayout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/settings',
            element: <Settings />,
          },
        ],
      },
      {
        path: '/index.html',
        element: <Login />,
      },
    ],
  },
])

export default routers
