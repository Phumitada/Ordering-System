import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import AddressForm from '@/components/client/AddressForm'
import { useCartStore } from '@/stores/cart.store'
import { useAddressStore } from '@/stores/address.store'
import { orderService } from '@/api/services/order.service'
import { Store, Truck, MapPin, Plus, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ประกอบ payload ตรงตาม CreateOrderPayload ที่ backend คาดหวังทุกจุด
const Checkout = () => {
  const navigate = useNavigate()
  const { items, pickupDate, totalPrice, clearCart } = useCartStore()
  const { addresses, fetchAddresses } = useAddressStore()

  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP')
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [shopNote, setShopNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) setSelectedAddressId(addresses[0].id)
  }, [addresses, selectedAddressId])

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async () => {
    if (fulfillmentType === 'DELIVERY' && !selectedAddressId) {
      toast.error('กรุณาเลือกที่อยู่จัดส่ง')
      return
    }

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

    try {
      setIsSubmitting(true)
      const { order } = await orderService.create({
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity, custom_note: i.customNote })),
        pickup_date: pickupDate,
        fulfillment_type: fulfillmentType,
        delivery_info:
          fulfillmentType === 'DELIVERY' && selectedAddress
            ? {
                recipient_name: selectedAddress.recipientName || undefined,
                phone: selectedAddress.phone || undefined,
                address: selectedAddress.addressLine || undefined,
              }
            : undefined,
        shop_note: shopNote,
      })
      clearCart()
      toast.success('จองสินค้าสำเร็จ! กรุณาชำระเงินภายใน 10 นาที')
      navigate(`/my-orders/${order.id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'สั่งซื้อไม่สำเร็จ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-6">ยืนยันการสั่งซื้อ</h1>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 mb-4">
          <h2 className="font-bold text-dark mb-3">วิธีรับสินค้า</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFulfillmentType('PICKUP')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                fulfillmentType === 'PICKUP' ? 'border-primary bg-primary-light text-primary' : 'border-stone-200 text-stone-400'
              }`}
            >
              <Store size={28} />
              <span className="font-bold text-sm">รับที่ร้าน</span>
            </button>
            <button
              onClick={() => setFulfillmentType('DELIVERY')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                fulfillmentType === 'DELIVERY' ? 'border-primary bg-primary-light text-primary' : 'border-stone-200 text-stone-400'
              }`}
            >
              <Truck size={28} />
              <span className="font-bold text-sm">จัดส่ง</span>
            </button>
          </div>
        </div>

        {fulfillmentType === 'DELIVERY' && (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 mb-4">
            <h2 className="font-bold text-dark mb-3">ที่อยู่จัดส่ง</h2>
            {addresses.length > 0 && (
              <div className="space-y-2 mb-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary-light/30' : 'border-stone-100'
                    }`}
                  >
                    <input type="radio" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 accent-primary" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-dark">
                        {addr.label} {addr.recipientName && `· ${addr.recipientName}`}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{addr.addressLine}</p>
                      {addr.phone && <p className="text-xs text-stone-400 mt-0.5">📞 {addr.phone}</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}
            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> เพิ่มที่อยู่ใหม่
              </button>
            ) : (
              <AddressForm onSaved={() => setShowAddressForm(false)} />
            )}
            {addresses.length === 0 && !showAddressForm && (
              <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                <MapPin size={14} /> ยังไม่มีที่อยู่บันทึกไว้ กรุณาเพิ่มที่อยู่ก่อนครับ
              </p>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 mb-4">
          <h2 className="font-bold text-dark mb-3">โน้ตถึงร้าน (ถ้ามี)</h2>
          <textarea
            value={shopNote}
            onChange={(e) => setShopNote(e.target.value)}
            rows={2}
            placeholder="เช่น ขอถุงแยก, โทรก่อนมาส่ง"
            className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 mb-6 space-y-2">
          <h2 className="font-bold text-dark mb-2">สรุปรายการ</h2>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium text-dark">฿{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-stone-100 pt-2 mt-2 flex justify-between items-center">
            <span className="font-bold text-stone-600">ยอดรวม</span>
            <span className="text-xl font-bold text-primary">฿{totalPrice().toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:bg-stone-300"
        >
          {isSubmitting ? <Loader className="animate-spin" size={20} /> : null}
          ยืนยันสั่งซื้อ
        </button>
      </div>
    </div>
  )
}

export default Checkout
