import appIcon from '../assets/app-icon.png'
import { useLang } from '../i18n'
import { links, type PageDepth } from '../paths'
import { site } from '../site.config'

// 页脚：产品简介、隐私说明、产品 / 政策 / 联系三栏链接、版权与 Dodo 经销商说明、星云图片署名。
// Dodo 审核会看这里有没有服务条款、隐私政策、退款政策

export function Footer({ depth }: { depth: PageDepth }) {
  const { t } = useLang()
  const l = links(depth)
  const wrap = depth === 0 ? 'wrap' : 'wrap-wide'
  const year = new Date().getFullYear()

  const columns = [
    {
      title: { zh: '产品', en: 'Product' },
      items: [
        { href: l.section('features'), label: { zh: '功能', en: 'Features' } },
        { href: l.section('pricing'), label: { zh: '价格', en: 'Pricing' } },
        { href: l.section('faq'), label: { zh: '常见问题', en: 'FAQ' } },
        { href: l.guide, label: { zh: '用户手册', en: 'User Guide' } },
        { href: l.section('download'), label: { zh: '下载', en: 'Download' } },
      ],
    },
    {
      title: { zh: '政策', en: 'Policies' },
      items: [
        { href: l.privacy, label: { zh: '隐私政策', en: 'Privacy Policy' } },
        { href: l.terms, label: { zh: '服务条款', en: 'Terms of Service' } },
        { href: l.refund, label: { zh: '退款政策', en: 'Refund Policy' } },
      ],
    },
  ]
  const link = 'text-muted transition-colors hover:text-ink'

  return (
    <footer className="border-t border-line">
      <div className={`${wrap} pt-8 pb-6 desk:pt-12 desk:pb-7`}>
        <div className="flex flex-col gap-6 desk:flex-row desk:justify-between desk:gap-10">
          <div className="max-w-[400px]">
            <a href={l.home} className="inline-flex items-center gap-2 rounded-md">
              <img src={appIcon} alt="" width={28} height={28} className="size-7" />
              <span className="text-[21px] leading-none font-bold tracking-[-0.01em]">{site.name}</span>
            </a>
            <p className="mt-3 text-[13px] leading-[21px] text-muted desk:text-[14px] desk:leading-[22px]">
              {t({
                zh: '一个 Mac 磁盘清理工具，动手之前先把每一项讲清楚。',
                en: 'A disk cleaner for Mac that explains each item before it touches anything.',
              })}
            </p>
            <p className="mt-3 text-[13px] leading-[21px] text-subtle">
              {t({
                zh: 'MaClean 在本机完成扫描，不主动上传扫描结果。接入第三方 AI 助手后，助手读取的路径和占用信息可能发送给对应服务。',
                en: 'MaClean scans on your Mac and does not upload scan results. If you connect a third-party AI assistant, it may send the paths and disk usage details it reads to its provider.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-[13px] leading-5 desk:flex desk:gap-[72px]">
            {columns.map((col) => (
              <div key={col.title.en}>
                <h2 className="font-sans font-medium text-ink">{t(col.title)}</h2>
                <ul className="mt-2.5 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={link}>
                        {t(item.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="font-sans font-medium text-ink">{t({ zh: '联系', en: 'Contact' })}</h2>
              <ul className="mt-2.5 space-y-2.5">
                {site.contactEmail && (
                  <li>
                    <a href={`mailto:${site.contactEmail}`} className={link}>
                      {site.contactEmail}
                    </a>
                  </li>
                )}
                <li>
                  <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className={link}>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-6 text-[12px] leading-[18px] text-subtle desk:mt-8">
          <div className="flex flex-col gap-1.5 desk:flex-row desk:justify-between">
            <p>
              © {year} {site.name}
            </p>
            <p>
              {t({
                zh: '订单由 Dodo Payments 处理，它是本产品的经销商（Merchant of Record）。',
                en: 'Orders are handled by Dodo Payments, our Merchant of Record.',
              })}
            </p>
          </div>
          <p className="mt-1.5">
            {t({ zh: '玫瑰星云图片：', en: 'Rosette Nebula image: ' })}
            <a
              href="https://science.nasa.gov/image-article/apod-2025-july-16-the-rosette-nebula-from-decam/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2 hover:text-muted"
            >
              CTIO / NOIRLab / DOE / NSF / AURA
            </a>
            {t({ zh: '，图像处理 T. A. Rector、D. de Martin、M. Zamani', en: '. Image processing: T. A. Rector, D. de Martin, M. Zamani' })}
          </p>
        </div>
      </div>
    </footer>
  )
}
