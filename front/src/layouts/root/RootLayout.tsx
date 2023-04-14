import React from 'react'
import { Outlet } from 'react-router-dom'

import SideBar from './SideBar'

function RootLayout() {
  return (
    <div>
      <SideBar />
      <Outlet />
    </div>
  )
}

export default RootLayout
