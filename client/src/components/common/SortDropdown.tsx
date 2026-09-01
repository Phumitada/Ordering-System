import { ChevronDown } from 'lucide-react'

interface SortDropdownProps {
  currentValue: string
  onSort: (value: string) => void
}

const SortDropdown = ({ currentValue, onSort }: SortDropdownProps) => {
  const options = [
    { label: 'ใหม่ล่าสุด', value: 'createdAt-desc' },
    { label: 'ราคา: ต่ำไปสูง', value: 'price-asc' },
    { label: 'ราคา: สูงไปต่ำ', value: 'price-desc' },
    { label: 'ชื่อเมนู: A-Z', value: 'name-asc' },
  ]

  return (
    <div className="relative inline-block text-left group">
      <select
        onChange={(e) => onSort(e.target.value)}
        value={currentValue}
        className="appearance-none bg-stone-50 border border-stone-100 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-stone-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
    </div>
  )
}

export default SortDropdown
