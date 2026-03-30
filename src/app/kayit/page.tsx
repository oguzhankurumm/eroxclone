'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, Mail, Lock, Phone, User, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FB4D8A] border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { setUser } = useAuthStore()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function formatPhone(val: string) {
    const digits = val.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setError('Geçerli bir telefon numarası girin')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: phoneDigits,
          password: form.password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kayıt başarısız')
        setLoading(false)
        return
      }

      setUser(data.user)
      router.push(redirect)
    } catch {
      setError('Bağlantı hatası')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-[#003033]">EROX</span>
          </Link>
          <p className="mt-2 text-[#77777b]">Yeni hesap oluşturun</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FB4D8A]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#FB4D8A]" />
            </div>
            <h1 className="text-xl font-bold text-[#003033]">Kayıt Ol</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#003033] mb-1.5">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b]" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#003033] mb-1.5">
                E-posta <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#003033] mb-1.5">
                Telefon <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b]" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                  placeholder="(5XX) XXX XX XX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#003033] mb-1.5">
                Şifre <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none transition text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77777b] hover:text-[#003033] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#003033] mb-1.5">
                Şifre Tekrar <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77777b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FB4D8A] focus:ring-2 focus:ring-[#FB4D8A]/20 outline-none transition text-sm"
                  required
                  minLength={6}
                />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#FB4D8A] hover:bg-[#e8437d] text-white font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Kayıt Ol
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#77777b]">zaten hesabınız var mı?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link
            href={`/giris${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="block w-full py-3 rounded-xl border-2 border-[#003033] text-[#003033] font-semibold text-center hover:bg-[#003033] hover:text-white transition"
          >
            Giriş Yap
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#77777b] hover:text-[#FB4D8A] transition">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}
