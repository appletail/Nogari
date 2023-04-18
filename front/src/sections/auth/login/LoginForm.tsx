import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

// @mui
import { LoadingButton } from '@mui/lab'
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'

import Iconify from '@/components/iconify'

// react-hook-form
import InputText from '@/components/input-text/InputText'

interface LoginValue {
  email: string
  password: string
}

function LoginForm() {
  const navigate = useNavigate()

  // form 생성
  const { control, handleSubmit } = useForm<LoginValue>({
    defaultValues: {
      email: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)

  // replace : true 를 적용해서 뒤로가기가 안되게 적용하였습니다.
  const handleLogin = () => {
    navigate('/test', { replace: true })
  }

  // form 제출 handler
  const submitHandler = (data: LoginValue) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack spacing={3}>
          <InputText
            control={control}
            name="email"
            rules={{ required: '이메일을 입력해주세요' }}
            textFieldProps={{
              label: 'Email',
              placeholder: 'ssafy@ssafy.com',
            }}
          />
          <InputText
            control={control}
            name="password"
            rules={{ required: '비밀번호를 입력해주세요' }}
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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Login
          </LoadingButton>
        </Stack>
      </form>
    </>
  )
}

export default LoginForm
