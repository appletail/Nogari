import { useState, useEffect } from 'react'
import { Outlet, useOutlet } from 'react-router-dom'

import { connectedConfig } from './config'
import { getConnectedSite } from '../apis/apis'
import refresh from '../assets/icons/refresh.svg'

import LoadingSpinner from '../components/loading'
import { loadingInterceptors } from '../components/loading/LoadingInterceptors'
import Logout from '../components/Logout'
import ToHome from '../components/ToHome'
import ToSetting from '../components/ToSettings'
import style from '../styles/ServiceLayout.module.css'

function ServiceLayout() {
  const [isLogins, setIsLogins] = useState({
    notion: false,
    tistory: false,
    github: false,
  })

  const [loading, setLoading] = useState(false)
  const outlet = useOutlet()

  useEffect(() => {
    loadingInterceptors(setLoading)
    handleRefresh()
  }, [])

  const handleRefresh = async () => {
    try {
      const response = await getConnectedSite()
      const refresh_result = response.data.result
      setIsLogins(refresh_result)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className={style.TitleNav}>
        <p>
          <b>연결된 사이트</b>
        </p>
        <div className={style.Nav}>
          {outlet?.props.children.props.match.pathname === '/' ? <ToSetting /> : <ToHome />}
          <Logout />
        </div>
      </div>
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
