import { useEffect, useState } from 'react'
import { useUsersStore } from '@/stores/user.store'
import { Users, Search, Mail, Phone, Shield, User, MoreVertical, Trash2, Edit } from 'lucide-react'

const CustomerAdmin = () => {
  const { users, isLoading, isError, errorMsg, fetchUsers } = useUsersStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const RoleBadge = ({ role }: { role: string }) => {
    if (role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-600 border border-purple-200">
          <Shield size={12} /> ADMIN
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-green-100 text-green-600 border border-green-200">
        <User size={12} /> CUSTOMER
      </span>
    )
  }

  const UserAvatar = ({ name }: { name?: string }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?'
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
    ]
    const colorClass = colors[(name?.length ?? 0) % colors.length] || colors[0]

    return <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${colorClass}`}>{initial}</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Users className="text-primary" /> จัดการผู้ใช้งาน
          </h1>
          <p className="text-stone-500 text-sm mt-1">รายชื่อลูกค้าและผู้ดูแลระบบทั้งหมด ({filteredUsers.length} คน)</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เบอร์, อีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="p-10 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-stone-400">กำลังโหลดข้อมูลสมาชิก...</p>
          </div>
        )}

        {isError && (
          <div className="p-10 text-center text-red-500 bg-red-50">
            <p>เกิดข้อผิดพลาด: {errorMsg || 'โหลดข้อมูลไม่สำเร็จ'}</p>
            <button onClick={fetchUsers} className="mt-4 text-sm underline hover:text-red-700">
              ลองใหม่
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white text-xs uppercase tracking-wider border-b border-stone-100">
                  <th className="py-6 pr-6 pl-20 font-bold">ชื่อผู้ใช้งาน</th>
                  <th className="py-6 pr-6 pl-10 font-bold">ข้อมูลติดต่อ</th>
                  <th className="py-6 pr-6 pl-10 font-bold">สถานะ</th>
                  <th className="py-6 pr-6 pl-4 font-bold text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name || user.email} />
                          <div>
                            <p className="font-bold text-stone-800 text-base">{user.name || 'ไม่ระบุชื่อ'}</p>
                            <p className="text-xs text-stone-400 font-mono">ID: {user.id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Phone size={14} className="text-stone-400" />
                            <span className="font-medium">{user.phoneNumber || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-500">
                            <Mail size={14} className="text-stone-400" />
                            <span>{user.email || '-'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <button className="p-2 text-stone-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors" title="แก้ไข">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <button className="block md:hidden text-stone-400 mx-auto group-hover:hidden">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-stone-400">
                      ไม่พบข้อมูลที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="text-right text-xs text-stone-400">แสดงทั้งหมด {filteredUsers.length} รายการ</div>
    </div>
  )
}

export default CustomerAdmin
