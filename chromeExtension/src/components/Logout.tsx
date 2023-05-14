import { useNavigate } from 'react-router'

import { postLogout } from '../apis/apis'
import logout from '../assets/icons/logout.svg'

function Logout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      postLogout()
      localStorage.clear()
      navigate('/index.html')
    } catch (err: any) {
      console.log(err)
    }
  }
  return (
    <div style={{ cursor: 'pointer' }} onClick={handleLogout}>
      <img alt="refresh" src={logout} style={{ width: 20, height: 20 }} />
    </div>
  )
}

export default Logout
