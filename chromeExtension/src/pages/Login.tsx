import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { postEmailLogin } from '../apis/apis'
import style from '../styles/Login.module.css'

function Login() {
  const navigate = useNavigate()
  const [showPasseword, setShowPassword] = useState<'password' | 'text'>('password')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>()

  useEffect(() => {
    if (localStorage.getItem('accessToken')) navigate('/', { replace: true })
  }, [])
  const submitHandler = async (data: Login) => {
    try {
      const response = await postEmailLogin(data)
      // response 요청 성공시
      if (response.data.resultCode === 200) {
        localStorage.setItem('user', response.data.result.email)
        localStorage.setItem('refreshToken', response.data.result.token.refresh_token)
        localStorage.setItem('accessToken', response.data.result.token.access_token)
        navigate('/', { replace: true })
      }
    } catch (error: any) {
      console.log(error)
      alert(error.response.data)
    }
  }

  return (
    <div className={style.Container}>
      <form className={style.LoginForm} onSubmit={handleSubmit(submitHandler)}>
        <input type="email" {...register('email', { required: true })} placeholder="Email" />
        {errors.email && <span>이메일을 입력해주세요.</span>}
        <div>
          <input
            id="password"
            type={showPasseword}
            {...register('password', { required: true })}
            placeholder="Password"
          />
          <label
            htmlFor="password"
            onClick={() => {
              showPasseword === 'password' ? setShowPassword('text') : setShowPassword('password')
            }}
          >
            {showPasseword}
          </label>
        </div>
        {errors.password && <span>비밀번호를 입력해주세요.</span>}

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
