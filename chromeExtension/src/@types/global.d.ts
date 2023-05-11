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