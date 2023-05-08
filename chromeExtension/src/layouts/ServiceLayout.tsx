import React from 'react'
import { Outlet } from 'react-router-dom'
;<Outlet />

function ServiceLayout() {
  return (
    <div>
      ServiceLayout
      <Outlet />
    </div>
  )
}

export default ServiceLayout
