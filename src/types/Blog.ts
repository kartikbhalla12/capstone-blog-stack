export interface BlogListView {
  blogId: string
  authorName: string
  heading: string
  description: string
  imageUrl: string
  timeToRead: string
}

export interface Blog {
  blogId: string
  userId: string
  authorName: string
  heading: string
  description: string
  createdAt: string
  updatedAt: string
  imageUrl: string
  content: string
  timeToRead: string
}
