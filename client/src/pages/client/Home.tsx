import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import { useCategoryStore } from '@/stores/category.store'
import { usePromotionStore } from '@/stores/promotion.store'
import { useBlogStore } from '@/stores/blog.store'
import { productService } from '@/api/services/product.service'
import { ArrowRight, Truck, CalendarCheck, ShieldCheck, Sparkles, Star } from 'lucide-react'
import type { Product } from '@/types/product.type'

const features = [
  { icon: Sparkles, title: 'อบสดใหม่ทุกวัน', desc: 'ทุกเมนูอบใหม่ตามรอบวันที่ลูกค้าเลือกรับของ ไม่มีค้างสต็อก' },
  { icon: CalendarCheck, title: 'เลือกวันรับของเอง', desc: 'จองล่วงหน้าได้ เช็คสต็อกจริงตามวันที่ต้องการก่อนสั่ง' },
  { icon: Truck, title: 'รับที่ร้านหรือจัดส่ง', desc: 'สะดวกแบบไหน เลือกได้ตามที่ต้องการในขั้นตอนเดียว' },
  { icon: ShieldCheck, title: 'ชำระเงินปลอดภัย', desc: 'แจ้งสลิปง่าย ติดตามสถานะออเดอร์แบบเรียลไทม์' },
]

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — เดิมหน้าแรกมีแค่ Navbar กับปุ่มเดียว ตอนนี้ทำเป็น landing page เต็มรูปแบบ
// ดึงข้อมูลจริงมาโชว์ (เมนูยอดฮิต/หมวดหมู่/โปรโมชั่น/บทความ) แทนเนื้อหา static ล้วน
const Home = () => {
  const { categories, getCategories } = useCategoryStore()
  const { promotions, getPromotions } = usePromotionStore()
  const { posts, getPosts } = useBlogStore()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])

  useEffect(() => {
    getCategories()
    getPromotions()
    getPosts()

    productService
      .list({ is_active: 'true', limit: 20 } as any)
      .then((res) => {
        const recommended = res.products.filter((p) => p.recommend)
        const rest = res.products.filter((p) => !p.recommend)
        setPopularProducts([...recommended, ...rest].slice(0, 8))
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section>
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-dark mb-4 leading-tight">
            ยินดีต้อนรับสู่ <span className="text-primary">Siri Bakery</span>
          </h1>
          <p className="text-stone-500 text-base sm:text-lg max-w-xl mx-auto mb-8">
            ความหวานที่ส่งตรงถึงหน้าบ้านคุณ — เลือกเมนู เลือกวันรับของ แล้วปล่อยที่เหลือให้เราจัดการ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 w-full sm:w-auto justify-center"
            >
              ดูเมนูทั้งหมด <ArrowRight size={18} />
            </Link>
            <Link
              to="/promotions"
              className="inline-flex items-center gap-2 bg-white text-dark px-8 py-3.5 rounded-xl font-bold border border-stone-200 hover:border-primary/40 transition-all w-full sm:w-auto justify-center"
            >
              ดูโปรโมชั่น
            </Link>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-0 lg:divide-x divide-stone-100 border-t border-b border-stone-100 py-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 px-4 py-3 lg:py-0">
              <f.icon size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-dark text-sm">{f.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular menu */}
      {popularProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark">เมนูยอดฮิต</h2>
              <p className="text-stone-400 text-sm mt-1">เมนูที่ลูกค้าสั่งบ่อยและร้านแนะนำ</p>
            </div>
            <Link to="/menu" className="hidden sm:inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline whitespace-nowrap">
              ดูทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                to="/menu"
                className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-stone-100 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.recommend && (
                    <span className="absolute top-3 left-3 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={11} className="fill-amber-500 text-amber-500" /> แนะนำ
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark truncate text-sm sm:text-base">{product.name}</h3>
                  <p className="text-primary font-bold mt-1">฿{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category showcase */}
      {categories.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-6 text-center">เลือกช้อปตามหมวดหมู่</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/menu?category=${cat.id}`}
                  className="bg-white border border-stone-200 hover:border-primary hover:text-primary text-dark font-bold px-6 py-3 rounded-2xl shadow-sm transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotions teaser */}
      {promotions.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark">โปรโมชั่นตอนนี้</h2>
            <Link to="/promotions" className="hidden sm:inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline whitespace-nowrap">
              ดูทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {promotions.slice(0, 2).map((promo) => (
              <Link
                key={promo.id}
                to="/promotions"
                className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {promo.badgeText && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">{promo.badgeText}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-dark text-lg">{promo.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark">บทความจากร้านเรา</h2>
              <Link to="/blogs" className="hidden sm:inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline whitespace-nowrap">
                อ่านทั้งหมด <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/blogs/${post.slug}`}
                  className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[16/9] bg-stone-100 overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-dark line-clamp-2 group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-primary text-sm font-bold">
                      อ่านต่อ <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center border-t border-stone-100">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-3">พร้อมสั่งของอร่อยๆ แล้วหรือยัง?</h2>
        <p className="text-stone-500 mb-8">เลือกวันที่รับของ แล้วเริ่มช้อปเมนูโปรดของคุณได้เลย</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
        >
          เริ่มสั่งเลย <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}

export default Home
