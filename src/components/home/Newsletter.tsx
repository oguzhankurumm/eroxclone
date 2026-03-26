'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      toast.success('E-bülten kaydınız alındı!')
      setEmail('')
    }
  }

  return (
    <section className="py-10 md:py-14" style={{ background: 'linear-gradient(90deg, #393185 0%, #FB4D8A 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          E-Bülten
        </h2>
        <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
          Kampanya ve yeni ürünlerden haberdar olmak için e-bültenimize abone olun.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            className="flex-1 h-[44px] px-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <button
            type="submit"
            className="h-[44px] px-6 bg-white text-[#393085] font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Kaydol
          </button>
        </form>
      </div>
    </section>
  )
}
