import { axBase } from './axiosInstance'

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
