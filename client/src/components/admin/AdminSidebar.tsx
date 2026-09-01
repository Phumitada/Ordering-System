import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  X,
  PlusCircle,
  Package,
  ClipboardCheck,
  CircleCheckBig,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import Logo from '../ui/Logo'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

  const menuGroups = [
    {
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/secret-dashboard/dashboard' },
        { icon: ClipboardList, label: 'Orders (รายการสั่งจอง)', path: '/secret-dashboard/orders' },
        { icon: CircleCheckBig, label: 'Approve (อนุมัติการจอง)', path: '/secret-dashboard/approve-orders' },
      ],
    },
    {
      items: [
        { icon: Package, label: 'Products (สินค้าทั้งหมด)', path: '/secret-dashboard/products-admin' },
        { icon: PlusCircle, label: 'Add Product (เพิ่มสินค้า)', path: '/secret-dashboard/add-product' },
        { icon: Layers, label: 'Category (หมวดหมู่)', path: '/secret-dashboard/category' },
        { icon: ClipboardCheck, label: 'Manage Daily Stock (จัดการสต็อกวันนี้)', path: '/secret-dashboard/daily-inventory' },
      ],
    },
    {
      items: [{ icon: Users, label: 'Customer (ข้อมูลลูกค้า)', path: '/secret-dashboard/customers' }],
    },
  ]

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm relative group overflow-hidden ${
      isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-stone-600 hover:bg-primary-light hover:text-primary'
    } ${isCollapsed ? 'justify-center px-2' : 'px-4'}`
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-dark/40 z-[90] md:hidden transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:sticky top-0 left-0 z-[100] h-screen bg-white border-r border-stone-100 flex flex-col transition-all duration-300 ease-in-out font-sans
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'md:w-20' : 'md:w-72'}
        `}
      >
        <div
          className={`h-20 flex items-center bg-primary shrink-0 transition-all duration-300 relative ${
            isCollapsed ? 'justify-center px-0' : 'justify-between px-6'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-white p-1 rounded-lg shadow-inner shrink-0">
              <Logo className={isCollapsed ? 'h-7 w-7' : 'h-6 w-6'} />
            </div>
            <span
              className={`text-xl font-heading font-bold text-white tracking-wide whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
              }`}
            >
              Siri Admin
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:bg-white/10 rounded-lg md:hidden absolute right-4">
            <X size={20} />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-24 bg-white border border-stone-200 text-stone-500 rounded-full p-1.5 shadow-md hover:text-primary hover:border-primary transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={`mb-6 last:mb-0 ${isCollapsed ? 'border-b border-stone-100 pb-4 last:border-0' : ''}`}>
              <nav className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <NavLink key={item.path} to={item.path} className={navLinkClasses} onClick={onClose} title={isCollapsed ? item.label : ''}>
                    <item.icon size={20} className="shrink-0" />
                    <span className={`truncate transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-stone-100 bg-stone-50/50">
          <NavLink to="/secret-dashboard/settings" className={({ isActive }) => `${navLinkClasses({ isActive })} mb-2`} onClick={onClose}>
            <Settings size={20} className="shrink-0" />
            <span className={`truncate transition-all ${isCollapsed ? 'hidden' : 'block'}`}>ตั้งค่าระบบ</span>
          </NavLink>
          <button
            onClick={() => {
              logout()
              navigate('/auth/login')
            }}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-stone-500 hover:bg-red-50 hover:text-primary transition-all font-medium text-sm group relative ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            }`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            <span className={`truncate transition-all ${isCollapsed ? 'hidden' : 'block'}`}>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
