import { useState, useEffect } from 'react'
import { X, Package, ArrowRightLeft, Search } from 'lucide-react'
import { productAdminStore } from '@/stores/product.store'
import { useCategoryStore } from '@/stores/category.store'
import toast from 'react-hot-toast'
import type { Category } from '@/types/category.type'
import type { Product } from '@/types/product.type'

interface CategoryDetailModalProps {
  category: Category
  onClose: () => void
}

const CategoryDetailModal = ({ category, onClose }: CategoryDetailModalProps) => {
  const { categoryProducts, fetchProductsByCategory, moveProductCategory, isCategoryLoading } = productAdminStore()
  const { categories } = useCategoryStore()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (category?.id) fetchProductsByCategory(category.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const handleMoveCategory = async (product: Product, newCategoryId: string) => {
    if (!newCategoryId || newCategoryId === category.id) return
    const targetCategoryName = categories.find((c) => c.id === newCategoryId)?.name

    if (window.confirm(`ย้าย "${product.name}" ไปหมวด "${targetCategoryName}"?`)) {
      const result = await moveProductCategory(product.id, newCategoryId)
      if (result.success) {
        toast.success(`ย้ายไปหมวด ${targetCategoryName} เรียบร้อย`)
      } else {
        toast.error('ย้ายไม่สำเร็จ')
      }
    }
  }

  const filteredProducts = categoryProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl h-[80vh] flex flex-col font-sans overflow-hidden">
        <div className="bg-white border-b border-stone-100 p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
              <span className="text-primary">{category.name}</span>
              <span className="text-base font-normal text-stone-400">({categoryProducts.length} รายการ)</span>
            </h2>
            <p className="text-sm text-stone-400 mt-1">จัดการสินค้าในหมวดหมู่นี้</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={24} className="text-stone-400" />
          </button>
        </div>

        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100 flex gap-4 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาสินค้าในหมวดนี้..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
          {isCategoryLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p>กำลังโหลดสินค้า...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-stone-100 shrink-0 overflow-hidden border border-stone-100">
                    <img src={product.image || '/placeholder.png'} className="w-full h-full object-cover" alt={product.name} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-dark truncate">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                      <span className="bg-stone-100 px-2 py-0.5 rounded-md">฿{product.price}</span>
                      <span className="flex items-center gap-1">
                        <Package size={12} /> สต็อกวันละ {product.defaultStock}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider hidden sm:inline">ย้ายไป:</span>
                    <div className="relative group/select">
                      <select
                        className="appearance-none bg-stone-50 border border-stone-200 text-stone-600 text-sm py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/10 hover:bg-white transition-all w-32 sm:w-40"
                        value={category.id}
                        onChange={(e) => handleMoveCategory(product, e.target.value)}
                      >
                        <option value={category.id} disabled>
                          ▼ เลือกหมวดใหม่
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id} disabled={cat.id === category.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ArrowRightLeft
                        size={14}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover/select:text-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
              <Package size={48} className="opacity-20" />
              <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 bg-white text-right">
          <button onClick={onClose} className="px-6 py-2.5 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-colors">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryDetailModal
