import { useEffect } from 'react'
import Navbar from '@/components/client/Navbar'
import { usePromotionStore } from '@/stores/promotion.store'
import { Loader, Megaphone } from 'lucide-react'

const Promotions = () => {
  const { promotions, getPromotions, isLoading } = usePromotionStore()

  useEffect(() => {
    getPromotions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark">โปรโมชั่น</h1>
          <p className="text-stone-400 text-sm mt-1">ดีลพิเศษและส่วนลดประจำเดือนจากร้านเรา</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={36} />
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {promo.badgeText && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                      {promo.badgeText}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-dark text-lg mb-1.5">{promo.title}</h3>
                  {promo.description && <p className="text-sm text-stone-500">{promo.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <Megaphone size={48} className="text-stone-300 mb-3" />
            <p className="text-stone-400 font-medium">ยังไม่มีโปรโมชั่นในตอนนี้</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Promotions
