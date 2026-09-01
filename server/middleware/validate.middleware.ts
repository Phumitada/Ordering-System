import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))

      res.status(400).json({
        success: false,
        message: errors[0].message,
        errors,
      })
      return
    }

    req.body = result.data
    next()
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      res.status(400).json({
        success: false,
        message: errors[0].message,
        errors,
      })
      return
    }
    req.query = result.data as any
    next()
  }
}
