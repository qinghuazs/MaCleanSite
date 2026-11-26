import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n'

// 右下角的「返回顶部」按钮（用户 2026-11-26 要求）：往下滚过大半屏才出现，点了回到页面最上面。
// 所有页面都有（首页、手册、政策页），固定在视口右下角

export function BackToTop() {
  const { t } = useLang()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.6)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const label = t({ zh: '返回顶部', en: 'Back to top' })
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // 没出现时不能点、键盘也跳过
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
      className={`fixed right-4 bottom-4 z-20 flex size-10 items-center justify-center rounded-full border border-line-2 bg-raised/90 text-ink shadow-lg shadow-black/40 backdrop-blur transition-[opacity,transform,background-color,color] duration-200 hover:bg-ink hover:text-on-accent desk:right-6 desk:bottom-6 desk:size-11 ${
        shown ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
    </button>
  )
}
