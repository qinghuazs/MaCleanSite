import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n'

// 「返回顶部」（用户 2026-11-26 要求）。所有页面都有（首页、手册、政策页）。
// 640 以上是固定在视口右下角的圆形按钮：往下滚过大半屏才出现，那里在内容列外面，不挡东西。
// 640 以下（手机）屏幕太窄，浮在右下角会盖住正文和按钮，所以不浮着，改成页脚最后的一个按钮（BackToTopLink）

const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })

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
      onClick={toTop}
      className={`fixed right-6 bottom-6 z-20 hidden size-11 items-center justify-center rounded-full border border-line-2 bg-raised/90 text-ink shadow-lg shadow-black/40 backdrop-blur transition-[opacity,transform,background-color,color] duration-200 hover:bg-ink hover:text-on-accent sm:flex ${
        shown ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
    </button>
  )
}

/** 手机上放在页脚最后的「返回顶部」 */
export function BackToTopLink({ className = '' }: { className?: string }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={toTop}
      className={`inline-flex h-10 items-center gap-2 rounded-full border border-line-2 bg-raised px-4 text-[13px] font-medium text-ink sm:hidden ${className}`}
    >
      {t({ zh: '返回顶部', en: 'Back to top' })}
      <ArrowUp aria-hidden="true" className="size-4" strokeWidth={2.2} />
    </button>
  )
}
