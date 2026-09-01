import { useState, useEffect } from 'react'
import { X, Save, Upload, Loader, Package, ChevronDown, Check } from 'lucide-react'
import { useCategoryStore } from '@/stores/category.store'
import { productAdminStore } from '@/stores/product.store'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product.type'

interface EditProductModalProps {
  product: Product
  onClose: () => void
}

const EditProductModal = ({ product, onClose }: EditProductModalProps) => {
  const { categories, getCategories } = useCategoryStore()
  const { editProduct, isLoading } = productAdminStore()

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '' as string | number,
    default_stock: 0 as string | number,
    description: '',
    category: '',
    recommend: false,
  })

  const [imagePreview, setImagePreview] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)

  useEffect(() => {
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        default_stock: product.defaultStock || 20,
        description: product.description || '',
        category: product.categoryId || '',
        recommend: !!product.recommend,
      })
      setImagePreview(product.image || '')
    }
  }, [product])

  const getSelectedCategoryName = () => {
    if (!formData.category) return 'เลือกหมวดหมู่สินค้า'
    const selected = categories.find((c) => c.id === formData.category)
    return selected ? selected.name : 'เลือกหมวดหมู่สินค้า'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append('name', formData.name)
    data.append('price', String(formData.price))
    data.append('default_stock', String(formData.default_stock))
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('recommend', formData.recommend ? 'แนะนำ' : '')

    if (newImageFile) data.append('image', newImageFile)

    const result = await editProduct(product.id, data)

    if (result.success) {
      toast.success('บันทึกการแก้ไขเรียบร้อย!')
      onClose()
    } else {
      toast.error(result.message || 'แก้ไขไม่สำเร็จ')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark">แก้ไขเมนู</h2>
            <p className="text-xs text-stone-400">แก้ไขรายละเอียดของ {product?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 group bg-stone-50">
                <img src={imagePreview || '/placeholder.png'} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="text-white mb-2" size={24} />
                  <span className="text-white text-xs font-bold">เปลี่ยนรูป</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-2/3 space-y-4">
              <div>
                <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">ชื่อเมนู</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">ราคา</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Package size={12} /> ต่อวัน
                  </label>
                  <input
                    type="number"
                    name="default_stock"
                    value={formData.default_stock}
                    onChange={handleChange}
                    className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="relative z-20">
                <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">หมวดหมู่</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full p-3 bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none
                      ${isCategoryOpen ? 'rounded-t-xl rounded-b-none border-b-transparent' : 'rounded-xl'}`}
                  >
                    <span className={`text-sm ${formData.category ? 'text-dark font-medium' : 'text-stone-400'}`}>{getSelectedCategoryName()}</span>
                    <ChevronDown size={18} className={`text-stone-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoryOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                      <ul className="absolute z-20 w-full bg-white border border-stone-100 border-t-0 rounded-b-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200 top-full max-h-48 overflow-y-auto">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between hover:bg-primary-light hover:text-primary ${
                                formData.category === cat.id ? 'bg-primary-light/50 text-primary font-bold' : 'text-stone-600'
                              }`}
                              onClick={() => {
                                setFormData({ ...formData, category: cat.id })
                                setIsCategoryOpen(false)
                              }}
                            >
                              {cat.name}
                              {formData.category === cat.id && <Check size={16} />}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">รายละเอียด</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <input
              type="checkbox"
              name="recommend"
              id="edit-recommend"
              checked={formData.recommend}
              onChange={handleChange}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="edit-recommend" className="text-sm font-bold text-stone-600 cursor-pointer select-none">
              แนะนำเมนูนี้ (Recommended)
            </label>
          </div>
        </form>

        <div className="sticky bottom-0 bg-white p-4 border-t border-stone-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-stone-500 font-bold hover:bg-stone-100 transition-colors">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            บันทึกการแก้ไข
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal
