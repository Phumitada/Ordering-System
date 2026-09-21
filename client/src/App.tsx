import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@/layout/AdminLayout'
import ProtectedRoute from '@/protected/ProtectedRoute'
import RequireAuth from '@/protected/RequireAuth'
import Login from '@/pages/Login'
import Home from '@/pages/client/Home'
import Menu from '@/pages/client/Menu'
import Cart from '@/pages/client/Cart'
import Checkout from '@/pages/client/Checkout'
import MyOrders from '@/pages/client/MyOrders'
import OrderDetail from '@/pages/client/OrderDetail'
import Profile from '@/pages/client/Profile'
import Promotions from '@/pages/client/Promotions'
import Blogs from '@/pages/client/Blogs'
import BlogDetail from '@/pages/client/BlogDetail'
import Contact from '@/pages/client/Contact'
import NotFound from '@/pages/NotFound'
import AddProduct from '@/pages/admin/AddProduct'
import ProductsAdmin from '@/pages/admin/ProductsAdmin'
import ApproveOrderPage from '@/pages/admin/ApproveOrderPage'
import ActiveOrderPage from '@/pages/admin/ActiveOrderPage'
import CategoryAdmin from '@/pages/admin/CategoryAdmin'
import DailyInventory from '@/pages/admin/DailyInventory'
import Dashboard from '@/pages/admin/Dashboard'
import CustomerAdmin from '@/pages/admin/CustomerAdmin'
import PromotionsAdmin from '@/pages/admin/PromotionsAdmin'
import BlogAdmin from '@/pages/admin/BlogAdmin'
import Settings from '@/pages/admin/Settings'

const App = () => {
  return (
    <div className="font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ต้อง login ก่อน (ไม่ต้องเป็น admin) ถึงจะ checkout/ดูประวัติ/จัดการโปรไฟล์ได้ */}
        <Route element={<RequireAuth />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* เดิม: การเช็คสิทธิ์ admin อยู่ใน AdminLayout เอง — ตอนนี้แยกเป็น ProtectedRoute ครอบไว้ชั้นนอกแทน */}
        <Route element={<ProtectedRoute />}>
          <Route path="/secret-dashboard" element={<AdminLayout />}>
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products-admin" element={<ProductsAdmin />} />
            <Route path="approve-orders" element={<ApproveOrderPage />} />
            <Route path="orders" element={<ActiveOrderPage />} />
            <Route path="category" element={<CategoryAdmin />} />
            <Route path="daily-inventory" element={<DailyInventory />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerAdmin />} />
            <Route path="promotions-admin" element={<PromotionsAdmin />} />
            <Route path="blog-admin" element={<BlogAdmin />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
