import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import ProductCard from '@/components/client/ProductCard'
import ModernDatePicker from '@/components/ui/ModernDatePicker'
import { useCategoryStore } from '@/stores/category.store'
import { useCartStore } from '@/stores/cart.store'
import { productService } from '@/api/services/product.service'
import { inventoryService } from '@/api/services/inventory.service'
import { Search, Loader, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product.type'
import type { InventoryItem } from '@/types/inventory.type'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — หน้าเมนูสั่งซื้อจริงของลูกค้า ของเดิม (Home.jsx) มีแค่ Navbar เปล่าๆ
const Menu = () => {
  const { categories, getCategories } = useCategoryStore()
  const { pickupDate, setPickupDate, items: cartItems } = useCartStore()

  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // รองรับลิงก์เข้าตรงจากหน้าแรกพร้อมหมวดหมู่ เช่น /menu?category=xxx
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') || '')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [productRes, inventoryRes] = await Promise.all([
          productService.list({ is_active: 'true', limit: 100, category: categoryFilter, search }),
          inventoryService.getByDate(pickupDate),
        ])
        setProducts(productRes.products)
        setInventory(inventoryRes)
      } catch (error) {
        console.error(error)
        toast.error('โหลดเมนูไม่สำเร็จ')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [pickupDate, categoryFilter, search])

  const availabilityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const inv of inventory) map[inv.product.id] = inv.stats.available
    return map
  }, [inventory])

  const handleDateChange = (newDate: string) => {
    if (cartItems.length > 0 && newDate !== pickupDate) {
      if (!window.confirm('เปลี่ยนวันที่รับของจะล้างตะกร้าปัจจุบันทิ้ง (เพราะสต็อกเปิดแยกรายวัน) ยืนยันไหมครับ?')) {
        return
      }
    }
    setPickupDate(newDate)
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark">เมนูทั้งหมด</h1>
            <p className="text-stone-400 text-sm mt-1">เลือกวันที่รับของ แล้วเลือกเมนูที่ชอบได้เลยครับ</p>
          </div>
          <ModernDatePicker selectedDate={pickupDate} onChange={handleDateChange} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input
              type="text"
              placeholder="ค้นหาเมนู..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${categoryFilter === '' ? 'bg-primary text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
            >
              ทั้งหมด
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${categoryFilter === cat.id ? 'bg-primary text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={36} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} available={availabilityMap[product.id] ?? 0} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <Package size={48} className="text-stone-300 mb-3" />
            <p className="text-stone-400 font-medium">ไม่พบเมนู</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
