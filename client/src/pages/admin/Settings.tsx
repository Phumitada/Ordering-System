import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Loader, Store, Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'
import { useSettingsStore } from '@/stores/settings.store'

const Settings = () => {
  const { settings, getSettings, updateSettings, isLoading } = useSettingsStore()
  const [formData, setFormData] = useState({
    shopName: '',
    phoneNumber: '',
    email: '',
    address: '',
    openTime: '',
    closeTime: '',
    facebookUrl: '',
    lineId: '',
    description: '',
  })

  useEffect(() => {
    getSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName,
        phoneNumber: settings.phoneNumber,
        email: settings.email,
        address: settings.address,
        openTime: settings.openTime,
        closeTime: settings.closeTime,
        facebookUrl: settings.facebookUrl,
        lineId: settings.lineId,
        description: settings.description,
      })
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateSettings(formData)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
          <SettingsIcon className="text-primary" size={32} />
          ตั้งค่าระบบ
        </h1>
        <p className="text-stone-400 text-sm mt-1">ข้อมูลร้านที่แสดงในหน้า "ติดต่อเรา" ของลูกค้า</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Store size={14} /> ชื่อร้าน
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone size={14} /> เบอร์โทร
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="08x-xxx-xxxx"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail size={14} /> อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="shop@example.com"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin size={14} /> ที่อยู่ร้าน
          </label>
          <textarea
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock size={14} /> เวลาเปิด
            </label>
            <input
              type="time"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock size={14} /> เวลาปิด
            </label>
            <input
              type="time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Facebook size={14} /> ลิงก์ Facebook
            </label>
            <input
              type="text"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageCircle size={14} /> LINE ID
            </label>
            <input
              type="text"
              name="lineId"
              value={formData.lineId}
              onChange={handleChange}
              placeholder="@siribakery"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">คำอธิบายร้าน</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="แนะนำร้านสั้นๆ ให้ลูกค้าเห็นในหน้าติดต่อเรา"
            className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            บันทึกการตั้งค่า
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
