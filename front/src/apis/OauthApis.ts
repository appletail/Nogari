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

export async function postOauthGit(code: string) {
  const response = await axAuth.post('/oauth/git', {
    code,
  })
  return response
}

export async function getOauthStatus() {
  const response = await axAuth.get('/oauth/check')
  return response
}
