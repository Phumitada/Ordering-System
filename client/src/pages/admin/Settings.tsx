import { Settings as SettingsIcon } from 'lucide-react'

// หน้าใหม่ (ไม่มีในต้นฉบับ) — เพิ่มให้เพราะ AdminSidebar มีลิงก์ "ตั้งค่าระบบ" อยู่แล้วแต่ไม่มีหน้าจริงรองรับ
const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <SettingsIcon className="mx-auto text-primary mb-4" size={48} />
      <h1 className="text-2xl font-heading font-bold text-dark mb-2">ตั้งค่าระบบ</h1>
      <p className="text-stone-400">หน้านี้ยังไม่ได้ implement — เพิ่ม field ที่ต้องการตั้งค่าได้ตามต้องการ</p>
    </div>
  )
}

export default Settings
