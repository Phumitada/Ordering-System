import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const renderPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`min-w-[32px] h-8 flex items-center justify-center text-sm rounded-lg transition-colors
              ${currentPage === i ? 'bg-stone-800 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            {i}
          </button>
        )
      } else if ((i === currentPage - 2 && i > 1) || (i === currentPage + 2 && i < totalPages)) {
        pages.push(
          <span key={`dots-${i}`} className="px-1 text-stone-400">
            ...
          </span>
        )
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-stone-200 bg-white">
      <div className="text-sm text-stone-500">
        Showing <span className="font-semibold text-stone-900">{startItem}</span> -{' '}
        <span className="font-semibold text-stone-900">{endItem}</span> of{' '}
        <span className="font-semibold text-stone-900">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1">{renderPageNumbers()}</div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
export default Pagination
