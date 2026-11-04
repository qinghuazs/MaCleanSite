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
        <h1 className="text-[2.6rem] leading-[1.1] sm:text-[3.4rem] lg:text-[clamp(3rem,5vw,3.6rem)]">
          {t({
            zh: (
              <>
                {/* 第一行整体不换行，避免"把"单独占一行 */}
                <span className="whitespace-nowrap">把「系统数据」</span>
                <br />
                拆开看看
              </>
            ),
            en: <>Take a look inside System Data</>,
          })}
        </h1>
        <p className="mt-6 max-w-[34rem] text-[1.12rem] leading-[1.7] text-ink-2">
          {t({
            zh: '我用过好几个清理软件，每次点「一键清理」心里都发虚：它到底删了什么？过两天会不会又长回来？所以写 MaClean 的时候，我让它先把每一项讲清楚，你点了头才删。',
            en: 'I’ve tried a few Mac cleaners, and hitting “Clean” always made me a little nervous. What did it just delete? Will it all be back next week? So MaClean explains every item first, and deletes nothing until you say so.',
          })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={site.downloadUrl || null} disabledLabel={t({ zh: '即将开放下载', en: 'Download coming soon' })}>
            {t({ zh: '下载 MaClean', en: 'Download MaClean' })}
          </ButtonLink>
          <ButtonLink href={l.section('pricing')} variant="secondary">
            {t({ zh: '查看价格', en: 'See pricing' })}
          </ButtonLink>
        </div>
        <p className="mt-5 text-[0.85rem] text-ink-3">
          {t({
            zh: `下载和扫描都免费。需要 macOS ${site.minMacOS} 或更新的系统，安装包经过 Apple 公证。`,
            en: `Free to download and scan. Requires macOS ${site.minMacOS} or later. Notarized by Apple.`,
          })}
        </p>
      </div>

      <div className="min-w-0">
        <LedgerDemo />
        <p className="mt-3 px-1 text-[0.82rem] text-ink-3">
          {t({
            zh: '上面是示例数据。点一行能看到详细说明，勾选的时候留意底部的数字。',
            en: 'That’s sample data. Click a row for details, and watch the number at the bottom as you tick things.',
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
        zh: '有的删了没任何影响，有的下次打开会慢一点，有的得重新下载，还有少数删了就找不回来。标签上写着是哪种。',
        en: 'Some things cost nothing to delete. Some make the next launch slower, some have to download again, and a few are gone for good. The tag tells you which.',
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
        zh: '比如 Xcode 的编译缓存，删完编译一次就回来了。这种会标上「会自动回来」，默认不勾，省得你白忙。',
        en: 'Xcode’s build cache is back after a single build. Things like that are tagged “Comes back” and left unticked, so you don’t waste the effort.',
      },
      tags: <Tag tone="clay">{t({ zh: '会自动回来', en: 'Comes back' })}</Tag>,
    },
    {
      q: { zh: '实际能腾出多少？', en: 'How much space will you really get?' },
      a: {
        zh: '这一点最容易被忽略。有些文件和别的文件共用磁盘空间（APFS 克隆、硬链接），看着有 6 GB，删掉可能只多出 1 GB。MaClean 显示的是真正能多出来的空间。',
        en: 'This one is easy to miss. Some files share disk space with others through APFS clones or hard links. A folder can say 6 GB and free up 1 GB when you delete it. MaClean shows the number you’d actually get back.',
      },
      tags: <Tag>{t({ zh: '共享空间，实际 1.1 GB', en: 'Shared, frees 1.1 GB' })}</Tag>,
    },
    {
      q: { zh: '要先退出哪个应用？', en: 'Which apps have to quit first?' },
      a: {
        zh: '微信、Chrome 开着的时候，它们的缓存清不了。点「只选建议项」会先跳过这些，并告诉你要退出哪几个。',
        en: 'You can’t clear WeChat’s or Chrome’s cache while they’re open. “Select suggested” skips those and tells you which apps to quit.',
      },
      tags: <Tag tone="warn">{t({ zh: '需先退出微信', en: 'Quit WeChat first' })}</Tag>,
    },
  ]

  return (
    <section id="how" className="border-t border-line">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            title={t({ zh: '扫完之后，你会看到什么', en: 'What you see after a scan' })}
            intro={t({
              zh: '先是「系统数据」拆出来的几大块：模拟器、开发者文件、缓存、应用数据、容器、废纸篓，还有本地快照（它的大小系统不提供，只能标成未知）。点进去，每一项都用大白话写着是什么，比如「腾讯会议的缓存」「Postman 自动更新时下载的安装包」，后面跟着几个标签。',
              en: 'First, System Data broken into chunks: simulators, developer files, caches, app data, containers, the Trash, and local snapshots (macOS won’t say how big those are, so they show as unknown). Open one and every item says what it is in plain words, like “Tencent Meeting’s cache” or “the installer Postman downloaded to update itself”, followed by a few tags.',
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
      title: { zh: '有些东西是锁着的', en: 'Some items are locked' },
      text: {
        zh: '聊天记录数据库、浏览器扩展、最新的那个模拟器系统，会列出来让你知道占了多少，但勾不上。',
        en: 'Chat history databases, browser extensions and your newest simulator runtime are listed so you know how big they are, but you can’t select them.',
      },
    },
    {
      icon: <ListChecks className="size-[18px]" />,
      title: { zh: '你自己的文件要一个个点', en: 'Your own files need a yes each' },
      text: {
        zh: '聊天里存下的图片视频、下载文件夹里的东西，不会被批量勾上，得一项一项确认。',
        en: 'Photos and videos saved from chats, stuff in Downloads: none of it gets ticked in bulk. You confirm each one.',
      },
    },
    {
      icon: <ClipboardCheck className="size-[18px]" />,
      title: { zh: '动手前再核对一遍', en: 'One more check before it runs' },
      text: {
        zh: '真正清理之前会弹出「清理前检查」窗口，写着哪些应用要先退出、还缺什么权限、每一项会怎么处理。',
        en: 'Before anything runs you get a pre-cleanup check: which apps need to quit, which permissions are missing, and what will happen to each item.',
      },
    },
    {
      icon: <Undo2 className="size-[18px]" />,
      title: { zh: '后悔了还能放回去', en: 'Changed your mind? Put it back' },
      text: {
        zh: '默认是移到废纸篓。只要废纸篓还没清空，在历史记录里点一下就都回来了。',
        en: 'Things go to the Trash by default. As long as you haven’t emptied it, one click in History brings everything back.',
      },
    },
  ]

  return (
    <section id="safety" className="wrap pb-20 lg:pb-28">
      <div className="grid gap-12 rounded-[28px] bg-paper-2 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading title={t({ zh: '不该删的，勾都勾不上', en: 'Some things you can’t even tick' })} />
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

/** 清理前检查弹窗示意，数字和首屏示例的默认勾选一致 */
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
      <p className="font-serif text-[1.3rem]">{t({ zh: '清理前检查', en: 'Pre-Cleanup Check' })}</p>
      <p className="mt-1 text-[0.85rem] text-ink-3">
        {t({ zh: '确认一下这些项和处理方式，没问题就执行。', en: 'Check these items and how each will be handled, then run.' })}
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
          <dt className="text-ink-3">{t({ zh: '预计释放', en: 'Est. freed' })}</dt>
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
          title={t({ zh: '如果你写代码', en: 'If you write code' })}
          intro={t({
            zh: '开发机的空间多半是被这些吃掉的：Xcode 缓存、早就不用的旧模拟器、各个项目的编译产物、Homebrew 的缓存和日志。下面这些 MaClean 都会扫：',
            en: 'On a dev machine the space usually goes to Xcode caches, simulators you stopped using ages ago, build output from old projects, and Homebrew’s caches and logs. MaClean checks all of these:',
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
              <h3 className="text-[1.5rem]">{t({ zh: '系统拦着的，用终端处理', en: 'When macOS says no, use Terminal' })}</h3>
            </div>
            <p className="mt-3 text-[0.98rem] leading-[1.75] text-night-ink-3">
              {t({
                zh: '有些目录受系统完整性保护，或者要完全磁盘访问权限，应用本身删不了。碰到这种，MaClean 会写好一份终端脚本给你。',
                en: 'Some folders are protected by System Integrity Protection or need Full Disk Access, and the app can’t touch them. For those, MaClean writes a Terminal script for you.',
              })}
            </p>
            <ol className="mt-5 space-y-2 text-[0.95rem]">
              {[
                { zh: '复制命令', en: 'Copy the command' },
                { zh: '粘到终端里执行', en: 'Paste it into Terminal and run it' },
                { zh: '回到 MaClean 点「复查」，看看是不是都删掉了', en: 'Back in MaClean, click Verify to check it all went' },
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
                  {t({ zh: '# MaClean 生成于 2026-11-03 10:12', en: '# Generated by MaClean, 2026-11-03 10:12' })}
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
              <h3 className="text-[1.5rem]">{t({ zh: '也可以让 AI 来查', en: 'Or let an AI assistant look' })}</h3>
            </div>
            <p className="mt-3 text-[0.98rem] leading-[1.75] text-night-ink-3">
              {t({
                zh: 'MaClean 带了一个 MCP 服务。接到 Claude Code 或 Codex 上，就能直接问它「我的空间都去哪了」，让它帮你列个清理计划。',
                en: 'MaClean comes with an MCP server. Hook it up to Claude Code or Codex and you can just ask “where did my disk space go?” and have it draft a cleanup plan.',
              })}
            </p>
            <pre className="mt-6 overflow-x-auto rounded-xl bg-night p-4 font-mono text-[0.75rem] leading-[1.8] text-night-ink">
              <code>
                claude mcp add --scope user maclean -- \{'\n'}
                {'  '}/Applications/MaClean.app/Contents/MacOS/MaClean \{'\n'}
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
              {t({ zh: '只读模式不用许可证，安全和完全模式要先激活。只是试试的话，只读就够了。', en: 'Read-only works without a license. Safe and full need one. If you’re just trying it out, read-only is enough.' })}
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
      title: { zh: '卸载得干净点', en: 'Cleaner uninstalls' },
      text: {
        zh: '卸载应用时，顺带把它在 ~/Library 里留下的数据一起清掉。同样是进废纸篓，能撤回。',
        en: 'Uninstalling an app also takes the data it left behind in ~/Library. It all goes to the Trash, so you can undo it.',
      },
    },
    {
      icon: <PanelTop className="size-5" />,
      title: { zh: '菜单栏显示剩余空间', en: 'Free space in the menu bar' },
      text: { zh: '不用打开应用，看一眼菜单栏就知道还剩多少，快满了会提醒你。', en: 'Glance at the menu bar to see how much space is left. It warns you when the disk is getting full.' },
    },
    {
      icon: <TrendingUp className="size-5" />,
      title: { zh: '每周记一次', en: 'A weekly snapshot' },
      text: {
        zh: '打开之后每周自动记录一次空间占用，过一阵子就能看出是谁在悄悄变大。',
        en: 'Once a week it records your disk usage, so after a while you can see what’s been quietly growing.',
      },
    },
  ]
  return (
    <section id="more" className="wrap py-20 lg:py-28">
      <SectionHeading title={t({ zh: '顺手做的几个小功能', en: 'A few smaller things' })} />
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
    { zh: '解锁执行清理、终端脚本和卸载应用', en: 'Unlocks cleaning, Terminal scripts and uninstalling apps' },
    { zh: 'AI 助手可以用安全模式和完全模式', en: 'AI assistants can use safe and full modes' },
    {
      zh: `一个许可证可以激活 ${macs.zh} Mac。换电脑的话，先在旧电脑上停用`,
      en: `One license works on ${macs.en}. Switching computers? Deactivate it on the old one first.`,
    },
    { zh: '付完款马上就能收到密钥', en: 'Your key arrives by email right after you pay' },
    { zh: `${site.refundDays} 天内不想要了，可以全额退款`, en: `Full refund within ${site.refundDays} days if it’s not for you` },
  ]
  const steps: L[] = [
    { zh: '在结账页付款', en: 'Pay on the checkout page' },
    { zh: '去邮箱找到许可证密钥', en: 'Find the license key in your inbox' },
    { zh: '打开 MaClean，在「设置 → 许可证」里粘贴进去', en: 'Open MaClean and paste it into Settings → License' },
  ]

  return (
    <section id="pricing" className="border-t border-line">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <SectionHeading
            title={t({ zh: '买一次，一直用', en: 'Pay once, keep using it' })}
            intro={t({
              zh: '下载和扫描不收费：看「系统数据」里有什么、清理前检查、预览清理结果都能直接用。真正执行清理、生成终端脚本、卸载应用的时候，才需要许可证。付款走 Dodo Payments，不是订阅，不会自动续费。',
              en: 'Downloading and scanning are free: see what’s in System Data, run the pre-cleanup check, preview the cleanup. You need a license when you actually clean, generate Terminal scripts or uninstall apps. Payment goes through Dodo Payments. It’s not a subscription and it never renews.',
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
            <span className="text-ink-3">{t({ zh: '买断', en: 'one-time' })}</span>
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
              zh: '收据由 Dodo Payments 开具，它是这笔订单的经销商（Merchant of Record）。',
              en: 'Dodo Payments is the Merchant of Record for your order and sends the receipt.',
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
        zh: 'macOS 存储设置里，凡是它归不了类的东西都算进「系统数据」，比如模拟器、开发工具、各种应用的缓存和数据、本地快照。所以它经常大得离谱，又看不出里面是什么。',
        en: 'It’s where macOS puts everything it can’t categorize: simulators, developer tools, app caches and data, local snapshots. That’s why it gets so big and tells you nothing.',
      },
    },
    {
      q: { zh: '会不会误删我的东西？', en: 'Could it delete something I need?' },
      a: {
        zh: '默认只是移到废纸篓，清空之前随时能放回去。聊天记录这类东西压根勾不上，你自己的文件得一个个确认，清理前还会再检查一遍。',
        en: 'By default everything goes to the Trash, and you can put it back any time before you empty it. Things like chat history can’t be selected at all, your own files need a yes each, and there’s one more check before anything runs.',
      },
    },
    {
      q: { zh: '为什么要给「完全磁盘访问权限」？', en: 'Why does it ask for Full Disk Access?' },
      a: {
        zh: '很多应用的缓存和容器被 macOS 保护着，不给这个权限只能扫到一部分。不给也能用，只是扫出来的东西少一些。',
        en: 'macOS protects a lot of app caches and containers, so without it MaClean only sees part of them. It still works, it just finds less.',
      },
    },
    {
      q: { zh: '扫描结果会上传吗？', en: 'Do my scan results leave my Mac?' },
      a: {
        zh: (
          <>
            不会。扫描结果和清理记录都只存在你自己的 Mac 上。应用只在激活和定期校验许可证时联网，发出去的只有许可证密钥和这台 Mac 的名字。详细的写在
            <a href={l.privacy} className="text-clay-ink underline underline-offset-4">隐私政策</a>。
          </>
        ),
        en: (
          <>
            No. Scan results and cleanup history stay on your Mac. The app only goes online to activate and now and then check your license, and all it
            sends is the license key and your Mac’s name. Details are in the{' '}
            <a href={l.privacy} className="text-clay-ink underline underline-offset-4">Privacy Policy</a>.
          </>
        ),
      },
    },
    {
      q: { zh: '支持哪些 macOS 版本？', en: 'Which macOS versions are supported?' },
      a: { zh: `macOS ${site.minMacOS} 或更新的版本。`, en: `macOS ${site.minMacOS} or later.` },
    },
    {
      q: { zh: '换了新 Mac，许可证怎么办？', en: 'I got a new Mac. What about my license?' },
      a: {
        zh: '先在旧 Mac 上打开「设置 → 许可证」，点「在这台 Mac 上停用」，然后在新 Mac 上输入同一个密钥。',
        en: 'On the old Mac, go to Settings → License and click “Deactivate on this Mac”. Then enter the same key on the new one.',
      },
    },
    {
      q: { zh: '不买能用吗？', en: 'Can I use it without paying?' },
      a: {
        zh: '能。扫描、看系统数据、检查和预览都免费，想知道空间去哪了不用花钱。真正执行清理、生成终端脚本、卸载应用时才需要许可证。',
        en: 'Yes. Scanning, the System Data breakdown, checking and previewing are all free, so finding out where your space went costs nothing. You only need a license to actually clean, generate Terminal scripts or uninstall apps.',
      },
    },
    {
      q: { zh: '可以退款吗？', en: 'Can I get a refund?' },
      a: {
        zh: (
          <>
            可以。买了 {site.refundDays} 天之内，不用说理由，发封邮件就行。具体见
            <a href={l.refund} className="text-clay-ink underline underline-offset-4">退款政策</a>。
          </>
        ),
        en: (
          <>
            Yes. Within {site.refundDays} days of buying, no reason needed, just send an email. See the{' '}
            <a href={l.refund} className="text-clay-ink underline underline-offset-4">Refund Policy</a>.
          </>
        ),
      },
    },
    {
      q: { zh: '怎么接入 Claude Code、Codex？', en: 'How do I connect Claude Code or Codex?' },
      a: {
        zh: '在 MaClean 的「设置 → AI 助手接入」里选个模式，把对应客户端的配置复制过去就行。刚开始建议用只读，AI 只能看不能删。',
        en: 'In MaClean, open Settings → AI assistants, pick a mode and copy the config for your client. Read-only is a good place to start, since the assistant can look but not delete.',
      },
    },
  ]

  return (
    <section id="faq" className="border-t border-line">
      <div className="wrap grid gap-10 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-28">
        <SectionHeading title={t({ zh: '常见问题', en: 'Common questions' })} />
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
            {t({ zh: '你的「系统数据」现在多大？', en: 'How big is your System Data right now?' })}
          </h2>
          <p className="mt-3 text-[0.98rem] text-ink-2">
            {t({
              zh: `下载 MaClean 扫一下就知道了，扫描不收费。当前版本 ${site.version}，需要 macOS ${site.minMacOS} 或更新的系统。`,
              en: `Download MaClean and find out. Scanning is free. Version ${site.version}, requires macOS ${site.minMacOS} or later.`,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.downloadUrl || null} disabledLabel={t({ zh: '即将开放下载', en: 'Download coming soon' })}>
            {t({ zh: '下载 MaClean', en: 'Download MaClean' })}
          </ButtonLink>
          <ButtonLink href={l.section('pricing')} variant="secondary">
            {t({ zh: '购买许可证', en: 'Buy a license' })}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
