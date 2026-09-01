import { forwardRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { th } from 'date-fns/locale'
import { Calendar, ChevronDown } from 'lucide-react'

registerLocale('th', th)

interface CustomInputProps {
  value?: string
  onClick?: () => void
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    type="button"
    className="group flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-sm hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 active:scale-95 transition-all duration-200 w-full md:w-auto"
  >
    <div className="w-10 h-10 rounded-xl bg-stone-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
      <Calendar size={20} />
    </div>
    <div className="flex flex-col items-start mr-2">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">ประจำวันที่</span>
      <span className="text-base font-bold text-dark leading-none mt-1">{value || 'เลือกวันที่'}</span>
    </div>
    <ChevronDown size={16} className="text-stone-300 group-hover:text-primary transition-colors ml-auto" />
  </button>
))
CustomInput.displayName = 'CustomInput'

interface ModernDatePickerProps {
  selectedDate: string
  onChange: (dateStr: string) => void
}

const ModernDatePicker = ({ selectedDate, onChange }: ModernDatePickerProps) => {
  return (
    <>
      <style>{`
        .react-datepicker {
          font-family: 'Prompt', sans-serif;
          border: none;
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 1rem;
          background-color: white;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: none;
          padding-bottom: 1rem;
        }
        .react-datepicker__current-month {
          font-size: 1.1rem;
          font-weight: 800;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .react-datepicker__day-name {
          color: #a8a29e;
          font-weight: bold;
          width: 2.5rem;
        }
        .react-datepicker__day {
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          border-radius: 0.75rem;
          margin: 0.2rem;
          font-weight: 500;
          color: #444;
        }
        .react-datepicker__day:hover {
          background-color: #f5f5f4;
          border-radius: 0.75rem;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #A4161A !important;
          color: white !important;
          font-weight: bold;
          box-shadow: 0 4px 6px -1px rgba(164, 22, 26, 0.3);
        }
        .react-datepicker__day--today {
          font-weight: bold;
          color: #A4161A;
        }
        .react-datepicker__navigation {
          top: 1.2rem;
        }
      `}</style>
      <div className="relative z-50">
        <DatePicker
          selected={selectedDate ? new Date(selectedDate) : new Date()}
          onChange={(date: Date | null) => {
            if (!date) return
            const dateStr = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
            onChange(dateStr)
          }}
          customInput={<CustomInput />}
          dateFormat="d MMMM yyyy"
          locale="th"
          shouldCloseOnSelect
          popperPlacement="bottom-end"
        />
      </div>
    </>
  )
}

export default ModernDatePicker
