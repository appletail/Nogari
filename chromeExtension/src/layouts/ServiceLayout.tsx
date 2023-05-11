import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { connectedConfig } from './config'
import { axAuth } from '../apis/axiosInstance'
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
    handleRefresh()
  }, [])

  const handleRefresh = () => {
    axAuth({
      url: '/oauth/check',
    })
      .then((res) => {
        const refresh_result = res.data.result
        setIsLogins(refresh_result)
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <p>
        <b>연결된 사이트</b>
      </p>
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
                style={{ width: 40, height: 40, opacity: config.isLogin ? '1' : '0.2' }}
              />
            </a>
          )
        })}
        <div className={style.Refresh} onClick={handleRefresh}>
          <img alt="refresh" src={refresh} style={{ width: 20, height: 20 }} />
        </div>
      </div>
      <hr />
      <Outlet context={isLogins} />
      {loading && <LoadingSpinner />}
    </div>
  )
}

export default ServiceLayout
