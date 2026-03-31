'use client'

import { useState, useEffect } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '905303390931'
const AGENT_NAME = 'Erox Destek'

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleSend() {
    if (!name.trim() || !message.trim()) return
    setSending(true)
    const text = `Merhaba, ben ${name.trim()}.\n\n${message.trim()}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setTimeout(() => {
      setSending(false)
      setOpen(false)
      setName('')
      setMessage('')
    }, 1000)
  }

  if (!mounted) return null

  return (
    <>
      {/* Chat Widget */}
      <div
        className={`fixed bottom-20 lg:bottom-6 right-4 z-[60] transition-all duration-300 ease-out origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{AGENT_NAME}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <p className="text-white/80 text-xs">Çevrimiçi</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#ECE5DD] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d4cfc5%22%20fill-opacity%3D%220.15%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]">
            {/* Welcome bubble */}
            <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm max-w-[85%] mb-3">
              <p className="text-[13px] text-gray-800 leading-relaxed">
                Merhaba! 👋 <strong>EROX</strong>&apos;a hoş geldiniz. Size nasıl yardımcı olabilirim?
              </p>
              <p className="text-[10px] text-gray-400 text-right mt-1">Şimdi</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 space-y-3 border-t border-gray-100">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 outline-none transition placeholder:text-gray-400"
              />
            </div>
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 outline-none transition resize-none placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!name.trim() || !message.trim() || sending}
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  WhatsApp ile Gönder
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 lg:bottom-6 right-4 z-[60] group transition-all duration-300 ${
          open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="WhatsApp ile iletişime geç"
      >
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* Button */}
        <div className="relative w-[60px] h-[60px] rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:bg-[#1ebe57] hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 transition-all duration-200">
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.742 3.05 9.378L1.054 31.29l6.156-1.97C9.78 31.05 12.784 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.594c-.39 1.092-1.926 1.998-3.156 2.264-.842.178-1.942.32-5.646-1.214-4.742-1.962-7.794-6.78-8.032-7.094-.228-.314-1.918-2.556-1.918-4.874s1.214-3.458 1.644-3.932c.43-.474.94-.592 1.252-.592.312 0 .624.002.898.016.288.016.674-.11 1.054.804.39.94 1.326 3.234 1.444 3.468.118.234.196.508.04.82-.158.314-.236.508-.47.784-.236.274-.496.612-.708.822-.236.234-.48.488-.208.96.274.47 1.214 2.002 2.608 3.244 1.79 1.594 3.298 2.088 3.768 2.322.47.234.744.196 1.018-.118.274-.314 1.174-1.37 1.488-1.842.314-.474.626-.39 1.056-.234.43.156 2.724 1.286 3.192 1.52.47.234.782.352.898.546.118.196.118 1.13-.272 2.22z"/>
          </svg>
        </div>

        {/* Online badge */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-[#25D366] rounded-full border-[2.5px] border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Canlı Destek
          <div className="absolute top-full right-5 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-gray-900" />
        </div>
      </button>
    </>
  )
}
