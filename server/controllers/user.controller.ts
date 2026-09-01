import { Request, Response } from 'express'
import { userService } from '../services/user.service'

export const userController = {
  list: async (req: Request, res: Response) => {
    try {
      const users = await userService.list()
      res.status(200).json(users)
    } catch (error: any) {
      res.status(500).json({ message: 'Server Error' })
    }
  },

  updateRole: async (req: Request, res: Response) => {
    try {
      const data = await userService.updateRole(req.params.id, req.body.role)
      res.status(200).json({ message: 'User role updated successfully', data })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await userService.remove(req.params.id)
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
