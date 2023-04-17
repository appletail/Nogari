import { useState } from 'react'
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
import InputText from '@/components/input-text/InputText'

function LoginForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  // replace : true 를 적용해서 뒤로가기가 안되게 적용하였습니다.
  const handleClick = () => {
    navigate('/test', { replace: true })
  }
  return (
    <>
      <Stack spacing={3}>
        <TextField label="Email address" name="email" />
        <InputText control={control} name="nickname" />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleClick}
        >
          Login
        </LoadingButton>
      </Stack>

      {/* 여기에 추후 로딩이 들어갑ㄴ디ㅏ. */}
    </>
  )
}

export default LoginForm
