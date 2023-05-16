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
    path: '/github',
    icon: <Github style={{ width: 26, height: 26 }} />,
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

export const settingConfig = [
  {
    title: '공지사항',
    path: '/notice',
    icon: (
      <CampaignOutlinedIcon
        sx={{ width: 50, height: 26.5, paddingLeft: '4px' }}
      />
    ),
  },
  {
    title: '설문조사',
    path: 'https://forms.gle/WeCasb6pJ1LdxkBp8',
    icon: <RateReviewOutlinedIcon sx={{ width: 56, height: 22 }} />,
  },
]
