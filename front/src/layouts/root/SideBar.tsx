import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// @mui
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import PropTypes from 'prop-types'

// mock
import navConfig from './config'

import account from '@/_mock/account'

// hooks
import { ReactComponent as Logo } from '@/assets/logo/nogari.svg'
import NavSection from '@/components/nav-section'

import Scrollbar from '@/components/scrollbar'

// components
//

// ----------------------------------------------------------------------

const NAV_WIDTH = 280

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}))

// ----------------------------------------------------------------------

export default function Nav() {
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo height={'40px'} width={'40px'} />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar alt="photoURL" src={account.photoURL} />

            <Box sx={{ ml: 2 }}>
              <Typography sx={{ color: 'text.primary' }} variant="subtitle2">
                {account.displayName}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }} variant="body2">
                {account.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />
    </Scrollbar>
  )

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            width: NAV_WIDTH,
            bgcolor: 'background.default',
            borderRightStyle: 'dashed',
          },
        }}
      >
        {renderContent}
      </Drawer>
    </Box>
  )
}
