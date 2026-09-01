import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Package, Search, Layers } from 'lucide-react'
import { useCategoryStore } from '@/stores/category.store'
import CategoryModal from '@/components/admin/CategoryModal'
import CategoryDetailModal from '@/components/admin/CategoryDetailModal'
import type { Category } from '@/types/category.type'

const CategoryAdmin = () => {
  const { categories, getCategories, deleteCategory } = useCategoryStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [detailCategory, setDetailCategory] = useState<Category | null>(null)

  useEffect(() => {
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`คุณแน่ใจว่าจะลบหมวดหมู่ "${name}"?\n(สินค้าในหมวดนี้อาจจะค้างอยู่นะครับ)`)) {
      await deleteCategory(id)
    }
  }
  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
            <Layers className="text-primary" size={32} />
            จัดการหมวดหมู่
          </h1>
          <p className="text-stone-400 text-sm mt-1">มีทั้งหมด {categories.length} หมวดหมู่</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่..."
              className="pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl outline-none focus:border-primary transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            เพิ่มหมวดหมู่
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setDetailCategory(cat)}
            className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md hover:border-primary/20 transition-all group relative overflow-hidden cursor-pointer"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Layers size={24} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-500">
                  <Package size={12} />
                  <span>{cat.productsCount || 0} รายการ</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-dark mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-xs text-stone-400">อัปเดต: {new Date(cat.updatedAt || Date.now()).toLocaleDateString('th-TH')}</p>
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(cat)
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-stone-50 text-stone-600 font-bold text-sm hover:bg-primary-light hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> แก้ไขชื่อ
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(cat.id, cat.name)
                  }}
                  className="w-10 h-10 rounded-xl bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <Layers size={48} className="mx-auto mb-3 opacity-20" />
            <p>ไม่พบหมวดหมู่ที่ค้นหา</p>
          </div>
        )}
      </div>
      {isModalOpen && <CategoryModal category={editingCategory} onClose={() => setIsModalOpen(false)} />}
      {detailCategory && <CategoryDetailModal category={detailCategory} onClose={() => setDetailCategory(null)} />}
    </div>
  )
}

export default CategoryAdmin
