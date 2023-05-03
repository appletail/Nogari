import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { styled } from '@mui/material/styles'

import SideBar from './sideBar/SideBar'

import LoadingSpinner from '@/components/loading'
import { loadingInterceptors } from '@/components/loading/LoadingInterceptors'

function RootLayout() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadingInterceptors(setLoading)
  }, [])

  return (
    <>
      <LeftBodyPadding>
        <SideBar />
        <Outlet />
      </LeftBodyPadding>
      {loading && <LoadingSpinner />}
    </>
  )
}

const LeftBodyPadding = styled('div')({
  paddingLeft: '280px',
})

export default RootLayout
