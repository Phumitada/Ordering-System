import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/stores/cart.store'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product.type'

interface ProductCardProps {
  product: Product
  available: number | null // null = ยังไม่รู้ (ไม่ได้เช็ค inventory), number = เหลือกี่ชิ้นสำหรับวันที่เลือก
}

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — หน้าเมนูฝั่งลูกค้าไม่เคยถูก build เลย
const ProductCard = ({ product, available }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)

  const soldOut = available !== null && available <= 0
  const maxQty = available !== null ? available : 99

  const handleAdd = () => {
    if (soldOut) return
    addItem(product, qty)
    toast.success(`เพิ่ม "${product.name}" x${qty} ลงตะกร้าแล้ว`)
    setQty(1)
  }

  return (
    <div className={`bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all ${soldOut ? 'opacity-70' : ''}`}>
      <div className="aspect-square bg-stone-100 relative overflow-hidden">
        <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${soldOut ? 'grayscale' : 'group-hover:scale-105'}`} />
        {product.recommend && (
          <span className="absolute top-3 left-3 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-2 py-1 rounded-lg">⭐ แนะนำ</span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-stone-700 text-sm font-bold px-4 py-1.5 rounded-full">สินค้าหมด</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-dark truncate">{product.name}</h3>
        {product.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2">{product.description}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-primary text-lg">฿{product.price.toLocaleString()}</span>
          {available !== null && !soldOut && <span className="text-xs text-stone-400">เหลือ {available} ชิ้น</span>}
        </div>

        {!soldOut && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center border border-stone-200 rounded-xl">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 text-stone-500 hover:text-primary">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="p-2 text-stone-500 hover:text-primary">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart size={16} /> เพิ่ม
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
