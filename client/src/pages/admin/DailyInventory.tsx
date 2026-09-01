import { useEffect } from 'react'
import { useInventoryStore } from '@/stores/inventory.store'
import { Calendar, Package, AlertCircle, TrendingUp, Archive } from 'lucide-react'
import ModernDatePicker from '@/components/ui/ModernDatePicker'

const DailyInventory = () => {
  const { inventories, getInventories, isLoading, dateStr, setDate } = useInventoryStore()

  useEffect(() => {
    getInventories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProgressBarColor = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100
    if (percentage === 0) return 'bg-stone-300'
    if (percentage < 20) return 'bg-red-500'
    return 'bg-primary'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Package className="text-primary" size={28} />
            สต็อกสินค้าประจำวัน
          </h1>
          <p className="text-stone-400 text-sm mt-1">จัดการและตรวจสอบจำนวนสินค้าที่พร้อมขายในแต่ละวัน</p>
        </div>
        <div>
          <ModernDatePicker selectedDate={dateStr} onChange={(newDateStr) => setDate(newDateStr)} />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : inventories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventories.map((item) => {
            const percent = (item.stats.available / item.stats.capacity) * 100
            const isSoldOut = item.stats.available === 0

            return (
              <div
                key={item.id}
                className={`relative group bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSoldOut ? 'border-stone-100 opacity-80' : 'border-stone-100 hover:border-primary/30'
                }`}
              >
                <div className="h-40 bg-stone-100 relative overflow-hidden">
                  <img
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? 'grayscale' : ''}`}
                  />
                  <div className="absolute top-3 right-3">
                    {isSoldOut ? (
                      <span className="bg-stone-800/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Archive size={12} /> หมดแล้ว
                      </span>
                    ) : (
                      <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        พร้อมขาย
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-lg text-dark line-clamp-1" title={item.product.name}>
                      {item.product.name}
                    </h2>
                    <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">฿{item.product.price}</span>
                  </div>
                  <div className="mt-4 mb-2">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={isSoldOut ? 'text-red-500' : 'text-stone-500'}>
                        {isSoldOut ? 'สินค้าหมด' : `คงเหลือ ${item.stats.available} ชิ้น`}
                      </span>
                      <span className="text-stone-300">จาก {item.stats.capacity}</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(item.stats.available, item.stats.capacity)}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-50 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5" title="ขายไปแล้ว">
                      <TrendingUp size={14} className={item.stats.sold > 0 ? 'text-green-500' : ''} />
                      <span>
                        ขายแล้ว: <b className="text-dark">{item.stats.sold}</b>
                      </span>
                    </div>
                    {item.stats.reserved > 0 && (
                      <div className="flex items-center gap-1.5 text-orange-400" title="ติดจอง (รอจ่ายเงิน)">
                        <AlertCircle size={14} />
                        <span>
                          จอง: <b>{item.stats.reserved}</b>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
          <Package size={64} className="text-stone-300 mb-4" />
          <h3 className="text-xl font-bold text-stone-500">ไม่พบข้อมูลสต็อกของวันที่นี้</h3>
          <p className="text-stone-400 mt-2 text-sm">ระบบอาจจะยังไม่เปิดร้าน หรือเป็นวันที่ในอนาคต</p>
          <button
            onClick={() => setDate(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }))}
            className="mt-6 text-primary font-bold hover:underline"
          >
            กลับมาดูวันนี้
          </button>
        </div>
      )}
    </div>
  )
}

export default DailyInventory
