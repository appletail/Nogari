import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { axAuth } from '../../apis/axiosInstance'

function TistoryOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')

    axAuth({
      method: 'post',
      url: '/oauth/tistory',
      data: { code },
    })
      .then((res) => {
        if (res.data.resultCode === 200) chrome.storage.sync.set({ tistory: true })
      })
      .then(() => navigate('/'))
      .catch((err) => console.log(err))
  }, [])
  return <div>TistoryOAuth</div>
}

export default TistoryOAuth
