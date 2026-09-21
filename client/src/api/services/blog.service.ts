import { api } from '../client'
import type { BlogPost } from '@/types/blog.type'

export const blogService = {
  list: (): Promise<BlogPost[]> => api.get('/blogs').then((r) => r.data),
  adminList: (): Promise<BlogPost[]> => api.get('/blogs/admin/list').then((r) => r.data),
  getBySlug: (slug: string): Promise<BlogPost> => api.get(`/blogs/${slug}`).then((r) => r.data),
  getById: (id: string): Promise<BlogPost> => api.get(`/blogs/admin/${id}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id: string) => api.delete(`/blogs/${id}`).then((r) => r.data),
}
