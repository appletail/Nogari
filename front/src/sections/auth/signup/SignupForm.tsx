import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
// components
import Iconify from '@/components/iconify';


export default function SignupForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // replace : true 를 적용해서 뒤로가기가 안되게 적용하였습니다.
  const handleClick = () => {
    navigate('/test', { replace: true });
  };
  return (
    <>
    <Stack spacing={3}>
      <TextField name="email" label="Email address" />

      <TextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>

    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
      <Checkbox name="remember" label="Remember me" />
      <Link variant="subtitle2" underline="hover">
        Forgot password?
      </Link>
    </Stack>

  {/* 여기에 추후 로딩이 들어갑ㄴ디ㅏ. */}
  </>
  )
}

