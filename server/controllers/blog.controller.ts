import { Request, Response } from 'express'
import { blogService } from '../services/blog.service'

export const blogController = {
  create: async (req: Request, res: Response) => {
    try {
      const post = await blogService.create(req.body, req.file)
      res.status(201).json({ message: 'เพิ่มบทความสำเร็จ', post })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const posts = await blogService.listPublished()
      res.status(200).json(posts)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  adminList: async (req: Request, res: Response) => {
    try {
      const posts = await blogService.listAll()
      res.status(200).json(posts)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  getBySlug: async (req: Request, res: Response) => {
    try {
      const post = await blogService.getBySlug(req.params.slug)
      res.status(200).json(post)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const post = await blogService.getById(req.params.id)
      res.status(200).json(post)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const post = await blogService.update(req.params.id, req.body, req.file)
      res.status(200).json({ message: 'แก้ไขบทความสำเร็จ', post })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await blogService.remove(req.params.id)
      res.status(200).json({ message: 'ลบบทความสำเร็จ' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
