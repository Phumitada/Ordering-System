import { useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { Lock, Mail, Phone, Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react'

interface SignupFormProps {
  onSignupSuccess?: () => void
}

const SignupForm = ({ onSignupSuccess }: SignupFormProps) => {
  const register = useAuthStore((state) => state.registration)
  const isLoading = useAuthStore((state) => state.isLoading)
  const errorMsg = useAuthStore((state) => state.errorMsg)
  const [isSuccess, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ email: '', phoneNumber: '', password: '', confirmPassword: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกันครับ')
      return
    }
    const { confirmPassword: _confirmPassword, ...dataToSend } = formData
    const success = await register(dataToSend)
    if (success) {
      setSuccess(true)
      setTimeout(() => {
        onSignupSuccess?.()
      }, 2000)
    }
  }

  return (
    <form className="space-y-3 w-full" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 text-xs rounded-lg border border-green-100 animate-fade-in">
          <CheckCircle size={16} className="shrink-0" />
          <span>สมัครสมาชิกสำเร็จ!</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 ml-1">อีเมล</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="email"
            name="email"
            required
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
            placeholder="user@example.com"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 ml-1">เบอร์โทรศัพท์</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone size={16} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="tel"
            name="phoneNumber"
            required
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
            placeholder="081-234-5678"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 ml-1">รหัสผ่าน</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 ml-1">ยืนยันรหัสผ่าน</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
            placeholder="พิมพ์รหัสผ่านอีกครั้ง"
            onChange={handleChange}
            value={formData.confirmPassword}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`w-full py-2.5 px-4 font-bold text-sm rounded-lg text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all
            ${isLoading || isSuccess ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover active:scale-[0.98]'}`}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> <span>กำลังสมัคร...</span>
            </>
          ) : isSuccess ? (
            <span>สำเร็จ!</span>
          ) : (
            <>
              <UserPlus size={16} /> <span>สมัครสมาชิก</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default SignupForm
