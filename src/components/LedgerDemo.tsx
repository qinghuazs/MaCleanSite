import { ChevronDown, Lock } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useLang, type L } from '../i18n'
import { Tag } from './ui'

// 首屏示例：模仿应用里的"扫描结果"页。先把灰色的"系统数据"拆成分类，再列出候选项和四维标签；
// 勾选会实时算出合计与"预计释放"（共享空间已扣除）。数据是示例，不读取访客的电脑。

type Policy = 'auto' | 'confirm' | 'forbidden'
type Cost = 'none' | 'time' | 'download' | 'irreversible'

type Item = {
  id: string
  title: L
  path: string
  /** 文件大小（GB） */
  size: number
  /** 与别处共享时，删掉实际能腾出的大小（GB） */
  freed?: number
  policy: Policy
  cost: Cost
  regenerates?: boolean
  /** 需先退出的正在运行的应用 */
  quit?: L
  /** 默认是否勾选（"只选建议项"的结果） */
  recommended: boolean
  detail: { cost: L; back: L; freed?: L; how: L }
}

const policyTag: Record<Policy, { label: L; tone: 'safe' | 'warn' | 'muted' }> = {
  auto: { label: { zh: '可批量清理', en: 'Safe to batch' }, tone: 'safe' },
  confirm: { label: { zh: '需逐项确认', en: 'Confirm each' }, tone: 'warn' },
  forbidden: { label: { zh: '受保护', en: 'Protected' }, tone: 'muted' },
}

const costLabel: Record<Cost, L> = {
  none: { zh: '无代价', en: 'No cost' },
  time: { zh: '需重新生成', en: 'Rebuilds' },
  download: { zh: '需重新下载', en: 'Re-downloads' },
  irreversible: { zh: '不可恢复', en: 'Irreversible' },
}

const items: Item[] = [
  {
    id: 'sim',
    title: { zh: '不可用的模拟器（iOS 17.5、iOS 18.2）', en: 'Unavailable simulators (iOS 17.5, iOS 18.2)' },
    path: '~/Library/Developer/CoreSimulator',
    size: 22.8,
    policy: 'auto',
    cost: 'download',
    recommended: true,
    detail: {
      cost: { zh: '以后要在这些系统版本上调试，Xcode 会重新下载。', en: 'Xcode downloads them again if you ever debug on these iOS versions.' },
      back: { zh: '不会。', en: 'No.' },
      how: { zh: '调用 xcrun simctl 删除。', en: 'Removed with xcrun simctl.' },
    },
  },
  {
    id: 'derived',
    title: { zh: 'Xcode 的编译缓存', en: 'Xcode build cache' },
    path: '~/Library/Developer/Xcode/DerivedData',
    size: 14.6,
    policy: 'auto',
    cost: 'time',
    regenerates: true,
    recommended: false,
    detail: {
      cost: { zh: '下次编译要从头来，会慢一些。', en: 'Your next build starts from scratch and takes longer.' },
      back: { zh: '会。编译一次就长回来，删了也白删，所以默认不勾。', en: 'Yes. One build and it is back, so it stays unticked by default.' },
      how: { zh: '移到废纸篓，清空前可撤回。', en: 'Moved to the Trash. Undo any time before you empty it.' },
    },
  },
  {
    id: 'pnpm',
    title: { zh: 'pnpm 的包存储', en: 'pnpm package store' },
    path: '~/Library/pnpm/store',
    size: 6.2,
    freed: 1.1,
    policy: 'auto',
    cost: 'download',
    recommended: true,
    detail: {
      cost: { zh: '下次安装依赖时重新下载。', en: 'Packages download again on your next install.' },
      back: { zh: '只在安装新依赖时变大。', en: 'Only when you install new packages.' },
      freed: {
        zh: '约 1.1 GB。其余 5.1 GB 和项目里的 node_modules 共用同一份数据，删了也腾不出来。',
        en: 'About 1.1 GB. The other 5.1 GB is shared with node_modules in your projects, so deleting it frees nothing.',
      },
      how: { zh: '移到废纸篓，清空前可撤回。', en: 'Moved to the Trash. Undo any time before you empty it.' },
    },
  },
  {
    id: 'wechat-cache',
    title: { zh: '微信的图片和视频缓存', en: 'WeChat photo and video cache' },
    path: '~/Library/Containers/com.tencent.xinWeChat',
    size: 9.3,
    policy: 'confirm',
    cost: 'download',
    quit: { zh: '微信', en: 'WeChat' },
    recommended: false,
    detail: {
      cost: { zh: '没保存过的旧图片、视频要重新下载，过期的可能打不开。', en: 'Old photos and videos you never saved download again. Expired ones may not open.' },
      back: { zh: '会随着聊天慢慢变大。', en: 'It grows slowly as you chat.' },
      how: { zh: '微信正开着，要先退出才能清。「只选建议项」会先跳过它。', en: 'WeChat is running and has to quit first. “Select suggested” skips it.' },
    },
  },
  {
    id: 'postman',
    title: { zh: 'Postman 自动更新时下载的安装包', en: 'Installer Postman downloaded to update itself' },
    path: '~/Library/Caches/com.postmanlabs.mac.ShipIt',
    size: 0.9,
    policy: 'auto',
    cost: 'none',
    recommended: true,
    detail: {
      cost: { zh: '没有代价，更新已经装好了。', en: 'None. The update is already installed.' },
      back: { zh: '下次自动更新时才会再出现。', en: 'Only during the next update.' },
      how: { zh: '移到废纸篓，清空前可撤回。', en: 'Moved to the Trash. Undo any time before you empty it.' },
    },
  },
  {
    id: 'wechat-db',
    title: { zh: '微信的聊天记录数据库', en: 'WeChat chat history database' },
    path: '~/Library/Containers/com.tencent.xinWeChat',
    size: 11.2,
    policy: 'forbidden',
    cost: 'irreversible',
    recommended: false,
    detail: {
      cost: { zh: '删了就找不回来。', en: 'Gone for good.' },
      back: { zh: '不会。', en: 'No.' },
      how: { zh: '只显示占用，不能勾选。', en: 'Shown for reference. It cannot be selected.' },
    },
  },
]

