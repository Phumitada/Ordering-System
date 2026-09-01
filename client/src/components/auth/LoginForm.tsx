import { useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const LoginForm = () => {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const errorMsg = useAuthStore((state) => state.errorMsg)

  const [isSuccess, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(formData)
    if (success) {
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } else {
      setSuccess(false)
    }
  }

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-fade-in">
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 text-xs rounded-lg border border-green-100 animate-fade-in">
          <CheckCircle size={16} /> <span>เข้าสู่ระบบสำเร็จ!</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 ml-1">อีเมล</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400 group-focus-within:text-secondary transition-colors" />
          </div>
          <input
            type="email"
            name="email"
            required
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all duration-200"
            placeholder="example@gmail.com"
            onChange={handleChange}
            value={formData.email}
            disabled={isLoading || isSuccess}
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
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all duration-200"
            placeholder="••••••••"
            onChange={handleChange}
            value={formData.password}
            disabled={isLoading || isSuccess}
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Link to="/auth/forgot-password" className="text-xs font-medium text-gray-500 hover:text-primary hover:underline transition-colors">
          ลืมรหัสผ่าน?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading || isSuccess}
        className={`w-full py-3.5 px-4 font-bold text-sm rounded-lg text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-200
          ${isLoading || isSuccess ? 'bg-gray-400 cursor-not-allowed transform-none' : 'bg-primary hover:bg-primary-hover active:scale-[0.98]'}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> <span>กำลังตรวจสอบ...</span>
          </>
        ) : isSuccess ? (
          <span>สำเร็จ!</span>
        ) : (
          'เข้าสู่ระบบ'
        )}
      </button>
    </form>
  )
}
export default LoginForm
