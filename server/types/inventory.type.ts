export interface OpenStockItem {
  product_id: string
}

export interface OpenStockPayload {
  date: string
  items: OpenStockItem[]
}
