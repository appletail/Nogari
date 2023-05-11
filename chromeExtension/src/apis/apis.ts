import { axAuth, axBase } from './axiosInstance'


// 회원 관리

// 회원가입 이메일 중복확인 api
export async function getCheckEmail(email: string) {
  const response = await axBase.get(`/members/duplicate`, {
    params: {
      email,
    },
  })
  return response
}

// 회원가입 api
export async function postRegister({ email, password }: Login) {
  const response = await axBase.post(`/members/signup`, {
    email,
    password,
  })
  return response
}
// 로그인(Sign in) api
export async function postEmailLogin({ email, password }: Login) {
  const response = await axBase.post(`/members/login`, {
    email,
    password,
  })
  return response
}


// 사이트 연결
export async function getConnectedSite() {
  const response = await axAuth({ url: '/oauth/check', })

  return response

}


// tistory
export async function getBlogNames() {
  const response = await axAuth({
    method: 'post',
    url: '/contents/tistory',
    data: {
      lastTistoryId: -1,
      pageSize: 1,
    },
  })

  return response
}