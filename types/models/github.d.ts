export type PinnedList = PinnedItem[]

export interface PinnedItem {
  name?: string
  repo?: string
  repository?: string
  owner?: string
  about?: string
  language?: string
  languageColor?: string
}

export interface PinnedItemDetailed extends PinnedItem {
  homepage?: string
  stars?: number
  watchers?: number
  forks?: number
  issues?: number
  license?: {
    key: string
    name?: string
    id: string
    url: string
  }
  topics?: string[]
  archived?: boolean

  createdAt?: string
  updatedAt?: string
}
