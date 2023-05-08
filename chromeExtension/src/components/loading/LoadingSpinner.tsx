import { useState } from 'react'

import { loadingTips } from './LoadingTips'
import Loading_spinner from '../../assets/logos/nogari_spinner.svg'

import style from '../../styles/LoadingSpinner.module.css'

function LoadingSpinner({ loading_text }: { loading_text: string }) {
  const randomNum = Math.floor(Math.random() * loadingTips.length)
  const [tip, setTip] = useState(loadingTips[randomNum])

  setTimeout(() => {
    const randomNum = Math.floor(Math.random() * loadingTips.length)
    setTip(loadingTips[randomNum])
  }, 7000)

  return (
    <div className={style.Wrapper}>
      <img className={style.BingGleBingGle} src={Loading_spinner} />
      <p className={style.Text}>{loading_text}</p>
      <div>{tip}</div>
    </div>
  )
}

export default LoadingSpinner
