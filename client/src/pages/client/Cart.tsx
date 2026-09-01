import { Link, useNavigate } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import { useCartStore } from '@/stores/cart.store'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ)
const Cart = () => {
  const { items, pickupDate, updateQuantity, updateNote, removeItem, totalPrice } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <ShoppingBag size={64} className="text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-dark mb-2">ตะกร้าว่างเปล่า</h1>
          <p className="text-stone-400 mb-6">ยังไม่มีสินค้าในตะกร้าเลยครับ ลองเลือกเมนูที่ชอบดูก่อนได้เลย</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all">
            ไปเลือกเมนู <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-1">ตะกร้าของคุณ</h1>
        <p className="text-stone-400 text-sm mb-6">รับของวันที่ {new Date(pickupDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm divide-y divide-stone-100 overflow-hidden">
          {items.map((item) => (
            <div key={item.productId} className="p-4 sm:p-5 flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-dark truncate">{item.name}</h3>
                  <button onClick={() => removeItem(item.productId)} className="text-stone-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-primary font-bold mt-1">฿{item.price.toLocaleString()}</p>
                <input
                  type="text"
                  placeholder="โน้ตถึงร้าน (ถ้ามี) เช่น ไม่ใส่ครีม"
                  value={item.customNote}
                  onChange={(e) => updateNote(item.productId, e.target.value)}
                  className="mt-2 w-full text-xs px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-lg outline-none focus:border-primary transition-all"
                />
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center border border-stone-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 text-stone-500 hover:text-primary">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 text-stone-500 hover:text-primary">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm text-stone-400 ml-auto">รวม ฿{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 mt-4 flex items-center justify-between">
          <span className="font-bold text-stone-600">ยอดรวมทั้งหมด</span>
          <span className="text-2xl font-bold text-primary">฿{totalPrice().toLocaleString()}</span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
        >
          ไปหน้าชำระเงิน <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default Cart
