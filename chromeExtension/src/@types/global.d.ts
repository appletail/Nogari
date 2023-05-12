interface Login {
  email: string
  password: string
}

interface ConnectedSite {
  notion: boolean
  tistory: boolean
  github: boolean
}

interface TistorySetting {
  blogName: string
  visibility: '0' | '3'
  categoryName: string
}

interface Tcategory {
  id: string
  name: string
  parent?: string | undefined
  label?: string
  entries?: string
}

interface Tpost {
  type: 'html'
  blogName: string
  requestLink: string
  responseLink?: string
  visibility: '0' | '3'
  categoryName: string
  tagList?: string
  status: '발행요청' | '수정요청' | '발행완료' | '발행실패' | '수정실패'
  title: string
}