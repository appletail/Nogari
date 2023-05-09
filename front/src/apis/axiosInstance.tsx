import axios, { AxiosInstance } from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}` // 로컬 서버

// 단순 get요청으로 인증값이 필요없는 경우
export const axBase = axios.create({ baseURL: BASE_URL })

// post, delete등 api요청 시 인증값이 필요한 경우
export const axAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
  },
})

// refresh token 으로 갱신 필요한 경우
function postRefreshToken() {
  const response = axBase.post('/members/refresh', {
    access_token: sessionStorage.getItem('accessToken'),
    refresh_token: sessionStorage.getItem('refreshToken'),
  })
  return response
}

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
        console.log('----------------------------------')
        console.log(tokenResponse)
        console.log('------------------------------------')
        // const resultCode = tokenResponse.data.resultCode

        const newAccessToken = tokenResponse.data.result.access_token
        sessionStorage.setItem(
          'accessToken',
          tokenResponse.data.result.access_token
        )
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(originRequest)
      } catch (error) {
        console.log(error)
      }
    }

    return Promise.reject(error.response)
  }
)
