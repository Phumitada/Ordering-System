import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import OrderStatusBadge from '@/components/client/OrderStatusBadge'
import { orderService } from '@/api/services/order.service'
import { Loader, PackageSearch, ChevronRight } from 'lucide-react'
import type { Order } from '@/types/order.type'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ลูกค้าเดิมไม่มีหน้าประวัติการสั่งซื้อเลย
const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await orderService.myOrders({ limit: 50 })
        setOrders(res.Orders)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-6">คำสั่งซื้อของฉัน</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={36} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <PackageSearch size={48} className="text-stone-300 mb-3" />
            <p className="text-stone-400 font-medium">ยังไม่มีคำสั่งซื้อ</p>
            <Link to="/menu" className="text-primary font-bold hover:underline mt-2 text-sm">
              ไปเลือกเมนู
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/my-orders/${order.id}`}
                className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark">#{order.shortRef}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} รายการ
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-primary">฿{order.totalPrice.toLocaleString()}</span>
                  <ChevronRight size={18} className="text-stone-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
