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
  visibility: 0 | 3
  categoryName: Tcategory
}

interface Tcategory {
  id: number
  name: string
}