import { ArrowDown, ArrowDownRight, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import appIcon from '../assets/app-icon.png'
import { useLang } from '../i18n'
import { links, type PageDepth } from '../paths'
import { site } from '../site.config'

// 页头：应用图标 + 名称、导航、语言切换、下载按钮。
// 1080 以上导航横排；以下收进「菜单」，点开后逐项列出首页各区块和用户手册

export function Header({ depth }: { depth: PageDepth }) {
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const l = links(depth)
  // 首页的内容列在窄屏上最宽 480，页头跟着收窄；手册页、政策页用满宽度。
  // 英文「Download」「Menu」比中文长，360 宽的手机上要再收一点才不会顶到名称；
  // 再窄（320）就不显示页头的下载按钮，首屏里还有一个
  const wrap = depth === 0 ? 'wrap' : 'wrap-wide'

  const nav = [
    { href: l.section('features'), label: { zh: '功能', en: 'Features' } },
    { href: l.section('pricing'), label: { zh: '价格', en: 'Pricing' } },
    { href: l.section('faq'), label: { zh: '常见问题', en: 'FAQ' } },
    { href: l.guide, label: { zh: '手册', en: 'Guide' } },
  ]
  const menu = [
    { href: l.section('system-data'), label: { zh: '系统数据', en: 'System Data' } },
    { href: l.section('scan'), label: { zh: '扫描结果', en: 'Scan Results' } },
    { href: l.section('uninstall'), label: { zh: '卸载应用', en: 'Uninstall Apps' } },
    { href: l.section('mcp'), label: { zh: 'MCP\u2002·\u2002AI 助手', en: 'MCP\u2002·\u2002AI assistants' } },
    { href: l.section('pricing'), label: { zh: '价格', en: 'Pricing' } },
    { href: l.section('faq'), label: { zh: '常见问题', en: 'FAQ' } },
    { href: l.guide, label: { zh: '用户手册', en: 'User Guide' }, page: true },
  ]

  const langSwitch = (
    <button
      type="button"
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
      className="flex h-11 shrink-0 items-center rounded-lg px-1.5 text-[14px] font-semibold whitespace-nowrap text-muted transition-colors hover:text-ink desk:px-3"
    >
      {lang === 'zh' ? 'EN' : '中文'}
    </button>
  )

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className={`${wrap} flex h-[66px] items-center justify-between desk:h-[76px]`}>
        <a href={l.home} className="flex shrink-0 items-center gap-2 rounded-md">
          <img src={appIcon} alt="" width={34} height={34} className="size-7 desk:size-[34px]" />
          <span className="text-[20px] leading-none font-bold tracking-[-0.01em] desk:text-[24px]">{site.name}</span>
        </a>

        <nav aria-label={t({ zh: '页面导航', en: 'Page sections' })} className="hidden desk:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[14px] font-medium text-muted transition-colors hover:text-ink">
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 desk:gap-3">
          {langSwitch}
          <a
            href={l.section('download')}
            className="inline-flex h-10 shrink-0 items-center max-[349px]:hidden gap-[9px] rounded-full bg-accent px-3 text-[14px] font-medium whitespace-nowrap text-on-accent transition-colors hover:bg-white max-[374px]:px-2.5 max-[374px]:text-[13px] desk:h-[50px] desk:px-[19px]"
          >
            {t({ zh: '下载', en: 'Download' })}
            <ArrowDown aria-hidden="true" className="hidden size-4 desk:block" strokeWidth={2.2} />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
            className="flex h-11 shrink-0 items-center rounded-[10px] bg-raised px-3 text-[14px] font-bold whitespace-nowrap text-ink max-[374px]:px-2.5 max-[374px]:text-[13px] desk:hidden"
          >
            {open ? t({ zh: '收起', en: 'Close' }) : t({ zh: '菜单', en: 'Menu' })}
          </button>
        </div>
      </div>

      {open && (
        <nav id="site-menu" aria-label={t({ zh: '菜单', en: 'Menu' })} className={`${wrap} pb-2 desk:hidden`}>
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex h-[45px] items-center justify-between rounded-md bg-surface px-3.5 text-[15px] font-bold text-ink"
                >
                  {t(item.label)}
                  {item.page ? (
                    <ArrowRight aria-hidden="true" className="size-4 text-accent" />
                  ) : (
                    <ArrowDownRight aria-hidden="true" className="size-4 text-accent" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
