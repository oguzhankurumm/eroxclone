'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, CreditCard, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react'

interface IbanAccount {
  id: string
  bankName: string
  accountHolder: string
  ibanNumber: string
  isActive: boolean
  sortOrder: number
}

export default function AdminIbanPage() {
  const [accounts, setAccounts] = useState<IbanAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ bankName: '', accountHolder: '', ibanNumber: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchAccounts() {
    const res = await fetch('/api/admin/iban')
    const data = await res.json()
    setAccounts(data.accounts || [])
    setLoading(false)
  }

  useEffect(() => { fetchAccounts() }, [])

  async function handleSave() {
    if (!form.bankName || !form.accountHolder || !form.ibanNumber) return
    setSaving(true)

    if (editingId) {
      await fetch('/api/admin/iban', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      })
    } else {
      await fetch('/api/admin/iban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }

    setForm({ bankName: '', accountHolder: '', ibanNumber: '' })
    setShowForm(false)
    setEditingId(null)
    setSaving(false)
    fetchAccounts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu IBAN hesabını silmek istediğinize emin misiniz?')) return
    setDeleting(id)
    await fetch('/api/admin/iban', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeleting(null)
    fetchAccounts()
  }

  async function toggleActive(account: IbanAccount) {
    await fetch('/api/admin/iban', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: account.id, isActive: !account.isActive }),
    })
    fetchAccounts()
  }

  function startEdit(account: IbanAccount) {
    setEditingId(account.id)
    setForm({ bankName: account.bankName, accountHolder: account.accountHolder, ibanNumber: account.ibanNumber })
    setShowForm(true)
  }

  function formatIban(val: string) {
    const clean = val.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    return clean.match(/.{1,4}/g)?.join(' ') || clean
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">IBAN Hesapları</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Havale/EFT için banka hesaplarını yönetin</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ bankName: '', accountHolder: '', ibanNumber: '' }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/80 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni IBAN Ekle
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {editingId ? 'IBAN Düzenle' : 'Yeni IBAN Ekle'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Banka Adı</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="örn: Ziraat Bankası"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Hesap Sahibi</label>
                <input
                  type="text"
                  value={form.accountHolder}
                  onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                  placeholder="örn: EROX TİCARET A.Ş."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">IBAN Numarası</label>
                <input
                  type="text"
                  value={form.ibanNumber}
                  onChange={(e) => setForm({ ...form, ibanNumber: formatIban(e.target.value) })}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm font-mono"
                  maxLength={32}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] font-medium hover:bg-[var(--surface-2)] transition text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.bankName || !form.accountHolder || !form.ibanNumber}
                  className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/80 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingId ? 'Güncelle' : 'Kaydet'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <CreditCard className="w-12 h-12 text-[var(--muted-foreground)]/40 mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Henüz IBAN hesabı eklenmemiş</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-sm text-[var(--primary)] font-medium hover:underline"
          >
            İlk IBAN hesabını ekleyin →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`bg-[var(--card)] rounded-xl border p-5 transition ${
                account.isActive ? 'border-[var(--border)] hover:border-[var(--primary)]/30' : 'border-[var(--border)] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--muted-foreground)]/30 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--foreground)]">{account.bankName}</h3>
                      {!account.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--surface-3)] text-[var(--muted-foreground)]">Pasif</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">{account.accountHolder}</p>
                    <p className="text-sm font-mono text-[var(--foreground)] mt-1">{account.ibanNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(account)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-3)] transition"
                    title={account.isActive ? 'Pasif yap' : 'Aktif yap'}
                  >
                    {account.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(account)}
                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    disabled={deleting === account.id}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
