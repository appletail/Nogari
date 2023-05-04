import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.css'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.append(root)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
