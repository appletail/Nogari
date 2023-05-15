// component
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'

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
    title: '개인정보 처리방침',
    path: '/privacy',
    icon: <CampaignOutlinedIcon sx={{ width: 1, height: 1 }} />,
  },
  {
    title: '설문조사',
    path: 'https://forms.gle/WeCasb6pJ1LdxkBp8',
    icon: <RateReviewOutlinedIcon sx={{ width: 1, height: 1 }} />,
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
