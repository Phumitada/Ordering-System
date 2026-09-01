export interface CreateOrderItemPayload {
  product_id: string
  quantity: number
  custom_note?: string
}

export interface DeliveryInfoPayload {
  recipient_name?: string
  phone?: string
  address?: string
  rider_note?: string
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[]
  pickup_date: string
  fulfillment_type: 'PICKUP' | 'DELIVERY'
  delivery_info?: DeliveryInfoPayload
  shop_note?: string
}

export interface AdminOrderQuery {
  status?: string
  date?: string
  startDate?: string
  endDate?: string
  fulfillment_type?: string
  search?: string
  sortOrder?: 'newest' | 'oldest'
  limit?: string
  page?: string
}
