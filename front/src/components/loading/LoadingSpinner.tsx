import { useState, useEffect } from 'react'

import { axBase } from '@/apis/axiosInstance'
import { ReactComponent as Loading_spinner } from '@/assets/logos/nogari_spinner.svg'
import style from '@/styles/components/loading/LoadingSpinner.module.css'

function LoadingSpinner() {
  return (
    <div className={style.Wrapper}>
      <Loading_spinner className={style.BingGleBingGle} />
      <p className={style.Text}>발행 중입니다...</p>
    </div>
  )
}

export default LoadingSpinner
