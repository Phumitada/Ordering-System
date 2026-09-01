import { useState } from 'react'
import { useAddressStore } from '@/stores/address.store'
import { Loader, Save } from 'lucide-react'
import type { AddressPayload } from '@/types/address.type'

interface AddressFormProps {
  onSaved?: () => void
}

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ)
const AddressForm = ({ onSaved }: AddressFormProps) => {
  const { addAddress, isLoading } = useAddressStore()
  const [form, setForm] = useState<AddressPayload>({ label: 'บ้าน', recipient_name: '', phone: '', address_line: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.address_line.trim()) return
    const success = await addAddress(form)
    if (success) {
      setForm({ label: 'บ้าน', recipient_name: '', phone: '', address_line: '' })
      onSaved?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
      <div className="grid grid-cols-2 gap-3">
        <input
          name="label"
          placeholder="ชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน"
          value={form.label}
          onChange={handleChange}
          className="p-3 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
        />
        <input
          name="recipient_name"
          placeholder="ชื่อผู้รับ"
          value={form.recipient_name}
          onChange={handleChange}
          className="p-3 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
        />
      </div>
      <input
        name="phone"
        placeholder="เบอร์โทรผู้รับ"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
      />
      <textarea
        name="address_line"
        placeholder="ที่อยู่เต็ม (บ้านเลขที่ ถนน แขวง เขต จังหวัด รหัสไปรษณีย์)"
        required
        rows={2}
        value={form.address_line}
        onChange={handleChange}
        className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
        บันทึกที่อยู่
      </button>
    </form>
  )
}

export default AddressForm
