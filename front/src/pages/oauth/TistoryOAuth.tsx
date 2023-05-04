import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// import { axAuth } from '@/apis/axiosInstance'
import { postOauthTistory } from '@/apis/OauthApis'
const postTistory = async (code: string) => {
  try {
    const response = await postOauthTistory(code)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

function TistoryOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    console.log(code)
    if (code) {
      postTistory(code)
    }
    // axAuth({
    //   method: 'post',
    //   url: '/oauth/tistory',
    //   data: { code },
    // })
    //   .then(() => sessionStorage.setItem('tistory', 'true'))
    //   .then(() => navigate('/tistory'))
    //   .catch((err) => console.log(err))
  }, [])
  return <div>TistoryOAuth</div>
}

export default TistoryOAuth
