import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { ShoppingCart, User, Menu, X, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cartItemCount = useCartStore((s) => s.totalItems())
  const { user, checkMe } = useAuthStore()

  useEffect(() => {
    checkMe().catch((error) => console.error(error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'เมนูทั้งหมด', path: '/menu' },
    { name: 'โปรโมชั่น', path: '/promotions' },
    { name: 'บทความ', path: '/blogs' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans border-b ${
          isScrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-stone-100' : 'bg-white py-4 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
              <div className="scale-90 md:scale-100 transition-transform group-hover:scale-105">
                <Logo />
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-stone-600 font-medium hover:text-primary transition-colors text-sm tracking-wide">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                to="/menu"
                className="hidden lg:flex bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-stone-800 transition-all hover:scale-105 shadow-md items-center gap-2"
              >
                Order
              </Link>
              <div className="hidden md:block h-6 w-px bg-stone-200 mx-1"></div>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/secret-dashboard/dashboard"
                  className="hidden lg:flex bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-stone-800 transition-all hover:scale-105 shadow-md items-center gap-2"
                >
                  จัดการหลังบ้าน
                </Link>
              )}
              <Link to="/profile" className="hidden md:flex p-2 text-stone-600 hover:text-primary transition-all hover:bg-stone-50 rounded-full">
                <User size={22} strokeWidth={2.5} />
              </Link>
              <Link to="/cart" className="relative p-2 text-stone-600 hover:text-primary transition-all hover:bg-stone-50 rounded-full group">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-stone-800 hover:text-primary transition-colors">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-stone-800 font-bold text-lg hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-stone-100 my-4"></div>
            {user?.role === 'ADMIN' && (
              <Link
                to="/secret-dashboard/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-stone-600 font-bold text-lg hover:text-primary transition-colors"
              >
                <LayoutDashboard size={20} />
                จัดการหลังบ้าน
              </Link>
            )}
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors"
            >
              สั่งอาหาร (Order Now)
            </Link>
          </div>
        </div>
      </nav>
      <div className={isScrolled ? 'h-[72px]' : 'h-[80px]'}></div>
    </>
  )
}

export default Navbar
