import { useState, useEffect } from 'react'
import { productAdminStore } from '@/stores/product.store'
import Pagination from '@/components/common/Pagination'
import SortDropdown from '@/components/common/SortDropdown'
import ProductTableRow from '@/components/admin/ProductTableRow'
import { Search, Loader, Package } from 'lucide-react'
import EditProductModal from '@/components/admin/EditProductModal'
import type { Product } from '@/types/product.type'

const ProductsAdmin = () => {
  const { products, fetchProducts, isLoading, currentPage, totalPages, totalProducts, filters, setFilter } = productAdminStore()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handlePageChange = (page: number) => setFilter({ page })
  const handleSort = (sortValue: string) => {
    const [sort, order] = sortValue.split('-')
    setFilter({ sort, order: order as 'asc' | 'desc', page: 1 })
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setFilter({ search: e.target.value, page: 1 })

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark tracking-tight">คลังเมนูทั้งหมด</h1>
          <p className="text-stone-400 text-sm mt-1">จัดการสินค้าและเมนูในร้านของคุณ</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input
              type="text"
              placeholder="ค้นหาเมนู..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-sm"
              onChange={handleSearch}
              value={filters.search}
            />
          </div>
          <div className="flex justify-end">
            <SortDropdown currentValue={`${filters.sort}-${filters.order}`} onSort={handleSort} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary">
              <tr>
                <th className="pl-10 sm:pl-30 pr-3 py-4 sm:py-5 text-[11px] sm:text-[13px] uppercase font-heading text-stone-100 text-left">รูป</th>
                <th className="pl-5 px-4 py-4 sm:py-5 text-[11px] sm:text-[13px] uppercase font-heading text-stone-100 text-left">เมนู</th>
                <th className="hidden sm:table-cell px-6 py-4 sm:py-5 text-[11px] sm:text-[13px] uppercase font-heading text-stone-100 text-center">ราคา</th>
                <th className="px-3 sm:px-6 py-4 sm:py-5 text-[11px] sm:text-[13px] uppercase font-heading text-stone-100 text-center">สถานะ</th>
                <th className="px-3 sm:px-6 py-4 sm:py-5 text-[11px] sm:text-[13px] uppercase font-heading text-stone-100 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader className="animate-spin mx-auto text-primary mb-3" size={36} />
                    <p className="text-stone-400 text-sm font-medium">กำลังโหลดข้อมูลเมนู...</p>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((item) => <ProductTableRow key={item.id} product={item} onEdit={(product) => setEditingProduct(product)} />)
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="text-stone-300" size={48} />
                      <p className="text-stone-400 font-medium">ไม่พบรายการสินค้า</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />}
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalProducts} itemsPerPage={filters.limit} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default ProductsAdmin
