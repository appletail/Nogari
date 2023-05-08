import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// import { axAuth } from '@/apis/axiosInstance'
import { postOauthTistory } from '@/apis/OauthApis'

function TistoryOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    ;(async function () {
      if (code) {
        try {
          const response = await postOauthTistory(code)
          console.log(response)
        } catch (error) {
          // console.log(error)
        }
      }
    })()
  }, [searchParams])
  return <div>TistoryOAuth</div>
}

export default TistoryOAuth
