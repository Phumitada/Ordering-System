import { useState, useEffect } from 'react'
import { productAdminStore } from '@/stores/product.store'
import { Plus, Upload, Save, Loader, Tag, Info, ChevronDown, Check, RefreshCw, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCategoryStore } from '@/stores/category.store'

const AddProduct = () => {
  const { AddProduct, isLoading } = productAdminStore()
  const { categories, getCategories } = useCategoryStore()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    default_stock: 20,
    description: '',
    category: '',
    recommend: false,
  })

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])

  useEffect(() => {
    getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (categories.length > 0 && formData.category === '') {
      const defaultCat = categories.find((c) => c.name === 'สินค้าทั่วไป') || categories[0]
      if (defaultCat) {
        setFormData((prev) => ({ ...prev, category: defaultCat.id }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, formData.category])

  const getSelectedCategoryName = () => {
    if (!formData.category) return ''
    const selected = categories.find((c) => c.id === formData.category)
    return selected ? selected.name : ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (uploadedImages.length > 0) URL.revokeObjectURL(uploadedImages[0].preview)
      setUploadedImages([{ file, preview: URL.createObjectURL(file) }])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedImages.length === 0) {
      toast.error('กรุณาเพิ่มรูปภาพสินค้าด้วยครับ')
      return
    }
    if (!formData.category) {
      toast.error('กรุณาเลือกหมวดหมู่สินค้า')
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('default_stock', String(formData.default_stock))
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('recommend', formData.recommend ? 'แนะนำ' : '')
      data.append('image', uploadedImages[0].file)

      const result = await AddProduct(data)
      if (result.success) {
        toast.success('เพิ่มสินค้าสำเร็จ', {
          duration: 3000,
          position: 'top-center',
          style: { borderRadius: '16px', background: '#A4161A', color: '#fff', fontFamily: 'Prompt' },
        })

        setFormData({ name: '', price: '', default_stock: 20, description: '', category: '', recommend: false })
        setUploadedImages([])
      } else {
        toast.error(result.message || 'เพิ่มสินค้าไม่สำเร็จ')
      }
    } catch (error) {
      console.error(error)
      toast.error('ระบบขัดข้องชั่วคราวครับ')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">เพิ่มสินค้าใหม่</h1>
        <p className="text-stone-400 text-sm mt-1">ลงรายการขนมที่อบเสร็จใหม่วันนี้</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold">
              <Plus size={20} />
              <label className="text-sm uppercase tracking-wider text-dark">รูปหน้าปกสินค้า</label>
            </div>
            <div className="relative aspect-square w-full">
              {uploadedImages.length === 0 ? (
                <div className="relative h-full border-2 border-dashed border-stone-200 rounded-3xl transition-all hover:border-primary hover:bg-primary-light/20 flex flex-col items-center justify-center gap-2 text-center group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="p-4 bg-stone-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-stone-300 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs font-medium text-stone-500 px-4">คลิกเพื่อเลือกรูปขนม</p>
                </div>
              ) : (
                <div className="relative h-full rounded-3xl overflow-hidden border border-stone-100 group shadow-md">
                  <img src={uploadedImages[0].preview} className="w-full h-full object-cover" alt="Product Preview" />
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <button type="button" className="bg-white text-dark px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-stone-50 transition-colors">
                        <RefreshCw size={14} className="text-primary" /> เปลี่ยนรูปภาพ
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedImages([])}
                      className="text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-[2px] transition-colors mt-2"
                    >
                      ลบทิ้ง
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-4 text-[10px] text-stone-400 text-center italic">* แนะนำรูปทรงจัตุรัสเพื่อให้แสดงผลสวยที่สุดในหน้าเว็บ</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-dark font-bold ml-1">
                  <Tag size={16} className="text-primary" />
                  <label className="text-xs uppercase tracking-widest">ชื่อขนม</label>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="เช่น ครัวซองต์เลิฟเวอร์"
                  className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-dark ml-1 uppercase tracking-widest block h-5">ราคา (บาท)</label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="0.00"
                  className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary font-medium outline-none transition-all h-[58px]"
                  onChange={handleChange}
                  value={formData.price}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1 text-dark font-bold h-5">
                  <Package size={16} className="text-primary" />
                  <label className="text-xs uppercase tracking-widest">จำนวนที่ทำต่อวัน (โดยปกติ)</label>
                </div>
                <input
                  type="number"
                  name="default_stock"
                  required
                  placeholder="20"
                  className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary font-medium outline-none transition-all h-[58px]"
                  onChange={handleChange}
                  value={formData.default_stock}
                />
              </div>

              <div className="space-y-2 md:col-span-2 relative z-20">
                <label className="text-xs font-bold text-dark ml-1 uppercase tracking-widest">หมวดหมู่สินค้า</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full p-4 bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none
                      ${isCategoryOpen ? 'rounded-t-2xl rounded-b-none border-b-transparent' : 'rounded-2xl'}`}
                  >
                    <span className="text-dark font-medium">{getSelectedCategoryName()}</span>
                    <ChevronDown size={20} className={`text-stone-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoryOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                      <ul className="absolute z-20 w-full bg-white border border-stone-100 border-t-0 rounded-b-2xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200 top-full">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-6 py-3.5 text-sm transition-colors flex items-center justify-between hover:bg-primary-light hover:text-primary ${
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

              <div className="space-y-2 md:col-span-2 relative z-0">
                <div className="flex items-center gap-2 text-dark font-bold ml-1">
                  <Info size={16} className="text-primary" />
                  <label className="text-xs uppercase tracking-widest">รายละเอียด (ถ้ามี)</label>
                </div>
                <textarea
                  name="description"
                  placeholder="เขียนอธิบายความพิเศษของขนม..."
                  rows={3}
                  className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
                  onChange={handleChange}
                  value={formData.description}
                ></textarea>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-6 border-t border-stone-50 mt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="recommend"
                  checked={formData.recommend}
                  onChange={handleChange}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
                <span className="text-sm font-bold text-stone-600 group-hover:text-primary transition-colors">แนะนำโดยทางร้าน</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:bg-stone-300 disabled:shadow-none"
            >
              {isLoading ? <Loader className="animate-spin" /> : <Save size={20} />}
              ลงขายสินค้า
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
