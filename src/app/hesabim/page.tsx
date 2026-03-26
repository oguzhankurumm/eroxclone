import type { Metadata } from 'next'
import Link from 'next/link'
import { User, ShoppingBag, Heart, MapPin, LogIn } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

export const metadata: Metadata = {
  title: 'Hesabım | EROX',
  description: 'EROX hesabınıza giriş yapın veya yeni hesap oluşturun.',
}

export default function AccountPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Hesabım' }]} />

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#FEE8F0] flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-[#FB4D8A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#003033] mb-2">Hesabım</h1>
          <p className="text-sm text-[#77777b]">
            Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="w-full h-[44px] px-4 border border-[#DFE2E6] rounded-xl text-sm focus:outline-none focus:border-[#FB4D8A] transition-colors"
          />
          <input
            type="password"
            placeholder="Şifreniz"
            className="w-full h-[44px] px-4 border border-[#DFE2E6] rounded-xl text-sm focus:outline-none focus:border-[#FB4D8A] transition-colors"
          />
          <button className="w-full h-[44px] bg-[#FB4D8A] hover:bg-[#e8437d] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </button>
        </div>

        <div className="text-center text-sm text-[#77777b] mb-8">
          <p>
            Henüz hesabınız yok mu?{' '}
            <span className="text-[#FB4D8A] font-medium cursor-pointer hover:underline">
              Kayıt Ol
            </span>
          </p>
        </div>

        <div className="border-t border-[#DFE2E6] pt-6 space-y-3">
          <AccountLink icon={ShoppingBag} label="Siparişlerim" description="Sipariş durumunuzu takip edin" />
          <AccountLink icon={Heart} label="Favorilerim" description="Beğendiğiniz ürünleri görüntüleyin" />
          <AccountLink icon={MapPin} label="Adreslerim" description="Teslimat adreslerinizi yönetin" />
        </div>
      </div>
    </div>
  )
}

function AccountLink({ icon: Icon, label, description }: { icon: React.ElementType; label: string; description: string }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-[#DFE2E6] rounded-xl hover:border-[#FB4D8A] transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#77777b]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[#003033]">{label}</p>
        <p className="text-xs text-[#77777b]">{description}</p>
      </div>
    </div>
  )
}
