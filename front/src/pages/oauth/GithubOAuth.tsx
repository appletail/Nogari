import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { axAuth } from '@/apis/axiosInstance'

function GithubOAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')

    axAuth({
      method: 'post',
      url: '/oauth/git',
      data: { code },
    })
      .then((res) => {
        if (res.data.resultCode === 200)
          sessionStorage.setItem('github', 'true')
      })
      .then(() => navigate('/test'))
      .catch((err) => console.log(err))
  }, [])
  return <div>GithubOAuth</div>
}

export default GithubOAuth
