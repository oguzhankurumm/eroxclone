'use client'

import { useEffect, useState } from 'react'
import { Save, Phone, Mail, MessageCircle, MapPin, Check } from 'lucide-react'

const settingFields = [
  { key: 'phone', label: 'Telefon Numarası', icon: Phone, placeholder: '+90 532 384 33 37' },
  { key: 'email', label: 'E-posta Adresi', icon: Mail, placeholder: 'info@erox.com.tr' },
  { key: 'whatsapp', label: 'WhatsApp Numarası', icon: MessageCircle, placeholder: '905306659934', hint: 'Başında 90 ile, boşluksuz (örn: 905XXXXXXXXX)' },
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
        <div className="w-8 h-8 border-4 border-[#FB4D8A]/30 border-t-[#FB4D8A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003033]">Site Ayarları</h1>
        <p className="text-sm text-[#77777b] mt-1">İletişim bilgileri ve mağaza adreslerini yönetin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        {settingFields.map(({ key, label, icon: Icon, placeholder, hint, multiline }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-sm font-medium text-[#003033] mb-2">
              <Icon className="w-4 h-4 text-[#FB4D8A]" />
              {label}
            </label>
            {multiline ? (
              <textarea
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm resize-none"
              />
            ) : (
              <input
                type="text"
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none text-sm"
              />
            )}
            {hint && <p className="mt-1 text-xs text-[#77777b]">{hint}</p>}
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FB4D8A] text-white font-medium hover:bg-[#e8437d] transition text-sm disabled:opacity-50"
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
