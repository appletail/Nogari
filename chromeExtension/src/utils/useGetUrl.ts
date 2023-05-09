import { useState } from 'react'

export const useGetUrl = () => {
  const [url, setUrl] = useState<string | undefined>('')

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0]
    setUrl(tab.url)
  })

  return url
}