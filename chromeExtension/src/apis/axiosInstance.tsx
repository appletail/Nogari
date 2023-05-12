import axios from 'axios'

import { BASE_URL } from './urls'

// 단순 get요청으로 인증값이 필요없는 경우
export const axBase = axios.create({ baseURL: BASE_URL })

// post, delete등 api요청 시 인증값이 필요한 경우
export const axAuth = axios.create({
  baseURL: BASE_URL,
})

// refresh token 으로 갱신 필요한 경우
function postRefreshToken() {
  const response = axBase.post('/members/refresh', {
    access_token: localStorage.getItem('accessToken'),
    refresh_token: localStorage.getItem('refreshToken'),
  })
  return response
}

axAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error.response)
)

axAuth.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error
    const originRequest = config
    if (status === 401) {
      try {
        const tokenResponse = await postRefreshToken()
        const responseCode = tokenResponse.data.resultCode

        // refresh token이 유효한 경우, refresh token으로 access token 재발급
        if (responseCode === 200) {
          const newAccessToken = tokenResponse.data.result.access_token
          localStorage.setItem('accessToken', tokenResponse.data.result.access_token)
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axios(originRequest)
        }

        // refresh token이 만료되어 다시 로그인이 필요함
        else if (responseCode === 408) {
          alert('로그아웃되었습니다. 다시 로그인해 주십시오.')
          localStorage.clear()
          window.location.replace('/index.html')
        }
      } catch (error) {
        // console.log('=======axios error==========')
        console.log(error)
      }
    }

    return Promise.reject(error.response)
  }
)
