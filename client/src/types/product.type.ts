import type { Category } from './category.type'

export interface Product {
  id: string
  name: string
  description?: string | null
  defaultStock: number
  price: number
  image: string
  categoryId: string
  category?: Category
  isActive: boolean
  recommend: string
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  page: number
  limit: number
  search: string
  category: string
  sort: string
  order: 'asc' | 'desc'
}
