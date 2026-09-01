import { Edit2, Trash2, Package } from 'lucide-react'
import { productAdminStore } from '@/stores/product.store'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product.type'

interface ProductTableRowProps {
  product: Product
  onEdit: (product: Product) => void
}

const ProductTableRow = ({ product, onEdit }: ProductTableRowProps) => {
  const { deleteProduct, toggleProductStatus } = productAdminStore()
  const imageUrl = product.image || '/placeholder-bread.jpg'

  const handleConfirmDelete = async () => {
    if (window.confirm(`คุณแน่ใจใช่ไหมที่จะลบ "${product.name}"?`)) {
      const success = await deleteProduct(product.id)
      if (success) {
        toast.success('ลบรายการสินค้าเรียบร้อยแล้วครับ')
      } else {
        toast.error('ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      }
    }
  }

  const handleToggle = async () => {
    const success = await toggleProductStatus(product.id, product.isActive)
    if (success) {
      toast.success(product.isActive ? 'ปิดการขายแล้ว' : 'เปิดขายเรียบร้อย')
    } else {
      toast.error('เกิดข้อผิดพลาด')
    }
  }

  return (
    <tr className="hover:bg-stone-50/80 transition-colors border-b border-stone-100 last:border-none group">
      <td className="pl-4 sm:pl-6 pr-3 py-4 align-middle">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </td>

      <td className="px-4 pr-4 pl-4 align-middle">
        <div className="flex flex-col justify-center min-w-[140px]">
          <span className="font-sans font-bold text-dark text-sm sm:text-base leading-tight mb-1.5 ml-1">{product.name}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center bg-stone-100 px-2 py-1 rounded-lg text-stone-600 font-medium text-xs">
              {product.category?.name || 'ไม่ระบุ'}
            </span>
            {product.recommend && (
              <span className="inline-flex items-center bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-medium text-xs border border-amber-200">
                ⭐ แนะนำ
              </span>
            )}
          </div>
          <div className="sm:hidden mt-2.5 flex items-center gap-3 text-xs">
            <span className="font-bold text-primary font-sans">฿{product.price.toLocaleString()}</span>
            <span className="text-stone-400">•</span>
            <span className="flex items-center gap-1 text-stone-500">
              <Package size={12} />
              <span>วันละ {product.defaultStock}</span>
            </span>
          </div>
        </div>
      </td>

      <td className="hidden sm:table-cell px-6 py-4 align-middle">
        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-bold text-primary font-sans">฿{product.price.toLocaleString()}</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 text-xs font-medium">
            <Package size={12} />
            <span>วันละ {product.defaultStock || 0}</span>
          </div>
        </div>
      </td>

      <td className="px-3 sm:px-6 py-4 align-middle">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleToggle}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              product.isActive ? 'bg-green-500 focus:ring-green-300' : 'bg-stone-300 focus:ring-stone-200'
            } hover:shadow-md`}
          >
            <span
              className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                product.isActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-[10px] font-semibold ${product.isActive ? 'text-green-600' : 'text-stone-400'}`}>
            {product.isActive ? 'เปิดขาย' : 'ปิดขาย'}
          </span>
        </div>
      </td>

      <td className="px-3 sm:px-6 py-4 align-middle">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
            title="แก้ไข"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleConfirmDelete}
            className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
            title="ลบ"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ProductTableRow
