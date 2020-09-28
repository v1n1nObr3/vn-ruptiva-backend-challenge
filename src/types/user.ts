export interface Repositories {
  name: string
  url: string
  type: 'public' | 'private'
  description: string
}

interface User {
  record: {
    email: string
    uid: string
    password: string
  }
  repositories: Repositories[]
}

export default User
