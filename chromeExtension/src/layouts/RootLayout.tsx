import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function RootLayout() {
  const navigate = useNavigate()
  const [showLink, setShowLink] = useState(true)

  let keydown = false
  window.addEventListener('keyup', (e) => {
    if (keydown) return
    else {
      if (e.key === 'F2') {
        setShowLink(!showLink)
        keydown = true
      }
    }
  })

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {showLink && (
        <div>
          <p>바로가기 개발 끝내면 삭제할 것 (단축키 &apos;F2&apos;)</p>
          <button type="button" onClick={() => navigate('/index.html')}>
            Login
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Home
          </button>
          <button type="button" onClick={() => navigate('/settings')}>
            Settings
          </button>
        </div>
      )}
      <Outlet />
    </div>
  )
}

export default RootLayout
