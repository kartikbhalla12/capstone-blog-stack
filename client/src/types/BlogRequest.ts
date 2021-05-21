import { RawDraftContentState } from 'draft-js'
export interface BlogRequest {
  heading: string
  description: string
  content: RawDraftContentState
  timeToRead: number
  authorName: string
}
