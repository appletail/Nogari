import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function RootLayout() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Outlet />
    </div>
  )
}

export default RootLayout
