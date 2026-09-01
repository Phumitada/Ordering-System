import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — guard สำหรับ "ผู้ใช้ที่ login แล้ว" ทั่วไป (ไม่บังคับ role admin)
// ต่างจาก ProtectedRoute (เฉพาะ admin) ใช้กับหน้า checkout/my-orders/profile ของลูกค้า
const RequireAuth = () => {
  const { checkMe, isAuthenticated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    checkMe().finally(() => setIsChecking(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
