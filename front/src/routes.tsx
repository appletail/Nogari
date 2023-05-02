import { createBrowserRouter } from 'react-router-dom'

import RegisterLayout from './layouts/register/RegisterLayout'
import RootLayout from './layouts/root/RootLayout'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import NewTistoryPage from './pages/NewTistoryPage'
import GithubOAuth from './pages/oauth/GithubOAuth'
import NotionOAuth from './pages/oauth/NotionOAuth'
import TistoryOAuth from './pages/oauth/TistoryOAuth'
import SignupPage from './pages/SignupPage'
import TistoryPage from './pages/TistoryPage'

const routers = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/test',
        element: <Home />,
      },
      {
        path: '/tistory',
        element: <NewTistoryPage />,
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
  {
    path: '/oauth/notion',
    element: <NotionOAuth />,
  },
  {
    path: '/oauth/tistory',
    element: <TistoryOAuth />,
  },
  {
    path: '/oauth/github',
    element: <GithubOAuth />,
  },
])

export default routers
