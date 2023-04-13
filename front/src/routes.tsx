import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/root/RootLayout'
import RegisterLayout from './layouts/register/RegisterLayout'
import Home from './pages/Home'
import Login from './pages/Login'



const routers = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/test',
        element: <Home />,
      },
    ],
  },
  {
    element: <RegisterLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      
    ],
  },
])

export default routers