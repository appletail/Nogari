import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { connectedConfig } from './config'
import refresh from '../assets/refresh.svg'

import LoadingSpinner from '../components/loading'
import { loadingInterceptors } from '../components/loading/LoadingInterceptors'
import style from '../styles/ServiceLayout.module.css'

function ServiceLayout() {
  const [isLogins, setIsLogins] = useState({
    notion: false,
    tistory: false,
    github: false,
  })

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadingInterceptors(setLoading)
  }, [])

  useEffect(() => {
    chrome.storage.sync.get(['notion', 'tistory', 'github'], (storage) => {
      const isLogin = {
        notion: storage.notion ? true : false,
        tistory: storage.tistory ? true : false,
        github: storage.github ? true : false,
      }
      setIsLogins(isLogin)
    })
  }, [])

  const handleRefresh = () => {
    console.log('빠르게 해보자')
  }

  return (
    <div>
      <div className={style.Icons}>
        {connectedConfig(isLogins).map((config) => {
          return (
            <a
              key={config.title}
              className={style.Icon}
              href={config.path}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt={config.title}
                src={config.icon}
                style={{ width: 50, height: 50, opacity: config.isLogin ? '1' : '0.2' }}
              />
            </a>
          )
        })}
        <div className={style.Refresh} onClick={handleRefresh}>
          <img alt="refresh" src={refresh} />
        </div>
      </div>
      <hr />
      <Outlet />
      {loading && <LoadingSpinner loading_text="토큰을 불러오는 중입니다..." />}
    </div>
  )
}

export default ServiceLayout
