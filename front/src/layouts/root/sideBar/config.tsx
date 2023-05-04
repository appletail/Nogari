// component
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

import { ReactComponent as Github } from '@/assets/logos/github-mark.svg'
import { ReactComponent as Notion } from '@/assets/logos/Notion-logo.svg'
import { ReactComponent as Tistory } from '@/assets/logos/tistory.svg'

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Tistory',
    path: '/tistory',
    icon: <Tistory style={{ width: 26, height: 26 }} />,
  },
  {
    title: 'Github',
    path: '/',
    icon: <Github style={{ width: 26, height: 26 }} />,
  },
]

export const settingConfig = [
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

export const connectedConfig = (
  notion: boolean,
  tistory: boolean,
  github: boolean
) => {
  return [
    {
      title: 'notion',
      path: `${import.meta.env.VITE_NOTION_OAUTH_URL}`,
      icon: <Notion style={{ width: 35, height: 35 }} />,
      isLogin: notion,
    },
    {
      title: 'tistory',
      path: `${import.meta.env.VITE_TISTORY_OAUTH_URL}`,
      icon: <Tistory style={{ width: 35, height: 35 }} />,
      isLogin: tistory,
    },
    {
      title: 'github',
      path: `${import.meta.env.VITE_GITHUB_OAUTH_URL}`,
      icon: <Github style={{ width: 35, height: 35 }} />,
      isLogin: github,
    },
  ]
}
