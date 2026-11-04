import appIcon from '../assets/app-icon.png'
import { useLang, type Lang } from '../i18n'
import { links, type PageDepth } from '../paths'
import { site } from '../site.config'

// 页头：应用图标 + 名称、首页各区块导航、中英切换、下载按钮
export function Header({ depth }: { depth: PageDepth }) {
  const { t, lang, setLang } = useLang()
  const l = links(depth)
  const nav = [
    { id: 'how', label: { zh: '怎么看清', en: 'How it works' } },
    { id: 'safety', label: { zh: '安全', en: 'Safety' } },
    { id: 'developers', label: { zh: '开发者', en: 'Developers' } },
    { id: 'pricing', label: { zh: '价格', en: 'Pricing' } },
    { id: 'faq', label: { zh: '常见问题', en: 'FAQ' } },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-6">
        <a href={l.home} className="flex items-center gap-2.5 rounded-md">
          <img src={appIcon} alt="" width={30} height={30} className="size-[30px]" />
          <span className="font-serif text-[1.35rem] leading-none font-medium tracking-[-0.01em]">{site.name}</span>
        </a>

        <nav aria-label={t({ zh: '页面导航', en: 'Page sections' })} className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={l.section(item.id)}
                  className="rounded-md px-3 py-1.5 text-[0.93rem] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <LangSwitch lang={lang} onChange={setLang} />
          <a
            href={l.section('download')}
            className="inline-flex h-9 items-center rounded-[10px] bg-ink px-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink-2"
          >
            {t({ zh: '下载', en: 'Download' })}
          </a>
        </div>
      </div>
    </header>
  )
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const options: { value: Lang; label: string }[] = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'EN' },
  ]
  return (
    <div role="group" aria-label="Language / 语言" className="flex rounded-[9px] border border-line p-0.5 text-[0.8rem]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={lang === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-[7px] px-2 py-1 leading-none transition-colors ${
            lang === o.value ? 'bg-paper-2 font-medium text-ink' : 'text-ink-3 hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
