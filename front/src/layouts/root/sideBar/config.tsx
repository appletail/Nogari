// component
import SvgColor from '@/components/svg-color'

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const navConfig = [
  {
    title: 'Tistory',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Github',
    path: '/',
    icon: icon('ic_user'),
  },
  {
    title: 'Velog',
    path: '/',
    icon: icon('ic_cart'),
  },
]

export default navConfig
