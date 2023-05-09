import { useState, useEffect } from 'react'

import { loadingTips } from './LoadingTips'

import { axBase } from '@/apis/axiosInstance'
import { ReactComponent as Loading_spinner } from '@/assets/logos/nogari_spinner.svg'
import style from '@/styles/components/loading/LoadingSpinner.module.css'

// 팁은 10초마다 바뀌게 하자

function LoadingSpinner() {
  const randomNum = Math.floor(Math.random() * loadingTips.length)
  const [tip, setTip] = useState(loadingTips[randomNum])

  setTimeout(() => {
    const randomNum = Math.floor(Math.random() * loadingTips.length)
    setTip(loadingTips[randomNum])
  }, 7000)

  return (
    <div className={style.Wrapper}>
      <div>
        <Loading_spinner className={style.BingGleBingGle} />
        <p className={style.Text}>잠시만 기다려주세요...</p>
      </div>
      <p className={style.Tips}>{tip}</p>
    </div>
  )
}

export default LoadingSpinner
