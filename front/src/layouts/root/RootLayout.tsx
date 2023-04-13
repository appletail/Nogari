import React from 'react'
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div>RootLayout
       <Outlet />
    </div>
  )
}

export default RootLayout