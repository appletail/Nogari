import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { sortCategory } from './utils'
import { getBlogNames } from '../../../apis/apis'
import style from '../../../styles/Settings.module.css'

// 블로그 변경 시 그게 몇 번째 블로그인지 확인
// 블로그 존재하는지 확인 몇 번째 블로그의 카테고리 이름이 같은지

function TistorySettings({ isConnected }: { isConnected: boolean }) {
  const [settings, setSettings] = useState<TistorySetting>({
    blogName: '',
    categoryName: '',
    visibility: '3',
  })
  const [user, setUser] = useState<string | null>()
  const [blogNames, setBlogNames] = useState<string[]>([''])
  const [categories, setCategorries] = useState<Tcategory[]>([{ id: '', name: '', label: '' }])
  const [categoryList, setCategoryList] = useState<Tcategory[][]>([[]])
  const { register, handleSubmit, reset } = useForm<TistorySetting>()

  // 기본 세팅
  useEffect(() => {
    const email = localStorage.getItem('user')
    setUser(email)

    if (isConnected) {
      const response = getBlogNames()
      response
        .then((res) => {
          const blogName = res.data.result[1]
          setBlogNames(blogName ? blogName : [])

          const category = res.data.result[2]
          setCategoryList(category)

          const sortedCategory = sortCategory(category[0])
          setCategorries(sortedCategory)
        })
        .catch((err) => console.log(err))
    }
  }, [isConnected])

  // 저장된 세팅 불러오기
  useEffect(() => {
    chrome.storage.sync.get([`${user}-tistory-setting`], (data) => {
      const synced: TistorySetting = data[`${user}-tistory-setting`]
      if (synced) {
        const blogIdx = blogNames.indexOf(synced.blogName)
        const category = categoryList[blogIdx]
        if (blogIdx !== -1) {
          setSettings((prev) => ({ ...prev, blogName: synced.blogName }))
          setCategorries(category)
          if (category.find((elem) => elem.id === synced.categoryName)) {
            setSettings((prev) => ({ ...prev, categoryName: synced.categoryName }))
          } else {
            if (category[0]) setSettings((prev) => ({ ...prev, categoryName: category[0].id }))
          }
        }
        setSettings((prev) => ({ ...prev, visibility: synced.visibility }))
      } else {
        setSettings((prev) => ({
          ...prev,
          blogName: blogNames[0],
          categoryName: categories[0].id,
          visibility: '3',
        }))
      }
    })
  }, [user, categoryList, blogNames])

  // 세팅과 hook-form 연결
  useEffect(() => {
    reset(settings)
  }, [reset, settings])

  // 블로그 변경시 카테고리 변경
  const changeBlog = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const blogName = e.target.value
    const blogIdx = blogNames.indexOf(blogName)
    setCategorries(categoryList[blogIdx])
    setSettings((prev) => ({ ...prev, blogName }))
  }

  // 설정 저장
  const tistoryHandler = (data: TistorySetting) => {
    chrome.storage.sync.set({ [`${user}-tistory-setting`]: data })
  }

  return (
    <form style={{ position: 'relative' }} onSubmit={handleSubmit(tistoryHandler)}>
      {!isConnected && <div className={style.Wrapper}>티스토리와 연결해 주세요.</div>}
      <div>
        <p>Tistory</p>
        <div>
          <label htmlFor="T-blogName">블로그 선택</label>
          <select
            id="T-blogName"
            value={settings.blogName}
            {...register('blogName', { required: true })}
            onChange={changeBlog}
          >
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
            id="T-visibility"
            value={settings.visibility}
            {...register('visibility', { required: true })}
            onChange={(e) => {
              setSettings((prev) => ({ ...prev, visibility: e.target.value as '0' | '3' }))
            }}
          >
            <option value="3">공개</option>
            <option value="0">비공개</option>
          </select>
        </div>
        <div>
          <label htmlFor="T-categoryName">카테고리</label>
          <select
            id="T-categoryName"
            {...register('categoryName', { required: true })}
            value={settings.categoryName}
            onChange={(e) => setSettings((prev) => ({ ...prev, categoryName: e.target.value }))}
          >
            {categories.map((elem, idx) => {
              return (
                <option key={`${elem.id}-${idx}`} value={elem.id}>
                  {elem.label}
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
