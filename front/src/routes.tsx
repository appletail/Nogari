import { createBrowserRouter } from 'react-router-dom'

import RegisterLayout from './layouts/register/RegisterLayout'
import RootLayout from './layouts/root/RootLayout'
import GithubChart from './pages/charts/GithubChart'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

const routers = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/test',
        element: <Home />,
      },
      {
        path: '/github',
        element: <GithubChart />,
      },
    ],
  },
  {
    element: <RegisterLayout />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
])

export default routers
