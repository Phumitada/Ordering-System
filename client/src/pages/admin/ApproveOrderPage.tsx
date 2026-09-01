import { useEffect, useState } from 'react'
import { useOrderStore } from '@/stores/order.store'
import ApproveOrderCard from '@/components/admin/ApproveOrderCard'
import ImageModal from '@/components/admin/ImageModal'
import { Loader2, Inbox, RefreshCcw } from 'lucide-react'

const ApproveOrderPage = () => {
  const { orders, fetchOrders, isLoading, initializeSocket, disconnectSocket, setFilter } = useOrderStore()
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  useEffect(() => {
    initializeSocket('approve')
    setFilter({ status: 'WAITING_FOR_VERIFICATION', sortOrder: 'oldest', page: 1 })
    fetchOrders()
    return () => {
      disconnectSocket()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            อนุมัติยอดโอน 💰
            {!isLoading && orders.length > 0 && (
              <span className="text-sm font-normal bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{orders.length} รายการ</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">รายการที่ลูกค้าแจ้งโอนเงินแล้ว</p>
        </div>
        <button onClick={() => fetchOrders()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" disabled={isLoading}>
          <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Inbox size={64} className="text-green-500 mb-4 opacity-50" />
          <p className="text-lg font-medium text-gray-600">ไม่มีรายการรอตรวจสอบ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {orders.map((order) => (
            <ApproveOrderCard key={order.id} order={order} onViewSlip={(url) => setSelectedSlip(url)} />
          ))}
        </div>
      )}

      <ImageModal isOpen={!!selectedSlip} imageUrl={selectedSlip} onClose={() => setSelectedSlip(null)} />
    </div>
  )
}

export default ApproveOrderPage
