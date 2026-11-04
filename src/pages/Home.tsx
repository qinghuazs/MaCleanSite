import { Bot, Check, ClipboardCheck, ListChecks, Lock, PanelTop, Terminal, Trash2, TrendingUp, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { LedgerDemo } from '../components/LedgerDemo'
import { ButtonLink, Tag } from '../components/ui'
import { useLang, type L } from '../i18n'
import { links } from '../paths'
import { macs, purchaseUrl, site } from '../site.config'

// 首页：首屏示例 → 四个问题 → 安全 → 开发者 → 清理之外 → 价格 → 常见问题 → 下载

const l = links(0)

export function Home() {
  return (
    <>
      <Hero />
      <FourQuestions />
      <Safety />
      <Developers />
      <Beyond />
      <Pricing />
      <Faq />
      <Download />
    </>
  )
}

function Hero() {
  const { t } = useLang()
  return (
    <section className="wrap grid items-start gap-12 pt-14 pb-20 sm:pt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pt-24 lg:pb-28">
      <div className="min-w-0 lg:sticky lg:top-28">
        <h1 className="text-[2.6rem] leading-[1.1] sm:text-[3.4rem] lg:text-[3.9rem]">
          {t({
            zh: (
              <>
                说不清楚的，
                <br />
                就不让你删。
              </>
            ),
            en: <>If it can’t be explained, it doesn’t get deleted.</>,
          })}
        </h1>
        <p className="mt-6 max-w-[34rem] text-[1.12rem] leading-[1.7] text-ink-2">
          {t({
            zh: 'Mac 存储里那条灰色的「系统数据」，Maclean 帮你拆开：每一项是什么、删了有什么代价、会不会自己长回来、实际能腾出多少。',
            en: 'Maclean opens up the grey “System Data” in your Mac’s storage and tells you what each item is, what deleting it costs, whether it comes back, and how much space you’ll really get.',
          })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={site.downloadUrl || null} disabledLabel={t({ zh: '即将开放下载', en: 'Download coming soon' })}>
            {t({ zh: '下载 Maclean', en: 'Download Maclean' })}
          </ButtonLink>
          <ButtonLink href={l.section('pricing')} variant="secondary">
            {t({ zh: '查看价格', en: 'See pricing' })}
          </ButtonLink>
        </div>
        <p className="mt-5 text-[0.85rem] text-ink-3">
          {t({
            zh: `适用于 macOS ${site.minMacOS} 及以上，安装包经 Apple 公证。`,
            en: `For macOS ${site.minMacOS} or later. Notarized by Apple.`,
          })}
        </p>
      </div>

      <div className="min-w-0">
        <LedgerDemo />
        <p className="mt-3 px-1 text-[0.82rem] text-ink-3">
          {t({
            zh: '点开任意一项看说明，勾选看实际能腾出多少。',
            en: 'Open any item to read why. Tick items to see what you’d actually get back.',
          })}
        </p>
      </div>
    </section>
  )
}

function SectionHeading({ title, intro, tone = 'paper' }: { title: ReactNode; intro?: ReactNode; tone?: 'paper' | 'night' }) {
  return (
    <div className="max-w-[40rem]">
      <h2 className="text-[2rem] leading-[1.15] sm:text-[2.6rem]">{title}</h2>
      {intro && (
        <p className={`mt-4 text-[1.05rem] leading-[1.75] ${tone === 'night' ? 'text-night-ink-3' : 'text-ink-2'}`}>{intro}</p>
      )}
    </div>
  )
}

function FourQuestions() {
  const { t } = useLang()
  const questions: { q: L; a: L; tags: ReactNode }[] = [
    {
      q: { zh: '删了有什么代价？', en: 'What does deleting it cost?' },
      a: {
        zh: '分四档：无代价、需重新生成、需重新下载、不可恢复。是下次打开慢一点，还是要重新下一遍，删之前就知道。',
        en: 'Four levels: no cost, rebuilds, re-downloads, irreversible. You know beforehand whether it means a slower next launch or another download.',
      },
      tags: (
        <>
          <Tag>{t({ zh: '无代价', en: 'No cost' })}</Tag>
          <Tag>{t({ zh: '需重新生成', en: 'Rebuilds' })}</Tag>
          <Tag>{t({ zh: '需重新下载', en: 'Re-downloads' })}</Tag>
          <Tag>{t({ zh: '不可恢复', en: 'Irreversible' })}</Tag>
        </>
      ),
    },
    {
      q: { zh: '会不会自己长回来？', en: 'Will it come back?' },
      a: {
        zh: '会长回来的标成「会自动回来」，默认不勾。删了也白删，过几天又是这么大。',
        en: 'Anything that regenerates is marked “Comes back” and left unticked. Deleting it buys you a few days at best.',
      },
      tags: <Tag tone="clay">{t({ zh: '会自动回来', en: 'Comes back' })}</Tag>,
    },
    {
      q: { zh: '实际能腾出多少？', en: 'How much space will you really get?' },
      a: {
        zh: '有些文件和别处共用同一份空间，比如 APFS 克隆和硬链接，删了不一定真释放。Maclean 按扣掉共享之后的大小算。',
        en: 'Some files share storage with others through APFS clones or hard links, so deleting them frees little. Maclean counts only what you’ll actually get back.',
      },
      tags: <Tag>{t({ zh: '共享空间，实际 1.1 GB', en: 'Shared, frees 1.1 GB' })}</Tag>,
    },
    {
      q: { zh: '要先退出哪个应用？', en: 'Which apps have to quit first?' },
      a: {
        zh: '微信、Chrome 这类正开着的应用，要先退出才能清它的缓存。「只选推荐项」会先跳过它们，并告诉你是哪几个。',
        en: 'Caches of running apps like WeChat or Chrome can only be cleaned once the app quits. “Select recommended” skips them and tells you which ones.',
      },
      tags: <Tag tone="warn">{t({ zh: '需先退出微信', en: 'Quit WeChat first' })}</Tag>,
    },
  ]

  return (
    <section id="how" className="border-t border-line">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            title={t({ zh: '每一项，都回答四个问题', en: 'Every item answers four questions' })}
            intro={t({
              zh: '「系统数据」先拆成模拟器、开发者文件、缓存、应用数据、容器、废纸篓、本地快照七类，哪块最大一眼就能看到。再往下，每一项不是一串看不懂的路径，而是「腾讯会议的缓存」「Postman 自动更新时下载的安装包」这样的说明。',
              en: 'System Data is first split into seven groups: simulators, developer files, caches, app data, containers, Trash and local snapshots, so the biggest one is obvious. Below that, every item is described in plain words, like “Tencent Meeting’s cache” or “the installer Postman downloaded to update itself”, not a cryptic path.',
            })}
          />
        </div>
        <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {questions.map((item) => (
            <div key={item.q.en}>
              <dt className="font-serif text-[1.45rem] leading-snug">{t(item.q)}</dt>
              <dd className="mt-3 text-[0.98rem] leading-[1.75] text-ink-2">{t(item.a)}</dd>
              <dd className="mt-4 flex flex-wrap gap-1.5">{item.tags}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Safety() {
  const { t } = useLang()
  const points: { icon: ReactNode; title: L; text: L }[] = [
    {
      icon: <Lock className="size-[18px]" />,
      title: { zh: '锁住不该删的', en: 'Locked items stay locked' },
      text: {
        zh: '聊天记录数据库、浏览器扩展、最新的模拟器运行时，会显示占用，但不能勾选。',
        en: 'Chat history databases, browser extensions and your newest simulator runtime are shown, but can’t be selected.',
      },
    },
    {
      icon: <ListChecks className="size-[18px]" />,
      title: { zh: '你的数据逐项确认', en: 'Your own files, one at a time' },
      text: {
        zh: '聊天里的图片视频、下载文件夹这类你自己的数据，要一项一项点头才会进清单。',
        en: 'Things like chat media or your Downloads folder only make the list after you approve each one.',
      },
    },
    {
      icon: <ClipboardCheck className="size-[18px]" />,
      title: { zh: '执行前先预检', en: 'A preflight check first' },
      text: {
        zh: '要退出哪些应用、缺什么权限、每一项怎么处理，执行前全部列出来。',
        en: 'Before anything runs, you see which apps must quit, which permissions are missing and how each item will be handled.',
      },
    },
    {
      icon: <Undo2 className="size-[18px]" />,
      title: { zh: '清空废纸篓前都能撤回', en: 'Undo until you empty the Trash' },
      text: {
        zh: '默认移到废纸篓。清空废纸篓之前，在历史页一键放回原处。',
        en: 'Items go to the Trash by default. Until you empty it, one click in History puts everything back.',
      },
    },
  ]

  return (
    <section id="safety" className="wrap pb-20 lg:pb-28">
      <div className="grid gap-12 rounded-[28px] bg-paper-2 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading title={t({ zh: '不该删的，勾都勾不上', en: 'What shouldn’t go can’t even be ticked' })} />
          <ul className="mt-10 space-y-7">
            {points.map((p) => (
              <li key={p.title.en} className="flex gap-4">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-clay-ink" aria-hidden="true">
                  {p.icon}
                </span>
                <div>
                  <h3 className="font-sans text-[1.02rem] font-semibold">{t(p.title)}</h3>
                  <p className="mt-1 text-[0.96rem] leading-[1.7] text-ink-2">{t(p.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <PreflightMock />
      </div>
    </section>
  )
}

/** 预检弹窗示意，数字和首屏示例的默认勾选一致 */
function PreflightMock() {
  const { t } = useLang()
  const groups = [
    {
      channel: { zh: '移到废纸篓', en: 'Move to Trash' },
      note: { zh: '可撤回', en: 'undoable' },
      rows: [
        { name: { zh: 'pnpm 的包存储', en: 'pnpm package store' }, size: '6.2 GB' },
        { name: { zh: 'Postman 自动更新时下载的安装包', en: 'Postman update installer' }, size: '0.9 GB' },
      ],
    },
    {
      channel: { zh: '调用工具命令', en: 'Tool command' },
      note: { zh: 'xcrun simctl，不可撤回', en: 'xcrun simctl, not undoable' },
      rows: [{ name: { zh: '不可用的模拟器', en: 'Unavailable simulators' }, size: '22.8 GB' }],
    },
  ]
  return (
    <div className="self-center rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(20,20,19,0.04),0_12px_40px_-14px_rgba(20,20,19,0.16)] sm:p-6">
      <p className="font-serif text-[1.3rem]">{t({ zh: '预检', en: 'Preflight' })}</p>
      <p className="mt-1 text-[0.85rem] text-ink-3">
        {t({ zh: '执行前确认下面这些项和处理方式。', en: 'Review these items and how each will be handled.' })}
      </p>
      <p className="mt-4 rounded-[10px] bg-olive-wash px-3 py-2 text-[0.85rem] text-olive-ink">
        {t({ zh: '策略：移到废纸篓。清空废纸篓之前可以回滚。', en: 'Strategy: move to Trash. You can roll back until the Trash is emptied.' })}
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-line py-3 text-[0.8rem]">
        <div>
          <dt className="text-ink-3">{t({ zh: '将处理', en: 'Items' })}</dt>
          <dd className="font-serif text-lg">{t({ zh: '3 项', en: '3' })}</dd>
        </div>
        <div>
          <dt className="text-ink-3">{t({ zh: '合计', en: 'Total' })}</dt>
          <dd className="font-serif text-lg tabular-nums">29.9 GB</dd>
        </div>
        <div>
          <dt className="text-ink-3">{t({ zh: '预计实际释放', en: 'You get back' })}</dt>
          <dd className="font-serif text-lg tabular-nums">24.8 GB</dd>
        </div>
      </dl>
      <div className="mt-3 space-y-3">
        {groups.map((g) => (
          <div key={g.channel.en}>
            <p className="text-[0.78rem] text-ink-3">
              <span className="font-medium text-ink-2">{t(g.channel)}</span>
              {t({ zh: '，', en: ', ' })}
              {t(g.note)}
            </p>
            <ul className="mt-1.5 space-y-1">
              {g.rows.map((r) => (
                <li key={r.name.en} className="flex justify-between gap-3 rounded-lg bg-paper px-3 py-2 text-[0.85rem]">
                  <span className="truncate">{t(r.name)}</span>
                  <span className="shrink-0 text-ink-2 tabular-nums">{r.size}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2" aria-hidden="true">
        <span className="inline-flex h-9 items-center rounded-[9px] border border-line-2 px-3.5 text-sm">{t({ zh: '取消', en: 'Cancel' })}</span>
        <span className="inline-flex h-9 items-center rounded-[9px] bg-ink px-3.5 text-sm text-paper">
          {t({ zh: '执行（3 项）', en: 'Run 3 items' })}
        </span>
      </div>
    </div>
  )
}

function Developers() {
  const { t } = useLang()
  const found = [
    'Xcode DerivedData',
    t({ zh: '不可用的模拟器', en: 'Unavailable simulators' }),
    'Next.js .next',
    'Gradle',
    'Maven',
    'SwiftPM .build',
    'Homebrew',
    'Docker',
    'npm / pnpm',
    t({ zh: 'Electron 自动更新包', en: 'Electron updater caches' }),
  ]
  const modes = [
    { mode: 'read-only', label: { zh: '只读', en: 'Read-only' }, text: { zh: '只能查看，不能删除', en: 'Look, never delete' } },
    { mode: 'safe', label: { zh: '安全', en: 'Safe' }, text: { zh: '只能移到废纸篓，可撤回', en: 'Trash only, undoable' } },
    { mode: 'full', label: { zh: '完全', en: 'Full' }, text: { zh: '可以永久删除、清空废纸篓', en: 'Can delete for good and empty the Trash' } },
  ]

  return (
    <section id="developers" className="bg-night text-night-ink">
      <div className="wrap py-20 lg:py-28">
        <SectionHeading
          tone="night"
          title={t({ zh: '写代码的 Mac，空间都去哪了', en: 'Where a developer’s disk space goes' })}
          intro={t({
            zh: 'Xcode 缓存、不再用的旧模拟器、项目的编译产物、Homebrew 的缓存和日志，Maclean 都能扫出来。',
            en: 'Xcode caches, old simulators you no longer use, build output from your projects, Homebrew caches and logs. Maclean finds all of it.',
          })}
        />
        <ul className="mt-8 flex max-w-3xl flex-wrap gap-2">
          {found.map((f) => (
            <li key={f} className="rounded-lg border border-night-line px-2.5 py-1 text-[0.85rem] text-night-ink">
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* 终端脚本 */}
          <div className="min-w-0 rounded-[20px] border border-night-line bg-night-2 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Terminal className="size-5 text-clay" aria-hidden="true" />
              <h3 className="text-[1.5rem]">{t({ zh: '系统不让动的，交给终端', en: 'What macOS protects goes to Terminal' })}</h3>
            </div>
            <p className="mt-3 text-[0.98rem] leading-[1.75] text-night-ink-3">
              {t({
                zh: '遇到系统完整性保护、完全磁盘访问权限拦着的项，Maclean 不硬删，而是生成一份终端脚本。',
                en: 'When System Integrity Protection or Full Disk Access gets in the way, Maclean doesn’t force it. It writes a Terminal script for you instead.',
              })}
            </p>
            <ol className="mt-5 space-y-2 text-[0.95rem]">
              {[
                { zh: '复制命令', en: 'Copy the command' },
                { zh: '在终端里执行', en: 'Run it in Terminal' },
                { zh: '回到 Maclean 点「复查」，确认每一项都处理了', en: 'Back in Maclean, click Verify to confirm every item was handled' },
              ].map((s, i) => (
                <li key={s.en} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-night-line text-[0.75rem] tabular-nums text-night-ink-3">
                    {i + 1}
                  </span>
                  <span>{t(s)}</span>
                </li>
              ))}
            </ol>
            <pre className="mt-6 overflow-x-auto rounded-xl bg-night p-4 font-mono text-[0.75rem] leading-[1.8] text-night-ink-3">
              <code>
                <span className="text-night-ink-3/70">
                  {t({ zh: '# Maclean 生成于 2026-11-03 10:12', en: '# Generated by Maclean, 2026-11-03 10:12' })}
                  {'\n'}
                  {t({ zh: '# 3 项，预计释放 6.8 GB，含 sudo', en: '# 3 items, about 6.8 GB, uses sudo' })}
                </span>
                {'\n'}
                <span className="text-night-ink">sudo rm -rf "/Library/Developer/CoreSimulator/Caches"</span>
                {'\n'}
                <span className="text-night-ink">sudo rm -rf "/Library/Logs/DiagnosticReports"</span>
                {'\n'}
                <span className="text-night-ink">rm -rf "$HOME/Library/Containers/com.docker.docker/Data/log"</span>
              </code>
            </pre>
          </div>

          {/* MCP */}
          <div className="min-w-0 rounded-[20px] border border-night-line bg-night-2 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Bot className="size-5 text-clay" aria-hidden="true" />
              <h3 className="text-[1.5rem]">{t({ zh: '让 AI 助手帮你查', en: 'Ask your AI assistant' })}</h3>
            </div>
            <p className="mt-3 text-[0.98rem] leading-[1.75] text-night-ink-3">
              {t({
                zh: 'Maclean 内置 MCP 服务，可以接入 Claude Code、Codex 等 AI 助手，让 AI 帮你查空间去哪了、出一份清理计划。用的是和应用同一套引擎、同一份账本。',
                en: 'Maclean includes an MCP server, so assistants like Claude Code and Codex can find where your space went and draft a cleanup plan, using the same engine and ledger as the app.',
              })}
            </p>
            <pre className="mt-6 overflow-x-auto rounded-xl bg-night p-4 font-mono text-[0.75rem] leading-[1.8] text-night-ink">
              <code>
                claude mcp add --scope user maclean -- \{'\n'}
                {'  '}/Applications/MacleanAPP.app/Contents/MacOS/MacleanAPP \{'\n'}
                {'  '}--mcp --mode read-only
              </code>
            </pre>
            <dl className="mt-6 divide-y divide-night-line border-y border-night-line text-[0.92rem]">
              {modes.map((m) => (
                <div key={m.mode} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt>
                    {t(m.label)} <span className="font-mono text-[0.75rem] text-night-ink-3">{m.mode}</span>
                  </dt>
                  <dd className="text-right text-night-ink-3">{t(m.text)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.82rem] text-night-ink-3">
              {t({ zh: '建议先用只读模式。', en: 'We suggest starting with read-only.' })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Beyond() {
  const { t } = useLang()
  const items: { icon: ReactNode; title: L; text: L }[] = [
    {
      icon: <Trash2 className="size-5" />,
      title: { zh: '卸载应用不留残留', en: 'Uninstall without leftovers' },
      text: {
        zh: '应用本体和它在 ~/Library 里的数据一起移到废纸篓，记进历史，可以撤回。',
        en: 'The app and its data in ~/Library go to the Trash together, recorded in History so you can undo.',
      },
    },
    {
      icon: <PanelTop className="size-5" />,
      title: { zh: '菜单栏看剩余空间', en: 'Free space in the menu bar' },
      text: { zh: '常驻显示剩余空间，快满了会提醒你。', en: 'Always shows free space, and warns you when it runs low.' },
    },
    {
      icon: <TrendingUp className="size-5" />,
      title: { zh: '每周看看谁在变大', en: 'See what grows each week' },
      text: {
        zh: '打开每周监控，自动记录一次空间变化，找出悄悄变大的那个。',
        en: 'Turn on the weekly check to record your disk automatically and catch whatever is quietly growing.',
      },
    },
  ]
  return (
    <section id="more" className="wrap py-20 lg:py-28">
      <SectionHeading title={t({ zh: '清理之外', en: 'Beyond cleanup' })} />
      <ul className="mt-10 grid gap-10 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.title.en}>
            <span className="text-clay-ink" aria-hidden="true">
              {item.icon}
            </span>
            <h3 className="mt-3 font-sans text-[1.05rem] font-semibold">{t(item.title)}</h3>
            <p className="mt-1.5 text-[0.96rem] leading-[1.7] text-ink-2">{t(item.text)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Pricing() {
  const { t } = useLang()
  const buy = purchaseUrl()
  const includes: L[] = [
    { zh: '全部功能', en: 'Every feature' },
    {
      zh: `可在 ${macs.zh} Mac 上激活，换电脑时先在旧 Mac 上停用`,
      en: `Activate on ${macs.en}. Deactivate on the old Mac to move it.`,
    },
    { zh: '付款后许可证密钥立刻发到你的邮箱', en: 'License key emailed right after payment' },
    { zh: `${site.refundDays} 天内不满意，全额退款`, en: `Full refund within ${site.refundDays} days` },
  ]
  const steps: L[] = [
    { zh: '在结账页付款', en: 'Pay on the checkout page' },
    { zh: '在邮件里找到许可证密钥', en: 'Find your license key in the email' },
    { zh: '打开 Maclean，在「设置 → 许可证」里输入密钥', en: 'Open Maclean and enter it in Settings → License' },
  ]

  return (
    <section id="pricing" className="border-t border-line">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <SectionHeading
            title={t({ zh: '一次购买，不用订阅', en: 'Buy once. No subscription.' })}
            intro={t({
              zh: '付款通过 Dodo Payments 完成，许可证密钥会立刻发到你的邮箱。',
              en: 'You pay through Dodo Payments, and your license key arrives by email right away.',
            })}
          />
          <ol className="mt-8 space-y-3">
            {steps.map((s, i) => (
              <li key={s.en} className="flex gap-3 text-[0.98rem]">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-paper-2 font-serif text-[0.95rem] tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-0.5">{t(s)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-7 sm:p-9">
          <p className="font-sans text-[0.95rem] font-semibold">{site.productName}</p>
          <p className="mt-3 flex items-baseline gap-2.5">
            <span className="font-serif text-[3.2rem] leading-none tabular-nums">{t(site.price)}</span>
            <span className="text-ink-3">{t({ zh: '一次性付款', en: 'one-time' })}</span>
          </p>
          <ul className="mt-7 space-y-3">
            {includes.map((item) => (
              <li key={item.en} className="flex gap-3 text-[0.96rem] leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-olive" aria-hidden="true" />
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={buy} external disabledLabel={t({ zh: '即将开放购买', en: 'Purchasing opens soon' })}>
              {t({ zh: '购买许可证', en: 'Buy a license' })}
            </ButtonLink>
          </div>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-3">
            {t({
              zh: '订单由 Dodo Payments 作为经销商处理并开具收据。',
              en: 'Dodo Payments handles the order and receipt as our Merchant of Record.',
            })}{' '}
            <a href={l.refund} className="underline decoration-line-2 underline-offset-4 hover:text-ink">
              {t({ zh: '退款政策', en: 'Refund Policy' })}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { t } = useLang()
  const faqs: { q: L; a: L<ReactNode> }[] = [
    {
      q: { zh: '「系统数据」到底是什么？', en: 'What is “System Data”, exactly?' },
      a: {
        zh: 'macOS 的存储设置把归不了类的文件都算作「系统数据」：模拟器、开发工具、各个应用的缓存和数据、本地快照等。Maclean 把它拆成七类，分别算出大小。',
        en: 'macOS storage settings put everything it can’t categorize into “System Data”: simulators, developer tools, app caches and data, local snapshots and more. Maclean splits it into seven groups and measures each one.',
      },
    },
    {
      q: { zh: '会不会误删我的东西？', en: 'Could it delete something I need?' },
      a: {
        zh: '默认只移到废纸篓，清空之前可以在历史页撤回。聊天记录数据库这类东西不能勾选，你自己的文件要逐项确认，执行前还会预检一遍。',
        en: 'By default items go to the Trash, and you can undo from History until you empty it. Chat databases and the like can’t be selected, your own files need approval one by one, and a preflight check runs before anything happens.',
      },
    },
    {
      q: { zh: '为什么要打开「完全磁盘访问权限」？', en: 'Why does it ask for Full Disk Access?' },
      a: {
        zh: '不少应用的缓存和容器受 macOS 保护，没有这个权限只能扫到一部分。不开也能用，只是扫出来的会少一些。',
        en: 'Many app caches and containers are protected by macOS, so without it Maclean can only scan part of them. It still works without the permission, with fewer results.',
      },
    },
    {
      q: { zh: '扫描结果会上传吗？', en: 'Do my scan results leave my Mac?' },
      a: {
        zh: (
          <>
            不会。扫描、账本、历史都只存在你的 Mac 上。只有激活和定期校验许可证时会联网，发送的是许可证密钥和这台 Mac 的名称。详见
            <a href={l.privacy} className="text-clay-ink underline underline-offset-4">隐私政策</a>。
          </>
        ),
        en: (
          <>
            No. Scans, the ledger and history stay on your Mac. Maclean only goes online to activate and periodically check your license, sending
            the license key and your Mac’s name. See the{' '}
            <a href={l.privacy} className="text-clay-ink underline underline-offset-4">Privacy Policy</a>.
          </>
        ),
      },
    },
    {
      q: { zh: '支持哪些 macOS 版本？', en: 'Which macOS versions are supported?' },
      a: { zh: `macOS ${site.minMacOS} 及以上。`, en: `macOS ${site.minMacOS} or later.` },
    },
    {
      q: { zh: '换了新 Mac，许可证怎么办？', en: 'I got a new Mac. What about my license?' },
      a: {
        zh: '在旧 Mac 的「设置 → 许可证」里点「在这台 Mac 上停用」，再到新 Mac 上输入同一个密钥激活。',
        en: 'On the old Mac, open Settings → License and choose “Deactivate on this Mac”, then enter the same key on the new one.',
      },
    },
    {
      q: { zh: '可以退款吗？', en: 'Can I get a refund?' },
      a: {
        zh: (
          <>
            可以。购买 {site.refundDays} 天内，不需要理由，全额退款。详见
            <a href={l.refund} className="text-clay-ink underline underline-offset-4">退款政策</a>。
          </>
        ),
        en: (
          <>
            Yes. Within {site.refundDays} days of purchase, for any reason. See the{' '}
            <a href={l.refund} className="text-clay-ink underline underline-offset-4">Refund Policy</a>.
          </>
        ),
      },
    },
    {
      q: { zh: '怎么接入 Claude Code、Codex？', en: 'How do I connect Claude Code or Codex?' },
      a: {
        zh: '在 Maclean 的「设置 → AI 助手接入」里选好模式，拷贝对应客户端的配置。建议先用只读模式，AI 只能查看，不能删除。',
        en: 'In Maclean, open Settings → AI assistants, pick a mode and copy the config for your client. Start with read-only: the assistant can look but can’t delete.',
      },
    },
  ]

  return (
    <section id="faq" className="border-t border-line">
      <div className="wrap grid gap-10 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28">
        <SectionHeading title={t({ zh: '常见问题', en: 'Questions' })} />
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q.en} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
                {t(f.q)}
                <span
                  className="relative size-4 shrink-0 text-ink-3 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[40rem] pb-5 text-[0.98rem] leading-[1.75] text-ink-2">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Download() {
  const { t } = useLang()
  return (
    <section id="download" className="wrap pb-24">
      <div className="flex flex-col gap-8 rounded-[28px] bg-clay-wash px-6 py-12 sm:px-12 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[40rem]">
          <h2 className="text-[2rem] leading-[1.15] sm:text-[2.5rem]">
            {t({ zh: '看看你的「系统数据」里都是什么', en: 'See what’s inside your System Data' })}
          </h2>
          <p className="mt-3 text-[0.98rem] text-ink-2">
            {t({
              zh: `Maclean ${site.version}，适用于 macOS ${site.minMacOS} 及以上，经 Apple 公证。`,
              en: `Maclean ${site.version} for macOS ${site.minMacOS} or later, notarized by Apple.`,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.downloadUrl || null} disabledLabel={t({ zh: '即将开放下载', en: 'Download coming soon' })}>
            {t({ zh: '下载 Maclean', en: 'Download Maclean' })}
          </ButtonLink>
          <ButtonLink href={l.section('pricing')} variant="secondary">
            {t({ zh: '购买许可证', en: 'Buy a license' })}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
