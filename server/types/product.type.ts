export interface ProductQuery {
  category?: string
  search?: string
  limit?: string
  page?: string
  sort?: string
  order?: 'asc' | 'desc'
  is_active?: string
}

export interface UpdateProductPayload {
  name?: string
  description?: string
  price?: number
  category?: string
  is_active?: boolean
  default_stock?: number
  recommend?: string
}
