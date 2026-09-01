import { useEffect, useState } from 'react'
import { useOrderStore } from '@/stores/order.store'
import ActiveOrderCard from '@/components/admin/ActiveOrderCard'
import { RefreshCcw, Truck, Store } from 'lucide-react'

const ActiveOrderPage = () => {
  const { orders, fetchOrders, initializeSocket, disconnectSocket, setFilter } = useOrderStore()
  const [activeTab, setActiveTab] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY')

  useEffect(() => {
    initializeSocket('active')
    setFilter({ status: '', limit: 100, page: 1 })
    fetchOrders()
    return () => disconnectSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeOrders = orders.filter((o) => o.status === 'DELIVERING' || o.status === 'READY_TO_PICKUP')
  const filteredOrders = activeOrders.filter((o) => o.fulfillmentType === activeTab)

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-screen bg-gray-50/30">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ครัว & จัดส่ง 🍳</h1>
        <button onClick={() => fetchOrders()} className="p-2 bg-white shadow-sm rounded-full text-gray-500 hover:text-primary">
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('DELIVERY')}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
            activeTab === 'DELIVERY' ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md' : 'border-transparent bg-white text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Truck size={32} />
          <span className="font-bold text-lg">Delivery Drop-off</span>
          <span className="text-sm opacity-70">{activeOrders.filter((o) => o.fulfillmentType === 'DELIVERY').length} รายการ</span>
        </button>

        <button
          onClick={() => setActiveTab('PICKUP')}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
            activeTab === 'PICKUP' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-transparent bg-white text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Store size={32} />
          <span className="font-bold text-lg">Store Pickup</span>
          <span className="text-sm opacity-70">{activeOrders.filter((o) => o.fulfillmentType === 'PICKUP').length} รายการ</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium">ไม่มีรายการค้างส่ง</p>
            <p className="text-sm">ครัวว่างแล้วครับ!</p>
          </div>
        ) : (
          filteredOrders.map((order) => <ActiveOrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}

export default ActiveOrderPage
