import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'

interface ImageModalProps {
  isOpen: boolean
  imageUrl: string | null
  onClose: () => void
}

const ImageModal = ({ isOpen, imageUrl, onClose }: ImageModalProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (imageUrl) {
      setLoading(true)
      setError(false)
    }
  }, [imageUrl])

  if (!isOpen || !imageUrl) return null

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative max-w-lg w-full max-h-[90vh] flex justify-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 hover:scale-110 transition">
          <X size={22} />
        </button>

        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg">
            <Loader2 className="animate-spin text-gray-500" size={32} />
          </div>
        )}

        {error && <div className="flex items-center justify-center bg-white rounded-lg p-6 text-gray-500">โหลดรูปไม่สำเร็จ</div>}

        <img
          src={imageUrl}
          alt="Payment Slip"
          className={`max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain bg-white transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
        />
      </div>
    </div>
  )
}

export default ImageModal
