import { useOutletContext } from 'react-router-dom'

import GithubSetting from './GithubSetting'
import TistorySettings from './TistorySettings'

function Settings() {
  const connectedSites = useOutletContext<ConnectedSite>()

  return (
    <div>
      <TistorySettings isConnected={connectedSites.tistory} />
      <hr />
      <GithubSetting />
      <hr />
    </div>
  )
}

export default Settings
