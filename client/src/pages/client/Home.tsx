import { Link } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import { ArrowRight } from 'lucide-react'

// เดิม: pages/client/Home.jsx เป็นแค่ Navbar เปล่าๆ — ตอนนี้ฝั่งลูกค้าสั่งซื้อได้ครบ (Menu/Cart/Checkout/MyOrders) แล้ว
const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-3">ยินดีต้อนรับสู่ Siri Bakery</h1>
        <p className="text-stone-400 mb-8">ความหวานที่ส่งตรงถึงหน้าบ้านคุณ — สั่งง่าย รับของตรงเวลา</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
        >
          ดูเมนูทั้งหมด <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}

export default Home
