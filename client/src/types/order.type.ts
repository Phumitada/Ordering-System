export interface OrderItem {
  id: string
  productId: string
  quantity: number
  priceAtTime: number
  customNote: string
  name: string
  image: string
}

export interface OrderPayment {
  id: string
  slipImage?: string | null
  transferDate?: string | null
  transferAmount?: number | null
  uploadedAt?: string | null
}

export interface OrderDeliveryInfo {
  id: string
  recipientName?: string | null
  phone?: string | null
  address?: string | null
  riderNote?: string | null
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_FOR_VERIFICATION'
  | 'READY_TO_PICKUP'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED'

export type FulfillmentType = 'PICKUP' | 'DELIVERY'

export interface Order {
  id: string
  userId: string
  shortRef: string
  totalPrice: number
  status: OrderStatus
  expireAt: string
  fulfillmentType: FulfillmentType
  pickupDate: string
  shopNote: string
  note?: string | null
  approvedAt?: string | null
  approvedById?: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  payment?: OrderPayment | null
  deliveryInfo?: OrderDeliveryInfo | null
  user?: { id: string; name: string; phoneNumber: string }
}

export interface OrderFilters {
  page: number
  limit: number
  search: string
  status: string
  sortOrder: 'newest' | 'oldest'
  startDate?: string
  endDate?: string
}
