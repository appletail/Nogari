// @mui
import { Box } from '@mui/material'

import { StyledConnectedItem, StyledConnectedItemIcon } from './styles'

// ----------------------------------------------------------------------
interface ConnectedConfig {
  title: string
  path: string
  icon?: JSX.Element
  isLogin: boolean
}

export default function Section({
  data = [],
  ...other
}: {
  data: ConnectedConfig[]
}) {
  return (
    <Box
      {...other}
      sx={{ display: 'flex', justifyContent: 'start', gap: '15px' }}
    >
      {data.map((item) => (
        <SettingItem key={item.title} item={item} />
      ))}
    </Box>
  )
}

// ----------------------------------------------------------------------

function SettingItem({ item }: { item: ConnectedConfig }) {
  const { icon, isLogin } = item

  return (
    <StyledConnectedItem>
      <StyledConnectedItemIcon sx={{ opacity: isLogin ? '1' : '0.2' }}>
        {icon && icon}
      </StyledConnectedItemIcon>
    </StyledConnectedItem>
  )
}
