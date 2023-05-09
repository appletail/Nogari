import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { postOauthNotion } from '@/apis/OauthApis'

function NotionOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    ;(async function () {
      if (code) {
        try {
          const response = await postOauthNotion(code)
          console.log('======success======')
          console.log(response)
          const resultCode = response.data.resultCode
          if (resultCode === 200) {
            alert('노션 연동이 완료되었습니다.')
            sessionStorage.setItem('notion', 'true')
            navigate('/tistory')
          }
        } catch (error) {
          console.log('======error======')
          console.log(error)
        }
      }
    })()
  }, [searchParams])
  return <></>
}

export default NotionOAuth
