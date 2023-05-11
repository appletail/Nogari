import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { axAuth } from '../../apis/axiosInstance'
import style from '../../styles/Settings.module.css'

function TistorySettings({ isConnected }: { isConnected: boolean }) {
  const [defaultSettings, setDefaultSettings] = useState<TistorySetting>({
    blogName: '',
    categoryName: {
      id: 0,
      name: '',
    },
    visibility: 3,
  })
  const [user, setUser] = useState<string | null>()
  const [blogNames, setBlogNames] = useState<string[]>(['asdfasdf'])
  const [categories, setCategories] = useState<Tcategory[]>([{ id: 0, name: 'asdf' }])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TistorySetting>()

  useEffect(() => {
    const email = localStorage.getItem('user')
    setUser(email)

    if (isConnected) {
      axAuth({
        url: '/contents/tistory',
        params: {
          lastTistoryId: -1,
          pageSize: 1,
        },
      }).then((res) => {
        const blogName = res.data.result[1]
        const category = res.data.result[2]
        setBlogNames(blogName)
        setCategories(category)
      })
    }
  }, [])

  useEffect(() => {
    const set = localStorage.getItem(`${user}-tistory-setting`)
    if (set) {
      const tmp = JSON.parse(set)
      setDefaultSettings(tmp)
    }
  }, [user, defaultSettings])

  const tistoryHandler = (data: TistorySetting) => {
    localStorage.setItem(`${user}-tistory-setting`, JSON.stringify(data))
  }

  return (
    <form style={{ position: 'relative' }} onSubmit={handleSubmit(tistoryHandler)}>
      {isConnected && <div className={style.Wrapper}>티스토리와 연결해 주세요.</div>}
      <div>
        <p>Tistory</p>
        <div>
          <label htmlFor="T-blogName">블로그 선택</label>
          <select id="T-blogName" {...register('blogName', { required: true })}>
            {blogNames.map((elem, idx) => {
              return (
                <option key={`${elem}-${idx}`} value={elem}>
                  {elem}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label htmlFor="T-visibility">공개여부</label>
          <select
            defaultValue={defaultSettings.visibility}
            id="T-visibility"
            {...register('visibility', { required: true })}
          >
            <option value="3">공개</option>
            <option value="0">비공개</option>
          </select>
        </div>
        <div>
          <label htmlFor="T-categoryName">카테고리</label>
          <select id="T-categoryName" {...register('categoryName', { required: true })}>
            {categories.map((elem, idx) => {
              return (
                <option key={`${elem.id}-${idx}`} value={elem.id}>
                  {elem.name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <button type="submit">티스토리 설정하기</button>
    </form>
  )
}

export default TistorySettings
