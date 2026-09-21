import { useState, useEffect } from 'react'
import { X, Save, Upload, Loader, Megaphone } from 'lucide-react'
import { usePromotionStore } from '@/stores/promotion.store'
import type { Promotion } from '@/types/promotion.type'

interface PromotionModalProps {
  promotion: Promotion | null
  onClose: () => void
}

const PromotionModal = ({ promotion, onClose }: PromotionModalProps) => {
  const { addPromotion, editPromotion, isLoading } = usePromotionStore()

  const [formData, setFormData] = useState({ title: '', description: '', badge_text: '', is_active: true })
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title,
        description: promotion.description,
        badge_text: promotion.badgeText,
        is_active: promotion.isActive,
      })
      setImagePreview(promotion.image)
    }
  }, [promotion])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    if (!promotion && !imageFile) return

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('badge_text', formData.badge_text)
    data.append('is_active', String(formData.is_active))
    if (imageFile) data.append('image', imageFile)

    const success = promotion ? await editPromotion(promotion.id, data) : await addPromotion(data)
    if (success) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            <Megaphone className="text-primary" size={22} />
            {promotion ? 'แก้ไขโปรโมชั่น' : 'เพิ่มโปรโมชั่นใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 group bg-stone-50">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <Upload size={28} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Upload className="text-white mb-2" size={24} />
              <span className="text-white text-xs font-bold">อัปโหลดรูป</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">ชื่อโปรโมชั่น</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น ลด 20% ทุกวันจันทร์"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">ป้ายกำกับสั้นๆ</label>
            <input
              type="text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleChange}
              placeholder="เช่น ลด 20%, ซื้อ 1 แถม 1"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">รายละเอียด</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <input
              type="checkbox"
              name="is_active"
              id="promo-active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="promo-active" className="text-sm font-bold text-stone-600 cursor-pointer select-none">
              เปิดใช้งาน (แสดงในหน้าโปรโมชั่นของลูกค้า)
            </label>
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

export default PromotionModal
