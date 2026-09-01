import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import Navbar from '@/components/client/Navbar'
import OrderStatusBadge from '@/components/client/OrderStatusBadge'
import { orderService } from '@/api/services/order.service'
import { useAuthStore } from '@/stores/auth.store'
import { Loader, Upload, Clock, MapPin, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Order } from '@/types/order.type'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — หน้ารายละเอียด+ติดตามสถานะออเดอร์แบบ real-time ของลูกค้า
// (คู่กับ event 'myOrderUpdated' ที่ backend เพิ่ง emit เข้า room user:{userId} ให้)
const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const socketRef = useRef<Socket | null>(null)

  const fetchOrder = async () => {
    if (!id) return
    try {
      const data = await orderService.getById(id)
      setOrder(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // ต่อ socket แยกจาก admin (join room ตาม userId แทน role=admin)
  useEffect(() => {
    if (!user?.id) return
    const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '')
    if (!apiUrl) return

    const socket = io(apiUrl, { query: { role: 'customer', userId: user.id }, transports: ['websocket'] })
    socketRef.current = socket

    socket.on('myOrderUpdated', (updatedOrder: Order) => {
      if (updatedOrder.id === id) {
        setOrder(updatedOrder)
        toast.success('สถานะออเดอร์อัปเดตแล้ว')
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [user?.id, id])

  // นับถอยหลังเวลาชำระเงิน (10 นาที ตาม expireAt ที่ backend ตั้งไว้)
  useEffect(() => {
    if (!order || order.status !== 'PENDING_PAYMENT') return
    const interval = setInterval(() => {
      const diff = new Date(order.expireAt).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('หมดเวลาแล้ว')
        clearInterval(interval)
        return
      }
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [order])

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSlipFile(file)
      setSlipPreview(URL.createObjectURL(file))
    }
  }

  const handleUploadSlip = async () => {
    if (!slipFile || !id) return
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('slip', slipFile)
      await orderService.confirmPayment(id, formData)
      toast.success('แจ้งชำระเงินเรียบร้อยแล้ว รอทางร้านตรวจสอบ')
      await fetchOrder()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'อัปโหลดสลิปไม่สำเร็จ')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center py-24">
          <Loader className="animate-spin text-primary" size={36} />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center text-stone-400">ไม่พบออเดอร์นี้</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/my-orders" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4">
          <ChevronLeft size={16} /> คำสั่งซื้อของฉัน
        </Link>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-dark">#{order.shortRef}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-stone-400">สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleString('th-TH')}</p>

          {order.status === 'PENDING_PAYMENT' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
              <Clock className="text-yellow-600 shrink-0" size={24} />
              <div>
                <p className="font-bold text-yellow-700 text-sm">กรุณาชำระเงินภายใน</p>
                <p className="text-2xl font-bold text-yellow-700">{timeLeft || '...'}</p>
              </div>
            </div>
          )}

          {order.fulfillmentType === 'DELIVERY' && order.deliveryInfo && (
            <div className="mt-4 flex items-start gap-2 text-sm text-stone-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-stone-400" />
              <div>
                <p className="font-medium">{order.deliveryInfo.recipientName}</p>
                <p className="text-stone-500">{order.deliveryInfo.address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-dark mb-3">รายการสินค้า</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {item.name} x{item.quantity}
                  {item.customNote && <span className="text-xs text-stone-400 italic"> ({item.customNote})</span>}
                </span>
                <span className="font-medium text-dark">฿{(item.priceAtTime * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-stone-600">ยอดรวม</span>
            <span className="text-xl font-bold text-primary">฿{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {order.status === 'PENDING_PAYMENT' && (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-bold text-dark mb-3">แนบหลักฐานการโอนเงิน</h2>
            {slipPreview ? (
              <img src={slipPreview} alt="Slip preview" className="w-full max-w-xs mx-auto rounded-xl mb-3 border border-stone-100" />
            ) : (
              <label className="block border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-all mb-3">
                <Upload className="mx-auto text-stone-300 mb-2" size={32} />
                <p className="text-sm text-stone-500">คลิกเพื่อเลือกรูปสลิป</p>
                <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
              </label>
            )}
            <button
              onClick={handleUploadSlip}
              disabled={!slipFile || isUploading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:bg-stone-300"
            >
              {isUploading ? <Loader className="animate-spin" size={18} /> : null}
              ยืนยันการโอนเงิน
            </button>
          </div>
        )}

        {order.status === 'WAITING_FOR_VERIFICATION' && order.payment?.slipImage && (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 text-center">
            <p className="text-sm text-stone-500 mb-3">ส่งสลิปแล้ว รอทางร้านตรวจสอบครับ</p>
            <img src={order.payment.slipImage} alt="Uploaded slip" className="w-full max-w-xs mx-auto rounded-xl border border-stone-100" />
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
