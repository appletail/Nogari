import React from 'react'
import { Outlet } from 'react-router-dom'

import { styled } from '@mui/material/styles'

import SideBar from './sideBar/SideBar'

function RootLayout() {
  return (
    <LeftBodyPadding>
      <SideBar />
      <Outlet />
    </LeftBodyPadding>
  )
}

const LeftBodyPadding = styled('div')({
  paddingLeft: '280px',
})

export default RootLayout
