import type { Product } from './product.type'

export interface InventoryItem {
  id: string
  product: Product
  stats: {
    capacity: number
    reserved: number
    sold: number
    available: number
  }
  status: 'AVAILABLE' | 'SOLD_OUT'
  date: string
}
