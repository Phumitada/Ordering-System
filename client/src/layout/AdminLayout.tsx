import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

// เดิม: layouts/AdminLayout.jsx — ตอนนี้การเช็คสิทธิ์ (checkMe + role) ย้ายไปอยู่ที่ ProtectedRoute แล้ว
// AdminLayout เหลือหน้าที่แค่จัด layout (sidebar + mobile header) ล้วนๆ
const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="flex items-center justify-between px-4 h-16 bg-primary text-white shadow-md md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="font-heading font-bold tracking-wide">Siri Admin</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
