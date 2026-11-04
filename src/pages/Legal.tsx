import { Fragment, type ReactNode } from 'react'
import type { LegalDoc } from '../content/legal'
import { useLang } from '../i18n'
import { links } from '../paths'
import { macs, site } from '../site.config'

// 政策页：标题、生效日期、导语、分节正文，底部链到另外两份政策

const l = links(1)

export function Legal({ doc, current }: { doc: LegalDoc; current: 'terms' | 'privacy' | 'refund' }) {
  const { t, lang } = useLang()
  const fill = useFill()
  const others = (
    [
      { id: 'terms', href: l.terms, label: { zh: '服务条款', en: 'Terms of Service' } },
      { id: 'privacy', href: l.privacy, label: { zh: '隐私政策', en: 'Privacy Policy' } },
      { id: 'refund', href: l.refund, label: { zh: '退款政策', en: 'Refund Policy' } },
    ] as const
  ).filter((o) => o.id !== current)

  return (
    <article className="wrap max-w-[48rem] pt-14 pb-24 sm:pt-20">
      <p className="text-[0.88rem] text-ink-3">
        {t({ zh: `生效日期：${site.policyDate}`, en: `Effective ${site.policyDate}` })}
      </p>
      <h1 className="mt-3 text-[2.6rem] leading-[1.1] sm:text-[3.2rem]">{t(doc.title)}</h1>
      <p className="mt-6 text-[1.12rem] leading-[1.75] text-ink-2">{fill(t(doc.intro))}</p>

      <div className="mt-12 space-y-10">
        {doc.sections.map((s) => (
          <section key={s.h.en}>
            <h2 className="text-[1.5rem] leading-snug">{fill(t(s.h))}</h2>
            {t(s.p).map((para, i) => (
              <p key={i} className="mt-3 text-[1rem] leading-[1.85] text-ink-2">
                {fill(para)}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[1rem] leading-[1.8] text-ink-2 marker:text-ink-3">
                {t(s.list).map((item, i) => (
                  <li key={i}>{fill(item)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <nav aria-label={t({ zh: '其他政策', en: 'Other policies' })} className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.95rem]">
        {others.map((o) => (
          <a key={o.id} href={o.href} className="text-clay-ink underline decoration-1 underline-offset-4">
            {o.label[lang]}
          </a>
        ))}
      </nav>
    </article>
  )
}

/** 把正文里的占位符换成实际内容；邮箱和政策名渲染成链接 */
function useFill() {
  const { t } = useLang()
  return (text: string): ReactNode => {
    const plain = text
      .replaceAll('{days}', String(site.refundDays))
      .replaceAll('{macs}', t(macs))
    const parts = plain.split(/(\{email\}|\{refund\}|\{privacy\})/)
    return parts.map((part, i) => {
      if (part === '{email}') {
        return site.contactEmail ? (
          <a key={i} href={`mailto:${site.contactEmail}`} className="text-clay-ink underline underline-offset-4">
            {site.contactEmail}
          </a>
        ) : (
          <span key={i} className="rounded bg-amber-wash px-1 text-amber-ink">
            {t({ zh: '（联系邮箱待补充）', en: '(contact email coming soon)' })}
          </span>
        )
      }
      if (part === '{refund}' || part === '{privacy}') {
        const href = part === '{refund}' ? l.refund : l.privacy
        const label = part === '{refund}' ? t({ zh: '退款政策', en: 'Refund Policy' }) : t({ zh: '隐私政策', en: 'Privacy Policy' })
        return (
          <a key={i} href={href} className="text-clay-ink underline underline-offset-4">
            {label}
          </a>
        )
      }
      return <Fragment key={i}>{part}</Fragment>
    })
  }
}
