export interface CreateBlogPayload {
  title: string
  excerpt?: string
  content: string
  is_published?: boolean
}

export interface UpdateBlogPayload {
  title?: string
  excerpt?: string
  content?: string
  is_published?: boolean
}
