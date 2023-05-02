// @mui
import { useEffect, useState } from 'react'

import { Box, Link, Drawer, Typography, Avatar } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'

// mock
import { navConfig, settingConfig, connectedConfig } from './config'

import { NavContent, NavConnectedSite } from './styles'

import account from '@/_mock/account'

// hooks
import { ReactComponent as Logo } from '@/assets/logos/nogari_spinner.svg'
import ConnectedSection from '@/components/connected-section'
import NavSection from '@/components/nav-section'
import SettingSection from '@/components/setting-section'

// components

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
  const [isLogins, setIsLogins] = useState({
    notion: false,
    tistory: false,
    github: false,
  })

  useEffect(() => {
    const notion = sessionStorage.getItem('notion')
    const tistory = sessionStorage.getItem('tistory')
    const github = sessionStorage.getItem('github')

    const isLogin = {
      notion: notion ? true : false,
      tistory: tistory ? true : false,
      github: github ? true : false,
    }

    setIsLogins(isLogin)
  }, [])

  const renderContent = (
    <>
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
      <NavContent>
        <NavSection data={navConfig} />
        <div>
          <div style={{ padding: '0 22px' }}>
            <p style={{ fontSize: '17px', margin: '5px 0' }}>연결된 사이트</p>
            <NavConnectedSite>
              <ConnectedSection
                data={connectedConfig(
                  isLogins.notion,
                  isLogins.tistory,
                  isLogins.github
                )}
              />
            </NavConnectedSite>
          </div>
          <div
            style={{
              borderBottom: 'solid',
              borderBottomWidth: '1px',
              borderBottomColor: '#E0E4E8',
              margin: '15px 22px 0 22px',
            }}
          ></div>
          <SettingSection data={settingConfig} />
        </div>
      </NavContent>
    </>
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
