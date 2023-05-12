import Github from '../assets/logos/github-mark.svg'
import Notion from '../assets/logos/Notion-logo.svg'
import Tistory from '../assets/logos/tistory.svg'

// ----------------------------------------------------------------------

export const connectedConfig = (isLogins: {
  notion: boolean
  tistory: boolean
  github: boolean
}) => {
  const { notion, tistory, github } = isLogins
  return [
    {
      title: 'notion',
      path: 'https://www.nogari.me/',
      icon: Notion,
      isLogin: notion,
    },
    {
      title: 'tistory',
      path: 'https://www.nogari.me/',
      icon: Tistory,
      isLogin: tistory,
    },
    {
      title: 'github',
      path: 'https://www.nogari.me/',
      icon: Github,
      isLogin: github,
    },
  ]
}
