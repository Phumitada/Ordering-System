import { useEffect, useState, useMemo } from 'react'
import { useOrderStore } from '@/stores/order.store'
import { orderService } from '@/api/services/order.service'
import { LayoutDashboard, Clock, AlertCircle, Wallet, CheckCircle, ArrowUpRight, Package, ChevronRight, Truck, Store, ChefHat, RefreshCcw, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '@/types/order.type'

const Dashboard = () => {
  const navigate = useNavigate()
  const { orders, isLoading, setFilter, fetchOrders, initializeSocket, updateOrderStatus } = useOrderStore()
  const [fetchKey, setFetchKey] = useState(0)
  const [waitingOrders, setWaitingOrders] = useState<Order[]>([])
  const [loadingWaiting, setLoadingWaiting] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [loadingPending, setLoadingPending] = useState(false)
  const [activeTab, setActiveTab] = useState<'PICKUP' | 'DELIVERY'>('PICKUP')

  const getTodayDateRange = () => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    return { startDate: startOfDay.toISOString(), endDate: endOfDay.toISOString() }
  }

  useEffect(() => {
    const interval = setInterval(() => setFetchKey((prev) => prev + 1), 90000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const initData = async () => {
      initializeSocket('dashboard')
      const { startDate, endDate } = getTodayDateRange()
      setFilter({ status: '', limit: 100, page: 1, startDate, endDate })
      await fetchOrders()
    }
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey])

  useEffect(() => {
    const getWaitingOrders = async () => {
      try {
        setLoadingWaiting(true)
        const { startDate, endDate } = getTodayDateRange()
        const res = await orderService.adminList({ status: 'WAITING_FOR_VERIFICATION', limit: 100, page: 1, startDate, endDate })
        setWaitingOrders(res.Orders || [])
      } catch (error) {
        console.error('Error fetching waiting orders:', error)
      } finally {
        setLoadingWaiting(false)
      }
    }
    getWaitingOrders()
  }, [fetchKey])

  useEffect(() => {
    const getPendingOrders = async () => {
      try {
        setLoadingPending(true)
        const { startDate, endDate } = getTodayDateRange()
        const res = await orderService.adminList({ status: 'PENDING_PAYMENT', limit: 100, page: 1, startDate, endDate })
        setPendingOrders(res.Orders || [])
      } catch (error) {
        console.error('Error fetching pending orders:', error)
      } finally {
        setLoadingPending(false)
      }
    }
    getPendingOrders()
  }, [fetchKey])

  const stats = useMemo(() => {
    // เดิมเช็ค status 'PAID' ด้วย แต่ enum จริงไม่มีสถานะนี้อยู่เลย (dead code) — ตัดออก เหลือแค่ COMPLETED
    const paidOrders = orders.filter((o) => o.status === 'COMPLETED')
    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.totalPrice, 0)
    const activeOrders = orders.filter((o) => o.status === 'DELIVERING' || o.status === 'READY_TO_PICKUP')

    return {
      revenue: totalRevenue,
      totalCount: orders.length,
      waitingCount: waitingOrders.length,
      pendingCount: pendingOrders.length,
      activeCount: activeOrders.length,
    }
  }, [orders, waitingOrders, pendingOrders])

  const activeOrders = useMemo(() => {
    const active = orders.filter((o) => o.status === 'DELIVERING' || o.status === 'READY_TO_PICKUP')
    return active.filter((o) => o.fulfillmentType === activeTab)
  }, [orders, activeTab])

  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; label: string; icon: any }> = {
      READY_TO_PICKUP: { color: 'bg-blue-100 text-blue-700', label: 'พร้อมรับ', icon: Store },
      DELIVERING: { color: 'bg-purple-100 text-purple-700', label: 'กำลังส่ง', icon: Truck },
    }
    const curr = config[status] || { color: 'bg-gray-100 text-gray-600', label: status, icon: Package }
    const Icon = curr.icon
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${curr.color}`}>
        <Icon size={14} /> {curr.label}
      </span>
    )
  }

  const OrderItemRow = ({ item }: { item: Order['items'][number] }) => (
    <div className="flex items-start gap-3 py-2">
      <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">{item.quantity}x</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
        {item.customNote && (
          <p className="text-red-600 text-xs mt-0.5 italic flex items-center gap-1">
            <span className="font-bold">Note:</span> "{item.customNote}"
          </p>
        )}
      </div>
    </div>
  )

  const ActiveOrderCard = ({ order }: { order: Order }) => {
    const isPickup = order.fulfillmentType === 'PICKUP'

    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPickup ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
              {isPickup ? <Store size={24} /> : <Truck size={24} />}
            </div>
            <div>
              <p className="font-mono text-xs text-gray-400">#{order.id.slice(-6)}</p>
              <p className="font-bold text-gray-800 text-sm mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} •{' '}
                {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
              {(order.user?.name || order.deliveryInfo?.recipientName)?.charAt(0) || '?'}
            </div>
            <p className="font-bold text-gray-800">{order.user?.name || order.deliveryInfo?.recipientName || 'ไม่ระบุชื่อ'}</p>
          </div>
          {!isPickup && order.deliveryInfo?.address && <p className="text-sm text-gray-600 pl-10 line-clamp-2">{order.deliveryInfo.address}</p>}
          {(order.deliveryInfo?.phone || order.user?.phoneNumber) && <p className="text-sm text-gray-500 pl-10 mt-1">📞 {order.deliveryInfo?.phone || order.user?.phoneNumber}</p>}
        </div>

        <div className="space-y-1 mb-4">
          {order.items?.map((item, idx) => (
            <OrderItemRow key={idx} item={item} />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">ยอดรวม</p>
            <p className="text-2xl font-bold text-gray-800">฿{order.totalPrice?.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              onClick={() => {
                window.confirm('ยืนยันว่าลูกค้าต้องการยกเลิกออเดอร์นี้จริงหรือไม่?') && updateOrderStatus(order.id, 'CANCELLED')
              }}
            >
              <XCircle size={18} />
              <span>ลูกค้ายกเลิก</span>
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              onClick={() => {
                window.confirm('ยืนยันว่าลูกค้าได้รับออเดอร์นี้เรียบร้อยแล้วหรือไม่?') && updateOrderStatus(order.id, 'COMPLETED')
              }}
            >
              <CheckCircle size={18} />
              <span>ลูกค้ารับแล้ว</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <LayoutDashboard className="text-orange-500" size={32} />
            Dashboard ภาพรวม
          </h1>
          <p className="text-gray-500 text-sm mt-1">ข้อมูลสรุปและรายการที่ต้องจัดการวันนี้</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFetchKey((prev) => prev + 1)}
            className="p-3 bg-white shadow-sm rounded-full text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-all"
            title="Refresh ข้อมูล"
          >
            <RefreshCcw size={20} />
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">วันที่ปัจจุบัน</p>
            <p className="text-lg font-bold text-gray-700">
              {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm text-emerald-600 border-2">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Wallet size={18} />
            <span className="font-bold text-xs uppercase tracking-wide">รายได้</span>
          </div>
          <p className="text-3xl font-bold">฿{stats.revenue}</p>
          <p className="text-xs opacity-75 mt-1">จากออเดอร์ที่สำเร็จ</p>
        </div>

        <div className="border-2 p-5 rounded-2xl shadow-sm text-primary bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <ChefHat size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat size={18} />
              <span className="font-bold text-xs uppercase tracking-wide">จัดเตรียม</span>
            </div>
            <p className="text-4xl font-bold text-black">{stats.activeCount}</p>
            <p className="text-xs opacity-90 mt-1 font-semibold">รายการที่ต้องจัดการ</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border-2">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Clock size={18} />
            <span className="font-bold text-xs uppercase tracking-wide">รอตรวจสอบ</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{loadingWaiting ? '...' : stats.waitingCount}</p>
          <p className="text-xs text-gray-500 mt-1">ต้องดำเนินการทันที</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border-2">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <AlertCircle size={18} />
            <span className="font-bold text-xs uppercase tracking-wide">รอชำระ</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{loadingPending ? '...' : stats.pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">ยังไม่แนบสลิป</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border-2">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Package size={18} />
            <span className="font-bold text-xs uppercase tracking-wide">ทั้งหมด</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{isLoading ? '...' : stats.totalCount}</p>
          <p className="text-xs text-gray-500 mt-1">ออเดอร์ในระบบ</p>
        </div>
      </div>

      {stats.activeCount > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                <ChefHat size={22} />
              </div>
              ครัว & จัดส่ง
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600">แยกตาม:</span>
              <button
                onClick={() => setActiveTab('PICKUP')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'PICKUP' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Store size={16} />
                Pickup ({orders.filter((o) => (o.status === 'DELIVERING' || o.status === 'READY_TO_PICKUP') && o.fulfillmentType === 'PICKUP').length})
              </button>
              <button
                onClick={() => setActiveTab('DELIVERY')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'DELIVERY' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Truck size={16} />
                Delivery ({orders.filter((o) => (o.status === 'DELIVERING' || o.status === 'READY_TO_PICKUP') && o.fulfillmentType === 'DELIVERY').length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => <ActiveOrderCard key={order.id} order={order} />)
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-400">
                <CheckCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p className="text-lg font-medium">ไม่มีรายการในหมวด {activeTab === 'PICKUP' ? 'Pickup' : 'Delivery'}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {stats.waitingCount > 0 && (
        <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50">
            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <Clock size={20} />
              </div>
              รายการรอตรวจสอบสลิป
            </h3>
            <span className="text-sm font-bold text-orange-600 bg-white px-3 py-1.5 rounded-lg">{waitingOrders.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="py-4 px-4 font-bold">ลูกค้า</th>
                  <th className="py-4 px-4 font-bold">ยอดโอน</th>
                  <th className="py-4 px-4 font-bold">เวลา</th>
                  <th className="py-4 px-4 font-bold text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {waitingOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-400">#{order.id.slice(-6)}</td>
                    <td className="py-4 px-4 font-bold text-gray-700">{order.user?.name || order.deliveryInfo?.recipientName || 'ไม่ระบุชื่อ'}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">฿{order.totalPrice.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-500">{new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</td>
                    <td className="p-4 text-center">
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-1 mx-auto shadow-sm hover:shadow-md"
                        onClick={() => navigate('/secret-dashboard/approve-orders')}
                      >
                        ตรวจสลิป <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {waitingOrders.length > 5 && (
            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={() => navigate('/secret-dashboard/approve-orders')}
                className="text-orange-600 hover:text-orange-700 font-bold text-sm inline-flex items-center gap-1"
              >
                ดูทั้งหมด {waitingOrders.length} รายการ <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
      {stats.activeCount === 0 && stats.waitingCount === 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">ไม่มีรายการรอดำเนินการ</h3>
            <p className="text-gray-500">ไม่มีรายการ</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
