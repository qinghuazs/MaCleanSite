import { TriangleAlert } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { guide, guideVersion, type GuideBlock } from '../content/guide'
import { useLang } from '../i18n'
import { links } from '../paths'
import { site } from '../site.config'

// 用户手册页：适用版本、标题、导语、目录、分节正文，最后是联系邮箱。
// 宽屏时目录固定在左侧，窄屏时排在导语下面。

const l = links(1)

export function Guide() {
  const { t } = useLang()
  const rich = useRich()

  return (
    <div className="wrap pt-14 pb-24 sm:pt-20 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
      <Toc className="hidden lg:sticky lg:top-24 lg:block lg:self-start" />

      <article className="max-w-[48rem]">
        <p className="text-[0.88rem] text-ink-3">
          {t({
            zh: `适用版本 ${guideVersion} · macOS ${site.minMacOS} 或更新版本`,
            en: `For version ${guideVersion} · macOS ${site.minMacOS} or later`,
          })}
        </p>
        <h1 className="mt-3 text-[2.6rem] leading-[1.1] sm:text-[3.2rem]">{t(guide.title)}</h1>
        <p className="mt-6 text-[1.12rem] leading-[1.75] text-ink-2">{t(guide.intro)}</p>

        <Toc className="mt-10 rounded-xl border border-line p-5 lg:hidden" />

        {guide.sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-14 border-t border-line pt-10">
            <h2 className="text-[1.75rem] leading-snug">{t(s.h)}</h2>
            {s.blocks.map((block, i) => (
              <Block key={i} block={block} rich={rich} />
            ))}
          </section>
        ))}

        {site.contactEmail && (
          <p className="mt-14 border-t border-line pt-6 text-[0.95rem] text-ink-3">
            {t({ zh: '还有问题？写信给 ', en: 'Still stuck? Email ' })}
            <a href={`mailto:${site.contactEmail}`} className="text-clay-ink underline decoration-1 underline-offset-4">
              {site.contactEmail}
            </a>
          </p>
        )}
      </article>
    </div>
  )
}

/** 目录：各节标题，点了跳到对应的节 */
function Toc({ className }: { className: string }) {
  const { t } = useLang()
  return (
    <nav aria-label={t({ zh: '目录', en: 'Contents' })} className={className}>
      <p className="text-sm font-semibold text-ink">{t({ zh: '目录', en: 'Contents' })}</p>
      <ol role="list" className="mt-3 space-y-2 text-[0.93rem] leading-snug">
        {guide.sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="text-ink-3 transition-colors hover:text-ink">
              {t(s.h)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Block({ block, rich }: { block: GuideBlock; rich: (text: string) => ReactNode }) {
  const { t, lang } = useLang()

  switch (block.kind) {
    case 'p':
      return <p className="mt-4 text-[1rem] leading-[1.85] text-ink-2">{rich(t(block.text))}</p>

    case 'h3':
      return (
        <h3 id={block.id} className="mt-10 text-[1.3rem] leading-snug">
          {t(block.text)}
        </h3>
      )

    case 'steps':
      return (
        <ol role="list" className="mt-5 space-y-3.5">
          {block.items.map((step, i) => (
            <li key={i} className="flex gap-3 text-[1rem] leading-[1.8] text-ink-2">
              <span
                aria-hidden="true"
                className="mt-[0.2rem] flex size-6 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[0.8rem] font-medium tabular-nums text-ink-2"
              >
                {i + 1}
              </span>
              <span>
                {step.title && (
                  <strong className="font-semibold text-ink">
                    {t(step.title)}
                    {/* 英文的小标题和正文之间要空一格，中文句号后面不用 */}
                    {lang === 'en' ? ' ' : ''}
                  </strong>
                )}
                {rich(t(step.text))}
              </span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      // 窄屏时每行上下排（左列在上），表头不显示；宽屏是两列的表格
      return (
        <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="hidden bg-paper-2 text-[0.82rem] text-ink-3 sm:table-header-group">
              <tr>
                <th scope="col" className="w-[32%] px-4 py-2.5 font-medium">
                  {t(block.head[0])}
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  {t(block.head[1])}
                </th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([name, detail], i) => (
                <tr key={i} className="block border-t border-line first:border-t-0 sm:table-row sm:first:border-t">
                  <th scope="row" className="block px-4 pt-3.5 align-top font-semibold text-ink sm:table-cell sm:py-3.5">
                    {rich(t(name))}
                  </th>
                  <td className="block px-4 pt-1 pb-3.5 align-top leading-[1.75] text-ink-2 sm:table-cell sm:py-3.5">
                    {rich(t(detail))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'warn':
      return (
        <p className="mt-6 flex gap-3 rounded-xl bg-amber-wash px-4 py-3.5 text-[0.97rem] leading-[1.75] text-amber-ink">
          <TriangleAlert aria-hidden="true" className="mt-[0.3rem] size-4 shrink-0" />
          <span>{rich(t(block.text))}</span>
        </p>
      )
  }
}

/** 把正文里的 **加粗**、`代码`、[文字](目标) 渲染出来 */
function useRich() {
  return (text: string): ReactNode =>
    text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
      if (part.startsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('`')) {
        return (
          <code key={i} className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
            {part.slice(1, -1)}
          </code>
        )
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        const [, label, target] = link
        const external = /^https?:/.test(target)
        const href = target === '{download}' ? l.section('download') : target
        return (
          <a
            key={i}
            href={href}
            className="text-clay-ink underline decoration-1 underline-offset-4"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        )
      }
      return <Fragment key={i}>{part}</Fragment>
    })
}