/** "系统数据"拆开后的分类（GB） */
const segments: { id: string; label: L; size: number; color: string }[] = [
  { id: 'sim', label: { zh: '模拟器', en: 'Simulators' }, size: 38.4, color: 'var(--seg-sim)' },
  { id: 'dev', label: { zh: '开发者文件', en: 'Developer files' }, size: 31.2, color: 'var(--seg-dev)' },
  { id: 'cache', label: { zh: '缓存', en: 'Caches' }, size: 24.7, color: 'var(--seg-cache)' },
  { id: 'appdata', label: { zh: '应用数据', en: 'App data' }, size: 21.5, color: 'var(--seg-appdata)' },
  { id: 'container', label: { zh: '容器', en: 'Containers' }, size: 16.3, color: 'var(--seg-container)' },
  { id: 'trash', label: { zh: '废纸篓', en: 'Trash' }, size: 6.1, color: 'var(--seg-trash)' },
]
const total = segments.reduce((s, x) => s + x.size, 0)

const gb = (n: number) => `${n.toFixed(1)} GB`

export function LedgerDemo() {
  const { t } = useLang()
  const [selected, setSelected] = useState<Set<string>>(() => new Set(items.filter((i) => i.recommended).map((i) => i.id)))
  const [open, setOpen] = useState<string | null>('derived')
  const split = useSplitOnLoad()

  const chosen = items.filter((i) => selected.has(i.id))
  const sum = chosen.reduce((s, i) => s + i.size, 0)
  const freed = chosen.reduce((s, i) => s + (i.freed ?? i.size), 0)
  const mustQuit = chosen.filter((i) => i.quit)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <figure
      aria-label={t({ zh: '扫描结果示例', en: 'Example scan results' })}
      className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_rgba(20,20,19,0.04),0_12px_40px_-12px_rgba(20,20,19,0.14)]"
    >
      {/* 窗口标题栏 */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ec6a5e]" />
          <span className="size-3 rounded-full bg-[#f4be4f]" />
          <span className="size-3 rounded-full bg-[#61c454]" />
        </div>
        <span className="text-sm font-medium text-ink-2">{t({ zh: '扫描结果', en: 'Scan results' })}</span>
        <span className="ml-auto text-[0.75rem] text-ink-3">{t({ zh: '示例数据', en: 'Sample data' })}</span>
      </div>

      {/* 系统数据拆分条 */}
      <div className="border-b border-line px-4 pt-4 pb-3.5 sm:px-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-ink-2">{t({ zh: '系统数据', en: 'System Data' })}</span>
          <span className="font-serif text-xl tabular-nums">{gb(total)}</span>
        </div>
        <div
          className="mt-2.5 flex h-3 gap-[2px] overflow-hidden rounded-full transition-colors duration-700"
          style={{ backgroundColor: split ? 'transparent' : 'var(--seg-gray)' }}
          aria-hidden="true"
        >
          {segments.map((s, i) => (
            <span
              key={s.id}
              className="h-full transition-colors duration-500"
              style={{
                flexGrow: s.size,
                backgroundColor: split ? s.color : 'var(--seg-gray)',
                transitionDelay: `${i * 90}ms`,
              }}
            />
          ))}
          <span className="hatch h-full w-[4%] shrink-0" />
        </div>
        <ul
          className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[0.75rem] text-ink-3 transition-opacity duration-500"
          style={{ opacity: split ? 1 : 0, transitionDelay: split ? '450ms' : '0ms' }}
        >
          {segments.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span className="size-2 rounded-[3px]" style={{ backgroundColor: s.color }} />
              {t(s.label)} <span className="tabular-nums">{s.size}</span>
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="hatch size-2 rounded-[3px] border border-line-2" />
            {t({ zh: '本地快照 大小未知', en: 'Local snapshots, size unknown' })}
          </li>
        </ul>
      </div>

      {/* 候选项 */}
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <Row
            key={item.id}
            item={item}
            checked={selected.has(item.id)}
            expanded={open === item.id}
            onToggle={() => toggle(item.id)}
            onExpand={() => setOpen((cur) => (cur === item.id ? null : item.id))}
          />
        ))}
      </ul>

      {/* 底栏合计 */}
      <div className="border-t border-line bg-paper-2/60 px-4 py-3.5 sm:px-5" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <p className="text-sm text-ink-2">
            {t({ zh: `已选 ${chosen.length} 项，合计 ${gb(sum)}`, en: `${chosen.length} selected, ${gb(sum)} in total` })}
          </p>
          <p className="text-sm text-ink-2">
            {t({ zh: '预计释放', en: 'Est. freed' })}{' '}
            <span className="font-serif text-2xl text-ink tabular-nums">{gb(freed)}</span>
          </p>
        </div>
        {mustQuit.length > 0 && (
          <p className="mt-1.5 text-[0.8rem] text-amber-ink">
            {t({
              zh: `${mustQuit.map((i) => i.quit!.zh).join('、')}正在运行，执行前要先退出。`,
              en: `${mustQuit.map((i) => i.quit!.en).join(', ')} is running and has to quit before cleaning.`,
            })}
          </p>
        )}
      </div>
    </figure>
  )
}

