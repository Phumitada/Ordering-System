import { api } from '../client'
import type { InventoryItem } from '@/types/inventory.type'

export const inventoryService = {
  getByDate: (date: string): Promise<InventoryItem[]> =>
    api.get('/inventory', { params: { date } }).then((r) => r.data),

  openStock: (date: string, items: { product_id: string }[]) =>
    api.post('/inventory/open', { date, items }).then((r) => r.data),
}
