import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { checkUrl } from './utils'
import style from '../../../src/styles/Home.module.css'
import { getLog, postTistory } from '../../apis/apis'

function Home() {
  const [log, setLog] = useState({
    title: '',
    status: '발행 이력 확인 중',
    responseLink: '발행 이력 없음',
    date: '',
  })
  const { register, handleSubmit, reset } = useForm<Tpost>()

  useEffect(() => {
    const user = localStorage.getItem('user')
    chrome.storage.sync.get([`${user}-tistory-setting`], (saved) => {
      const requestData = {
        ...saved[`${user}-tistory-setting`],
        type: 'html',
        status: '발행요청',
      }
      reset(requestData)
    })

    const logResponse = getLog()
    logResponse
      .then((res) => {
        const data = res.data.result[0][0]
        if (data) {
          const date = new Date(data.modifiedDate)
          const parsedLog = {
            title: data.title,
            status: data.status,
            responseLink: data.responseLink,
            date: date.toISOString().split('T')[0] + ' / ' + date.toTimeString().split(' ')[0],
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
            const date = new Date(data.modifiedDate)
            date.setHours(date.getHours() + 9)
            const parsedLog = {
              title: data.title,
              status: data.status,
              responseLink: data.responseLink,
              date: date.toISOString().split('T')[0] + ' / ' + date.toTimeString().split(' ')[0],
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
      <div className={style.TitleText} style={{ marginBottom: '9px' }}>
        최근 발행 이력
      </div>

      <div className={style.PostBox} style={{ fontWeight: 'bold', marginBottom: '30px' }}>
        {log.date ? (
          <>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '14px', whiteSpace: 'nowrap', marginRight: '7px' }}>
                {log.status}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={style.OpenLink} onClick={openLink}>
                  {log.title.length > 26 ? log.title.substr(0, 24).trim() + '...' : log.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#A5A5A5' }}>{log.date}</div>
              </div>
            </div>
          </>
        ) : (
          <div className={style.LogText}>{log.status}</div>
        )}
      </div>

      <div>
        <div className={style.TitleText} style={{ marginBottom: '9px' }}>
          간편 발행
        </div>
        <form onSubmit={handleSubmit(PublishHandler)}>
          {/* <label htmlFor="tistory-tag">태그 ( , 로 구분합니다.)</label> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <input
              id="tistory-tag"
              type="text"
              {...register('tagList')}
              className={style.TagInput}
              placeholder="태그를 입력해주세요."
              style={{}}
            />
            <button className={style.postButton} type="submit">
              발행하기
            </button>
          </div>
          <label htmlFor="tistory-tag" style={{ fontSize: '12px', color: 'gray' }}>
            각 태그는 쉼표(,)로 구분됩니다.
          </label>
        </form>
      </div>
    </div>
  )
}

export default Home