function Row({
  item,
  checked,
  expanded,
  onToggle,
  onExpand,
}: {
  item: Item
  checked: boolean
  expanded: boolean
  onToggle: () => void
  onExpand: () => void
}) {
  const { t } = useLang()
  const detailId = useId()
  const locked = item.policy === 'forbidden'
  const p = policyTag[item.policy]

  return (
    <li className={expanded ? 'bg-paper/60' : undefined}>
      <div className="flex items-start gap-3 px-4 py-3 sm:px-5">
        {/* 勾选框：受保护的项显示锁 */}
        <span className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center">
          {locked ? (
            <Lock className="size-4 text-ink-3" aria-label={t({ zh: '不能勾选', en: 'Cannot be selected' })} />
          ) : (
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggle}
              aria-label={t(item.title)}
              className="size-[18px] cursor-pointer rounded-[5px] accent-[var(--clay)]"
            />
          )}
        </span>

        <button
          type="button"
          onClick={onExpand}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="group flex min-w-0 flex-1 items-start gap-3 rounded-md text-left"
        >
          <span className="min-w-0 flex-1">
            <span className={`block text-[0.93rem] leading-snug font-medium ${locked ? 'text-ink-3' : 'text-ink'}`}>
              {t(item.title)}
            </span>
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              <Tag tone={p.tone} icon={locked ? <Lock className="size-3" aria-hidden="true" /> : undefined}>
                {t(p.label)}
              </Tag>
              <Tag>{t(costLabel[item.cost])}</Tag>
              {item.regenerates && <Tag tone="clay">{t({ zh: '会自动回来', en: 'Comes back' })}</Tag>}
              {item.freed !== undefined && (
                <Tag>{t({ zh: `共享空间，预计释放 ${gb(item.freed)}`, en: `Shared, est. ${gb(item.freed)} freed` })}</Tag>
              )}
              {item.quit && <Tag tone="warn">{t({ zh: `需先退出${item.quit.zh}`, en: `Quit ${item.quit.en} first` })}</Tag>}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 pt-px">
            <span className={`text-[0.9rem] tabular-nums ${locked ? 'text-ink-3' : 'text-ink-2'}`}>{gb(item.size)}</span>
            <ChevronDown
              className={`size-4 text-ink-3 transition-transform duration-200 group-hover:text-ink ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      {/* 展开后的四维说明 */}
      <div id={detailId} hidden={!expanded} className="px-4 pb-4 sm:px-5">
        <p className="mb-2.5 truncate pl-[30px] font-mono text-[0.72rem] text-ink-3">{item.path}</p>
        <dl className="grid gap-x-5 gap-y-2.5 rounded-xl border border-line bg-surface p-3.5 text-[0.82rem] leading-relaxed sm:ml-[30px] sm:grid-cols-2">
          <Detail term={t({ zh: '删了有什么代价', en: 'What deleting costs' })} value={t(item.detail.cost)} />
          <Detail term={t({ zh: '会不会自己长回来', en: 'Does it come back' })} value={t(item.detail.back)} />
          <Detail
            term={t({ zh: '实际能腾出', en: 'Space you get back' })}
            value={item.detail.freed ? t(item.detail.freed) : item.policy === 'forbidden' ? '—' : gb(item.size)}
          />
          <Detail term={t({ zh: '怎么处理', en: 'How it is handled' })} value={t(item.detail.how)} />
        </dl>
      </div>
    </li>
  )
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-3">{term}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}

/** 页面加载后让"系统数据"灰条拆成彩色分类，整页唯一一处自动播放的动效；系统设置了减弱动态效果时直接显示结果 */
function useSplitOnLoad() {
  const [split, setSplit] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (split) return
    const timer = window.setTimeout(() => setSplit(true), 700)
    return () => window.clearTimeout(timer)
  }, [split])
  return split
}
