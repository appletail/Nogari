import { axAuth, axBase } from './axiosInstance'


// Login

// 회원가입 이메일 중복확인
export async function getCheckEmail(email: string) {
  const response = await axBase.get(`/members/duplicate`, {
    params: {
      email,
    },
  })
  return response
}
// 회원가입
export async function postRegister({ email, password }: Login) {
  const response = await axBase.post(`/members/signup`, {
    email,
    password,
  })
  return response
}
// 로그인(Sign in)
export async function postEmailLogin({ email, password }: Login) {
  const response = await axBase.post(`/members/login`, {
    email,
    password,
  })
  return response
}
// 로그아웃
export async function postLogout() {
  const response = await axAuth({
    method: 'post',
    url: '/members/logout',
    data: {
      access_token: localStorage.getItem('accessToken'),
      refresh_token: localStorage.getItem('refreshToken')
    }
  })

  return response
}

// Settings

// 사이트 연결
export async function getConnectedSite() {
  const response = await axAuth({ url: '/oauth/check', })

  return response

}
// tistory
export async function getBlogInfos() {
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


// Home

// 게시글 발행
export async function postTistory(data: Tpost) {
  const response = await axAuth({
    method: 'post',
    url: '/contents/post',
    data: [data]
  })

  return response
}
// 최신 발행 현황
export async function getLog() {
  const response = await axAuth({
    method: 'post',
    url: '/contents/tistory',
    data: {
      lastTistoryId: -1,
      pageSize: 1,
      filter: '최신순'
    },
  })

  return response
}