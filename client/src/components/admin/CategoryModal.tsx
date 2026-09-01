import { useState, useEffect } from 'react'
import { X, Save, Layers, Loader } from 'lucide-react'
import { useCategoryStore } from '@/stores/category.store'
import type { Category } from '@/types/category.type'

interface CategoryModalProps {
  category: Category | null
  onClose: () => void
}

const CategoryModal = ({ category, onClose }: CategoryModalProps) => {
  const { addCategory, updateCategory, isLoading } = useCategoryStore()
  const [name, setName] = useState('')

  useEffect(() => {
    if (category) setName(category.name)
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const success = category ? await updateCategory(category.id, name) : await addCategory(name)
    if (success) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden font-sans transform transition-all scale-100">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Layers size={20} className="text-white/80" />
            {category ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">ชื่อหมวดหมู่</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น เค้ก, เครื่องดื่ม, คุกกี้"
              autoFocus
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-lg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-500 font-bold hover:bg-stone-200 transition-colors">
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal
