import { getNavigation } from '@/lib/data'

export function AnnouncementBar() {
  const nav = getNavigation()
  if (!nav.announcementBar.enabled) return null

  return (
    <div className="w-full py-2 px-4 text-center text-white text-xs md:text-sm font-medium"
      style={{ background: 'linear-gradient(90deg, #393185 0%, #FB4D8A 100%)' }}>
      {nav.announcementBar.text}
    </div>
  )
}
