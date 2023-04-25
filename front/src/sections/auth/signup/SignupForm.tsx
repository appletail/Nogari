import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

// @mui
import { LoadingButton } from '@mui/lab'
import { Stack, IconButton, InputAdornment } from '@mui/material'

import Iconify from '@/components/iconify'

// react-hook-form
import InputText from '@/components/input-text/InputText'

interface LoginValue {
  email: string
  password: string
  passwordConfirm: string
}

// 이메일 & 비밀번호 유효성 검사 형식
const Regex = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/,
}

function SignupForm() {
  const navigate = useNavigate()

  // form 생성
  const { watch, control, handleSubmit } = useForm<LoginValue>({
    mode: 'all',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // replace : true 를 적용해서 뒤로가기가 안되게 적용하였습니다.
  // form 제출 handler
  const submitHandler = (data: LoginValue) => {
    console.log(data)
    navigate('/test', { replace: true })
  }

  const checkpassword = (val: string) => {
    if (watch('password') != val) {
      return '비밀번호가 일치하지 않습니다.'
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack spacing={3}>
          <InputText
            control={control}
            defaultValue=""
            name="email"
            rules={{
              required: '이메일을 입력해주세요',
              pattern: {
                value: Regex.email,
                message: '이메일 형식을 입력해주세요',
              },
            }}
            textFieldProps={{
              label: 'Email',
            }}
          />
          <InputText
            control={control}
            defaultValue=""
            name="password"
            rules={{
              required: '비밀번호를 입력해주세요',
              pattern: {
                value: Regex.password,
                message: '대문자, 숫자, 특수문자를 포함해 8자 이상입력해주세요',
              },
            }}
            textFieldProps={{
              label: 'Password',
              type: `${showPassword ? 'text' : 'password'}`,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Iconify
                        icon={
                          showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <InputText
            control={control}
            defaultValue=""
            name="passwordConfirm"
            rules={{
              required: '비밀번호를 입력해주세요',
              validate: { check: checkpassword },
            }}
            textFieldProps={{
              label: 'Password Confirm',
              type: `${showPasswordConfirm ? 'text' : 'password'}`,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                    >
                      <Iconify
                        icon={
                          showPasswordConfirm
                            ? 'eva:eye-fill'
                            : 'eva:eye-off-fill'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Sign up
          </LoadingButton>
        </Stack>
      </form>
    </>
  )
}

export default SignupForm
