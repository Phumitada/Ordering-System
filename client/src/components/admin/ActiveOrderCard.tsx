import { Clock, MapPin, Phone, User, CheckCircle, Truck, Package } from 'lucide-react'
import { useOrderStore } from '@/stores/order.store'
import type { Order } from '@/types/order.type'

interface ActiveOrderCardProps {
  order: Order
}

const ActiveOrderCard = ({ order }: ActiveOrderCardProps) => {
  const { updateOrderStatus } = useOrderStore()

  const handleNextStep = () => {
    if (!confirm('ยืนยันการเปลี่ยนสถานะ?')) return
    updateOrderStatus(order.id, 'COMPLETED')
  }

  const isDelivery = order.fulfillmentType === 'DELIVERY'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300">
      <div className={`p-4 md:w-48 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 ${isDelivery ? 'bg-purple-50/50' : 'bg-blue-50/50'}`}>
        <span className="font-bold text-xl text-gray-800">#{order.shortRef}</span>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <Clock size={14} />
          {new Date(order.pickupDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
        </div>
        <div
          className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold w-fit ${
            isDelivery ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {isDelivery ? <Truck size={12} /> : <Package size={12} />}
          {isDelivery ? 'Delivery' : 'Pickup'}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 min-w-0">
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary font-extrabold px-3 py-1 rounded-lg text-xl min-w-[3.5rem] text-center shrink-0">{item.quantity}x</div>
              <div className="flex-1 break-words">
                <p className="font-bold text-gray-800 text-lg leading-tight">{item.name}</p>
                {item.customNote && <p className="text-red-500 text-sm italic mt-1 bg-red-50 px-2 py-1 rounded inline-block">Note: "{item.customNote}"</p>}
              </div>
            </div>
          ))}
        </div>

        {order.items.length > 3 && (
          <div className="text-center mt-3 pt-2 border-t border-dashed border-gray-200 text-xs text-gray-400">
            มีทั้งหมด {order.items.length} รายการ (เลื่อนเพื่อดูเพิ่มเติม)
          </div>
        )}
      </div>

      <div className="p-4 md:w-64 bg-gray-50 flex flex-col justify-between gap-4">
        <div className="text-sm">
          <div className="flex items-center gap-2 font-bold text-gray-700 mb-1">
            <User size={16} /> {order.user?.name}
          </div>
          {isDelivery && (
            <div className="flex items-start gap-2 text-gray-500 leading-tight">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              <span className="line-clamp-2">{order.deliveryInfo?.address}</span>
            </div>
          )}
          {!isDelivery && <div className="text-gray-500 italic pl-6">รับเองที่ร้าน</div>}
        </div>

        <button
          onClick={handleNextStep}
          className={`w-full py-3 rounded-xl font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2
            ${isDelivery ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <CheckCircle size={20} />
          {isDelivery ? 'ไรเดอร์รับของแล้ว' : 'ลูกค้าได้รับแล้ว'}
        </button>
      </div>
    </div>
  )
}

export default ActiveOrderCard
