import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignUpForm'
import { UserPlus, LogIn } from 'lucide-react'
import Logo from '../ui/Logo'
import { useAuthStore } from '@/stores/auth.store'

const AuthPanel = () => {
  const clearError = useAuthStore((state) => state.clearError)
  const [isRegister, setIsRegister] = useState(false)
  const goToLogin = () => setIsRegister(false)
  const toggleMode = () => {
    setIsRegister(!isRegister)
    clearError()
  }

  return (
    <div className="w-full space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto px-1 scrollbar-hide">
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
          <Logo className="h-14 lg:h-16 drop-shadow-md transition-all" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading mt-2">
          {isRegister ? 'สร้างบัญชีใหม่' : 'ยินดีต้อนรับกลับ'}
        </h2>
      </div>

      <div className="py-1">{isRegister ? <SignupForm onSignupSuccess={goToLogin} /> : <LoginForm />}</div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="flex-shrink-0 mx-3 text-gray-300 text-[10px] font-medium uppercase tracking-wider">OR</span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <button
        onClick={toggleMode}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-600 font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-primary transition-all duration-200 active:scale-[0.98]"
      >
        {isRegister ? (
          <>
            {' '}
            <LogIn size={16} /> <span>เข้าสู่ระบบ</span>{' '}
          </>
        ) : (
          <>
            {' '}
            <UserPlus size={16} /> <span>สมัครสมาชิกใหม่</span>{' '}
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-gray-300 mt-2 pb-2">© 2025 Siri Bakery System.</p>
    </div>
  )
}

export default AuthPanel
