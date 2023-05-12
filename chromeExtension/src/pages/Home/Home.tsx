import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { checkUrl } from './utils'
import { getLog, postTistory } from '../../apis/apis'
import { loadingInterceptors } from '../../components/loading/LoadingInterceptors'
import LoadingSpinner from '../../components/loading/LoadingSpinner'
import style from '../styles/Home.module.css'

function Home() {
  const navigate = useNavigate()
  const [log, setLog] = useState({
    title: '',
    status: '발행 이력 확인 중',
    responseLink: '발행 이력 없음',
  })
  const { register, handleSubmit, reset } = useForm<Tpost>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    chrome.storage.sync.get([`${user}-tistory-setting`], (saved) => {
      const requestData = {
        ...saved[`${user}-tistory-setting`],
        type: 'html',
        status: '발행요청',
        title: '곧 필요없어질 title 입니다.',
      }
      reset(requestData)
    })

    const logResponse = getLog()
    logResponse
      .then((res) => {
        const data = res.data.result[0][0]
        if (data) {
          const parsedLog = {
            title: data.title,
            status: data.status,
            responseLink: data.responseLink,
          }
          setLog(parsedLog)
        } else {
          setLog((prev) => ({ ...prev, status: '발행 이력 없음' }))
        }
      })
      .catch((err) => console.log(err))
  }, [])

  const PublishHandler = (data: Tpost) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const tab = tabs[0]
      const requestLink = tab.url
      loadingInterceptors(setLoading)
      if (!checkUrl(requestLink)) {
        alert('올바른 notion 페이지에서 발행해주세요.')
        return
      }
      const requestData: Tpost = {
        ...data,
        requestLink: requestLink as string,
      }

      try {
        const response = await postTistory(requestData)
        if (response.data.result.body[0].resultCode === 200) {
          getLog().then((res) => {
            const data = res.data.result[0][0]
            const parsedLog = {
              title: data.title,
              status: data.status,
              responseLink: data.responseLink,
            }
            setLog(parsedLog)
          })
        }
      } catch (err: any) {
        alert('발행에 실패했습니다. 설정을 확인해 주세요.')
      }
    })
  }

  const openLink = () => {
    chrome.tabs.create({ url: log.responseLink })
  }

  return (
    <div>
      <h1>최신 발행 로그</h1>
      <div>
        <h2>
          <span>{log.status} </span>
          <span style={{ cursor: 'pointer', color: 'blue' }} onClick={openLink}>
            {log.title}
          </span>
        </h2>
      </div>
      <form onSubmit={handleSubmit(PublishHandler)}>
        <label htmlFor="tistory-tag">태그 ( , 로 구분합니다.)</label>
        <div>
          <input id="tistory-tag" type="text" {...register('tagList')} />
          <button type="submit">발행하기</button>
        </div>
      </form>
      {loading && <LoadingSpinner />}
    </div>
  )
}

export default Home
