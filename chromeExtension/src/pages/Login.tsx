import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { postEmailLogin } from '../apis/apis'
import closeEye from '../assets/icons/eye_invisible.svg'
import openEye from '../assets/icons/eye_open.svg'
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

  const openLink = () => {
    chrome.tabs.create({ url: 'https://www.nogari.me/signup' })
  }

  return (
    <div className={style.Container}>
      <img className={style.Logo} src="src/assets/logos/NogariLogo.png" />
      <form className={style.LoginForm} onSubmit={handleSubmit(submitHandler)}>
        <div className={style.InputBox}>
          <input
            className={style.HiddenInput}
            type="email"
            {...register('email', { required: true })}
            placeholder="이메일(E-mail)"
          />
        </div>
        {errors.email && <span>이메일을 입력해주세요.</span>}
        <div className={style.InputBox}>
          <input
            className={`${style.HiddenInput} ${style.Password}`}
            id="password"
            type={showPasseword}
            {...register('password', { required: true })}
            placeholder="비밀번호(Password)"
          />
          <label
            htmlFor="password"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              showPasseword === 'password' ? setShowPassword('text') : setShowPassword('password')
            }}
          >
            {showPasseword === 'password' ? (
              <img className={style.ShowPassword} src={closeEye} />
            ) : (
              <img className={style.ShowPassword} src={openEye} />
            )}
          </label>
        </div>
        {errors.password && <span>비밀번호를 입력해주세요.</span>}
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
          <a href="" onClick={openLink}>
            회원가입을 안하셨나요?
          </a>
        </div>
        <button className={style.LoginButton} type="submit">
          로그인
        </button>
      </form>
    </div>
  )
}

export default Login
