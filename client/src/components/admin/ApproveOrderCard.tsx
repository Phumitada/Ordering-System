import { User, Phone, MapPin, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { useOrderStore } from '@/stores/order.store'
import { useState } from 'react'
import type { Order } from '@/types/order.type'

interface ApproveOrderCardProps {
  order: Order
  onViewSlip: (url: string) => void
}

const ApproveOrderCard = ({ order, onViewSlip }: ApproveOrderCardProps) => {
  const { approveOrder, rejectOrder } = useOrderStore()
  const [isLoading, setIsLoading] = useState(false)

  const formatTHB = (amount: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)

  const handleApprove = async () => {
    if (!confirm('ตรวจสอบยอดเงินถูกต้องแล้ว และต้องการอนุมัติใช่ไหม?')) return
    setIsLoading(true)
    await approveOrder(order.id)
  }

  const handleReject = async () => {
    const reason = prompt('ระบุเหตุผลที่ปฏิเสธ (เช่น ยอดไม่ครบ, สลิปปลอม):')
    if (!reason) return
    setIsLoading(true)
    await rejectOrder(order.id, reason)
  }

  const hasSlip = !!order.payment?.slipImage

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 font-sans">
      <div className="bg-primary px-5 py-4 flex justify-between items-start text-white">
        <div>
          <span className="font-bold text-xl tracking-wide">#{order.shortRef}</span>
          <div className="text-sm text-white/80 flex items-center gap-1 mt-1">
            <Clock size={14} />
            {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-white shadow-sm ${
            order.fulfillmentType === 'DELIVERY' ? 'text-purple-700' : 'text-blue-700'
          }`}
        >
          {order.fulfillmentType === 'DELIVERY' ? '🛵 ส่งถึงบ้าน' : '🏪 รับหน้าร้าน'}
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div className="flex items-start gap-4">
          <div className="bg-orange-50 p-3 rounded-full text-primary shrink-0">
            <User size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-800 text-base truncate">{order.user?.name || 'ลูกค้าทั่วไป'}</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <Phone size={14} /> {order.user?.phoneNumber || '-'}
            </div>
            {order.fulfillmentType === 'DELIVERY' && (
              <div className="flex items-start gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{order.deliveryInfo?.address || 'ไม่ระบุที่อยู่'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 border border-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <span className="font-bold text-primary whitespace-nowrap text-base">{item.quantity}x</span>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-gray-700 font-medium truncate">{item.name}</span>
                  {item.customNote && <span className="text-xs text-gray-500 italic truncate">"{item.customNote}"</span>}
                </div>
              </div>
              <span className="text-gray-800 font-medium whitespace-nowrap">{formatTHB(item.priceAtTime * item.quantity)}</span>
            </div>
          ))}

          <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
            <span className="text-gray-600 font-medium">ยอดสุทธิ</span>
            <span className="font-bold text-xl text-primary">{formatTHB(order.totalPrice)}</span>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <button
            onClick={() => (hasSlip ? onViewSlip(order.payment!.slipImage!) : undefined)}
            disabled={!hasSlip}
            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all border shadow-sm
              ${hasSlip ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md cursor-pointer' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {hasSlip ? <FileText size={18} className="text-gray-500" /> : <AlertCircle size={18} />}
            <span className={hasSlip ? 'font-semibold' : ''}>{hasSlip ? 'ตรวจสอบสลิปโอนเงิน' : 'ลูกค้ายังไม่แนบสลิป'}</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="col-span-1 py-3.5 rounded-xl bg-white border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all flex flex-col items-center justify-center gap-1"
          >
            <XCircle size={20} />
            ปฏิเสธ
          </button>

          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="col-span-2 py-3.5 rounded-xl bg-green-600 text-white font-bold text-base shadow-md hover:bg-green-600/90 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-spin text-white">⌛</span>
            ) : (
              <>
                <CheckCircle size={22} /> อนุมัติ{' '}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApproveOrderCard
