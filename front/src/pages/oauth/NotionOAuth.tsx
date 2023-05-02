import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { axAuth } from '@/apis/axiosInstance'

function NotionOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')

    axAuth({
      method: 'post',
      url: '/oauth/notion',
      data: { code },
    })
      .then((res) => {
        if (res.data.resultCode === 200)
          sessionStorage.setItem('notion', 'true')
      })
      .then(() => navigate('/tistory'))
      .catch((err) => console.log(err))
  }, [])
  return <div>NotionOAuth</div>
}

export default NotionOAuth
