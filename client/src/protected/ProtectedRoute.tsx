import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

// เดิม: การเช็คสิทธิ์ admin อยู่ปนใน AdminLayout.jsx (checkMe + role check + navigate)
// แยกออกมาเป็น guard เดี่ยวๆ ตามแบบ Hotel-Booking-System (AdminGuard) ให้ใช้ซ้ำได้ / อ่านง่ายขึ้น
const ProtectedRoute = () => {
  const { checkMe, user, isAuthenticated, isCheckingAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async () => {
      const ok = await checkMe()
      if (!ok) {
        navigate('/auth/login')
      }
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-heading text-primary animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
