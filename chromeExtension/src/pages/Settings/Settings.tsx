import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'

import TistorySettings from './TistorySettings'
import { axAuth } from '../../apis/axiosInstance'
import style from '../../styles/Settings.module.css'

function Settings() {
  const connectedSites = useOutletContext<ConnectedSite>()

  return (
    <div>
      <TistorySettings isConnected={connectedSites.tistory} />

      <hr />
      <div style={{ position: 'relative' }}>
        <div className={style.Wrapper}>깃허브와 연결해 주세요.</div>
        <p>Gihub</p>
        <div>
          <label htmlFor="T-blog">블로그 선택</label>
          <input id="T-blog" type="text" />
        </div>
        <div>
          <label htmlFor="T-visibility">공개여부</label>
          <input id="T-visibility" type="text" />
        </div>
        <div>
          <label htmlFor="T-category">카테고리</label>
          <input id="T-category" type="text" />
        </div>
      </div>
      <hr />
    </div>
  )
}

export default Settings
