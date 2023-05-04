import { axAuth } from './axiosInstance'

export async function postOauthTistory(code: string) {
  const response = await axAuth.post(`/oauth/tistory`, {
    code,
  })
  return response
}
