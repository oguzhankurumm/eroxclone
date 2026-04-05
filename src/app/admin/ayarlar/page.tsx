'use client'

import { useEffect, useState } from 'react'
import { Save, Phone, Mail, MessageCircle, MapPin, Check } from 'lucide-react'

const settingFields = [
  { key: 'phone', label: 'Telefon Numarası', icon: Phone, placeholder: '+90 553 127 14 04' },
  { key: 'email', label: 'E-posta Adresi', icon: Mail, placeholder: 'info@erox.com.tr' },
  { key: 'whatsapp', label: 'WhatsApp Numarası', icon: MessageCircle, placeholder: '905531271404', hint: 'Başında 90 ile, boşluksuz (örn: 905XXXXXXXXX)' },
  { key: 'address_mecidiyekoy', label: 'Mecidiyeköy Mağaza Adresi', icon: MapPin, placeholder: 'Adres...', multiline: true },
  { key: 'address_ankara', label: 'Ankara Mağaza Adresi', icon: MapPin, placeholder: 'Adres...', multiline: true },
  { key: 'address_kadikoy', label: 'Kadıköy Mağaza Adresi', icon: MapPin, placeholder: 'Adres...', multiline: true },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data.settings || {})
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Site Ayarları</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">İletişim bilgileri ve mağaza adreslerini yönetin</p>
      </div>

      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 space-y-6">
        {settingFields.map(({ key, label, icon: Icon, placeholder, hint, multiline }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-2">
              <Icon className="w-4 h-4 text-[var(--primary)]" />
              {label}
            </label>
            {multiline ? (
              <textarea
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm resize-none"
              />
            ) : (
              <input
                type="text"
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm"
              />
            )}
            {hint && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{hint}</p>}
          </div>
        ))}

        <div className="pt-4 border-t border-[var(--border)]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/80 transition text-sm disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Kaydedildi!' : saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
