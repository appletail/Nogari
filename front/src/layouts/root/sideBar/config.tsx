// component
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

import { ReactComponent as Github } from '@/assets/logos/github-mark.svg'
import { ReactComponent as Notion } from '@/assets/logos/Notion-logo.svg'
import { ReactComponent as Tistory } from '@/assets/logos/tistory.svg'
import { ReactComponent as Velog } from '@/assets/logos/velog.svg'

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Tistory',
    path: '/',
    icon: <Tistory style={{ width: 26, height: 26 }} />,
  },
  {
    title: 'Github',
    path: '/',
    icon: <Github style={{ width: 26, height: 26 }} />,
  },
  {
    title: 'Velog',
    path: '/',
    icon: <Velog style={{ width: 26, height: 26, fill: '#20C997' }} />,
  },
]

export const settingConfig = [
  {
    title: 'settings',
    path: '/settings',
    icon: <SettingsOutlinedIcon sx={{ width: 1, height: 1 }} />,
  },
  {
    title: 'Notice',
    path: '/notice',
    icon: <AnnouncementOutlinedIcon sx={{ width: 1, height: 1 }} />,
  },
  {
    title: 'Contact Us',
    path: '/contact-us',
    icon: <AlternateEmailOutlinedIcon sx={{ width: 1, height: 1 }} />,
  },
]

export const connectedConfig = [
  {
    title: 'notion',
    path: '/notion',
    icon: <Notion style={{ width: 35, height: 35 }} />,
    isLogin: true,
  },
  {
    title: 'github',
    path: '/github',
    icon: <Github style={{ width: 35, height: 35 }} />,
    isLogin: false,
  },
  {
    title: 'kakao',
    path: '/kakao',
    icon: <Tistory style={{ width: 35, height: 35 }} />,
    isLogin: false,
  },
  {
    title: 'velog',
    path: '/velog',
    icon: <Velog style={{ width: 35, height: 35, fill: '#20C997' }} />,
    isLogin: false,
  },
]
