import { useEffect } from 'react'
import Navbar from '@/components/client/Navbar'
import { useSettingsStore } from '@/stores/settings.store'
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle, Loader } from 'lucide-react'

const Contact = () => {
  const { settings, getSettings, isLoading } = useSettingsStore()

  useEffect(() => {
    getSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark">ติดต่อเรา</h1>
          <p className="text-stone-400 text-sm mt-1">ยินดีต้อนรับทุกคำถามและคำสั่งซื้อครับ</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={36} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-dark mb-1">{settings?.shopName || 'Siri Bakery'}</h2>
            {settings?.description && <p className="text-sm text-stone-500 mb-6">{settings.description}</p>}

            <div className="space-y-4">
              {settings?.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-600">{settings.address}</span>
                </div>
              )}
              {settings?.phoneNumber && (
                <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Phone size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-stone-600">{settings.phoneNumber}</span>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Mail size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-stone-600">{settings.email}</span>
                </a>
              )}
              {(settings?.openTime || settings?.closeTime) && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-stone-600">
                    เปิดทุกวัน {settings.openTime || '-'} - {settings.closeTime || '-'} น.
                  </span>
                </div>
              )}
            </div>

            {(settings?.facebookUrl || settings?.lineId) && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-stone-100">
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-50 text-stone-600 font-bold text-sm hover:bg-primary-light hover:text-primary transition-colors"
                  >
                    <Facebook size={18} /> Facebook
                  </a>
                )}
                {settings?.lineId && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-50 text-stone-600 font-bold text-sm">
                    <MessageCircle size={18} /> LINE: {settings.lineId}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Contact
