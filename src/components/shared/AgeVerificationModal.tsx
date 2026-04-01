'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'age-verified'

export function AgeVerificationModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setShow(true)
    }
  }, [])

  if (!show) return null

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShow(false)
  }

  function handleReject() {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="text-5xl mb-4">🔞</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Yaş Doğrulama
        </h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Bu web sitesi yetişkinlere yönelik ürünler içermektedir.
          Devam etmek için <strong>18 yaşından büyük</strong> olduğunuzu onaylamanız gerekmektedir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
          >
            18 Yaşından Büyüğüm
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer"
          >
            18 Yaşından Küçüğüm
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Bu siteye girerek gizlilik politikamızı ve kullanım koşullarımızı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
