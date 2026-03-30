'use client'

import { useEffect, useState } from 'react'
import { Users, Shield, ShieldOff } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  phone: string
  role: string
  createdAt: string
  _count: { orders: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchUsers() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  async function toggleRole(user: User) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (newRole === 'USER' && !confirm(`${user.email} kullanıcısının admin yetkisini kaldırmak istediğinize emin misiniz?`)) return
    if (newRole === 'ADMIN' && !confirm(`${user.email} kullanıcısını admin yapmak istediğinize emin misiniz?`)) return

    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, role: newRole }),
    })
    fetchUsers()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FB4D8A]/30 border-t-[#FB4D8A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003033]">Kullanıcılar</h1>
        <p className="text-sm text-[#77777b] mt-1">{users.length} kayıtlı kullanıcı</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-[#77777b]/40 mx-auto mb-4" />
          <p className="text-[#77777b]">Henüz kullanıcı bulunmuyor</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Kullanıcı</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Telefon</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Sipariş</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider">Kayıt</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#77777b] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#003033]">{user.name || '-'}</p>
                      <p className="text-xs text-[#77777b]">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#77777b]">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#003033] font-medium">{user._count.orders}</td>
                    <td className="px-6 py-4 text-sm text-[#77777b]">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRole(user)}
                        className={`p-2 rounded-lg transition ${
                          user.role === 'ADMIN'
                            ? 'hover:bg-red-50 text-red-500'
                            : 'hover:bg-purple-50 text-purple-500'
                        }`}
                        title={user.role === 'ADMIN' ? 'Admin yetkisini kaldır' : 'Admin yap'}
                      >
                        {user.role === 'ADMIN' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
