import type { ReactNode } from 'react'

interface SplitScreenProps {
  left: ReactNode
  right: ReactNode
}

const SplitScreen = ({ left, right }: SplitScreenProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-50/50 p-4 font-sans">
      <div className="flex w-full max-w-5xl h-[85vh] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
        <div className="hidden lg:flex w-1/2 relative bg-gray-900">{left}</div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
          <div className="w-full max-w-md">{right}</div>
        </div>
      </div>
    </div>
  )
}

export default SplitScreen
