import appIcon from '../assets/app-icon.png'
import { useLang } from '../i18n'
import { links, type PageDepth } from '../paths'
import { site } from '../site.config'

// 页脚：产品简介、政策链接、联系方式；Dodo 审核会看这里有没有服务条款、隐私政策、退款政策
export function Footer({ depth }: { depth: PageDepth }) {
  const { t } = useLang()
  const l = links(depth)
  const year = new Date().getFullYear()

  const columns = [
    {
      title: { zh: '产品', en: 'Product' },
      items: [
        { href: l.section('how'), label: { zh: '怎么看清', en: 'How it works' } },
        { href: l.section('pricing'), label: { zh: '价格', en: 'Pricing' } },
        { href: l.section('faq'), label: { zh: '常见问题', en: 'FAQ' } },
        { href: l.section('download'), label: { zh: '下载', en: 'Download' } },
      ],
    },
    {
      title: { zh: '政策', en: 'Policies' },
      items: [
        { href: l.terms, label: { zh: '服务条款', en: 'Terms of Service' } },
        { href: l.privacy, label: { zh: '隐私政策', en: 'Privacy Policy' } },
        { href: l.refund, label: { zh: '退款政策', en: 'Refund Policy' } },
      ],
    },
  ]

  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <a href={l.home} className="inline-flex items-center gap-2.5">
            <img src={appIcon} alt="" width={28} height={28} className="size-7" />
            <span className="font-serif text-xl font-medium">{site.name}</span>
          </a>
          <p className="mt-3 text-[0.93rem] leading-relaxed text-ink-3">
            {t({
              zh: 'macOS 磁盘清理工具。先看清每一项是什么，再决定删不删。',
              en: 'A disk cleanup app for macOS that explains every item before you decide to delete it.',
            })}
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title.en}>
            <h2 className="font-sans text-sm font-semibold text-ink">{t(col.title)}</h2>
            <ul className="mt-3 space-y-2 text-[0.93rem]">
              {col.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-ink-3 transition-colors hover:text-ink">
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="font-sans text-sm font-semibold text-ink">{t({ zh: '联系', en: 'Contact' })}</h2>
          <ul className="mt-3 space-y-2 text-[0.93rem]">
            <li>
              {site.contactEmail ? (
                <a href={`mailto:${site.contactEmail}`} className="text-ink-3 transition-colors hover:text-ink">
                  {site.contactEmail}
                </a>
              ) : (
                <span className="text-ink-3">{t({ zh: '联系邮箱待补充', en: 'Contact email coming soon' })}</span>
              )}
            </li>
            <li>
              <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="text-ink-3 transition-colors hover:text-ink">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-[0.82rem] text-ink-3 sm:flex-row sm:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <p>
          {t({
            zh: '订单由 Dodo Payments 作为经销商（Merchant of Record）处理。',
            en: 'Orders are processed by Dodo Payments, our Merchant of Record.',
          })}
        </p>
        </div>
      </div>
    </footer>
  )
}
