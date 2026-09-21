import { create } from 'zustand'
import toast from 'react-hot-toast'
import { blogService } from '@/api/services/blog.service'
import type { BlogPost } from '@/types/blog.type'

interface BlogState {
  posts: BlogPost[]
  currentPost: BlogPost | null
  isLoading: boolean
  isError: boolean
  getPosts: () => Promise<void>
  getAdminPosts: () => Promise<void>
  getPostBySlug: (slug: string) => Promise<void>
  getPostById: (id: string) => Promise<BlogPost | null>
  addPost: (data: FormData) => Promise<boolean>
  editPost: (id: string, data: FormData) => Promise<boolean>
  deletePost: (id: string) => Promise<void>
}

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  isError: false,

  getPosts: async () => {
    try {
      set({ isLoading: true, isError: false })
      const posts = await blogService.list()
      set({ posts, isLoading: false })
    } catch {
      set({ isLoading: false, isError: true })
    }
  },

  getAdminPosts: async () => {
    try {
      set({ isLoading: true, isError: false })
      const posts = await blogService.adminList()
      set({ posts, isLoading: false })
    } catch {
      set({ isLoading: false, isError: true })
    }
  },

  getPostBySlug: async (slug) => {
    try {
      set({ isLoading: true, isError: false, currentPost: null })
      const post = await blogService.getBySlug(slug)
      set({ currentPost: post, isLoading: false })
    } catch {
      set({ isLoading: false, isError: true })
    }
  },

  getPostById: async (id) => {
    try {
      return await blogService.getById(id)
    } catch (error) {
      console.error(error)
      return null
    }
  },

  addPost: async (data) => {
    try {
      set({ isLoading: true })
      await blogService.create(data)
      await get().getAdminPosts()
      toast.success('เพิ่มบทความสำเร็จ')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'เพิ่มไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  editPost: async (id, data) => {
    try {
      set({ isLoading: true })
      await blogService.update(id, data)
      await get().getAdminPosts()
      toast.success('แก้ไขบทความสำเร็จ')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'แก้ไขไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  deletePost: async (id) => {
    try {
      await blogService.remove(id)
      set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }))
      toast.success('ลบบทความแล้ว')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ลบไม่สำเร็จ')
    }
  },
}))
