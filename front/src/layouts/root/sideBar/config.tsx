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
    path: '/test',
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
      path: 'https://api.notion.com/v1/oauth/authorize?client_id=09796e64-c53d-4b97-8973-5bf3e30001ab&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fnotion',
      icon: <Notion style={{ width: 35, height: 35 }} />,
      isLogin: notion,
    },
    {
      title: 'tistory',
      path: 'https://www.tistory.com/oauth/authorize?client_id=5a77675830875a386851cff97b00e984&redirect_uri=https://localhost:3000/oauth/tistory&response_type=code',
      icon: <Tistory style={{ width: 35, height: 35 }} />,
      isLogin: tistory,
    },
    {
      title: 'github',
      path: 'https://github.com/login/oauth/authorize?scope=repo,user&client_id=7e06fc5ef20cdc465a15',
      icon: <Github style={{ width: 35, height: 35 }} />,
      isLogin: github,
    },
  ]
}
