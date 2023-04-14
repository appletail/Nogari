import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/root/RootLayout'
import RegisterLayout from './layouts/register/RegisterLayout'
import Home from './pages/Home'
import Login from './pages/LoginPage'



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
        path: '/',
        element: <Login />,
      },
      
    ],
  },
])

export default routers