export interface FaceitProfile {
  id: string
  uid: string
  nickname: string
  status: string // Available...?
  games: {
    name: string
    // eslint-disable-next-line camelcase
    skill_level: number
  }[]
  country: string
  avatar: string
  verified: boolean
}
