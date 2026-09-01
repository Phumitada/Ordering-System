import { Clock, FileCheck, Store, Truck, CheckCircle, XCircle } from 'lucide-react'
import type { OrderStatus } from '@/types/order.type'

const config: Record<OrderStatus, { color: string; label: string; icon: any }> = {
  PENDING_PAYMENT: { color: 'bg-yellow-100 text-yellow-700', label: 'รอชำระเงิน', icon: Clock },
  WAITING_FOR_VERIFICATION: { color: 'bg-orange-100 text-orange-700', label: 'รอตรวจสอบสลิป', icon: FileCheck },
  READY_TO_PICKUP: { color: 'bg-blue-100 text-blue-700', label: 'พร้อมรับที่ร้าน', icon: Store },
  DELIVERING: { color: 'bg-purple-100 text-purple-700', label: 'กำลังจัดส่ง', icon: Truck },
  COMPLETED: { color: 'bg-green-100 text-green-700', label: 'สำเร็จแล้ว', icon: CheckCircle },
  CANCELLED: { color: 'bg-red-100 text-red-700', label: 'ยกเลิกแล้ว', icon: XCircle },
}

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const curr = config[status]
  const Icon = curr.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${curr.color}`}>
      <Icon size={14} /> {curr.label}
    </span>
  )
}

export default OrderStatusBadge
