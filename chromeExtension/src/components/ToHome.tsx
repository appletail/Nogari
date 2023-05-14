import { useNavigate } from 'react-router'

import previous from '../assets/icons/previous.svg'

function ToHome() {
  const navigate = useNavigate()

  const handleToHome = () => {
    navigate('/')
  }
  return (
    <div style={{ cursor: 'pointer' }} onClick={handleToHome}>
      <img alt="refresh" src={previous} style={{ width: 20, height: 20 }} />
    </div>
  )
}

export default ToHome
