import { useEffect, useState } from 'react'
import Navbar from '@/components/client/Navbar'
import AddressForm from '@/components/client/AddressForm'
import { useAuthStore } from '@/stores/auth.store'
import { useAddressStore } from '@/stores/address.store'
import { User, Mail, Phone, MapPin, Plus, Trash2, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — หน้าโปรไฟล์ + จัดการที่อยู่จัดส่ง
const Profile = () => {
  const { user, logout } = useAuthStore()
  const { addresses, fetchAddresses, deleteAddress } = useAddressStore()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('ลบที่อยู่นี้ใช่ไหมครับ?')) return
    const success = await deleteAddress(id)
    if (success) toast.success('ลบที่อยู่แล้ว')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-6">โปรไฟล์ของฉัน</h1>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-dark text-lg">{user?.name}</p>
              <p className="text-xs text-stone-400">{user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-stone-600">
              <Mail size={16} className="text-stone-400" /> {user?.email}
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Phone size={16} className="text-stone-400" /> {user?.phoneNumber}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> ที่อยู่จัดส่งที่บันทึกไว้
          </h2>

          {addresses.length > 0 && (
            <div className="space-y-2 mb-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start gap-3 p-3 rounded-xl border border-stone-100">
                  <User size={16} className="text-stone-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-dark">
                      {addr.label} {addr.recipientName && `· ${addr.recipientName}`}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">{addr.addressLine}</p>
                    {addr.phone && <p className="text-xs text-stone-400 mt-0.5">📞 {addr.phone}</p>}
                  </div>
                  <button onClick={() => handleDelete(addr.id)} className="text-stone-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!showAddressForm ? (
            <button
              onClick={() => setShowAddressForm(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> เพิ่มที่อยู่ใหม่
            </button>
          ) : (
            <AddressForm onSaved={() => setShowAddressForm(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
