import { Link } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-heading font-bold text-primary mb-3">404</h1>
      <p className="text-stone-500 mb-8">ไม่พบหน้านี้ครับ อาจจะถูกย้ายหรือไม่มีอยู่จริง</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
      >
        <HomeIcon size={18} /> กลับหน้าแรก
      </Link>
    </div>
  )
}

export default NotFound
