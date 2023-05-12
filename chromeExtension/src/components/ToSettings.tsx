import React from 'react'

import { useNavigate } from 'react-router'

import setting from '../assets/icons/setting.svg'

function ToSetting() {
  const navigate = useNavigate()

  const handleToSetting = () => {
    navigate('/settings')
  }
  return (
    <div style={{ cursor: 'pointer' }} onClick={handleToSetting}>
      <img alt="refresh" src={setting} style={{ width: 20, height: 20 }} />
    </div>
  )
}

export default ToSetting
