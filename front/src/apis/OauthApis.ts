import { axAuth } from './axiosInstance'

export async function postOauthTistory(code: string) {
  const response = await axAuth.post(`/oauth/tistory`, {
    code,
  })
  return response
}

export async function postOauthNotion(code: string) {
  const response = await axAuth.post(`/oauth/notion`, {
    code,
  })
  return response
}
