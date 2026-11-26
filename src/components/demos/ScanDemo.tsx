import { ArrowDown, Ban, ChevronDown, ChevronRight, RotateCw, Search, SquareTerminal } from 'lucide-react'
import { useState } from 'react'
import { formatSize, scanApps, type ScanApp, type ScanItem } from '../../content/demo'
import { useLang, type L } from '../../i18n'
import { site } from '../../site.config'
import { ButtonLink } from '../ui'
import { AppTabs, Checkbox, DemoDialog, TrafficLights, WindowFrame } from './chrome'

// 扫描结果演示：一个应用一行，点开看每一项是什么、删了会怎样；可以勾选，
// 点「清理」只弹出「这是演示」的提示，不执行任何操作

const key = (app: ScanApp, i: number) => `${app.id}:${i}`
const statusLabel: Record<ScanItem['kind'], L> = {
  suggested: { zh: '建议清理', en: 'Suggested' },
  review: { zh: '待确认', en: 'To review' },
  view: { zh: '仅查看', en: 'View only' },
}
const statusColor: Record<ScanItem['kind'], string> = { suggested: 'text-good', review: 'text-warn', view: 'text-win-subtle' }
const totalSize = (items: ScanItem[]) => items.reduce((total, item) => total + item.gb, 0)

export function ScanDemo() {
  const { t } = useLang()
  const [expanded, setExpanded] = useState<Map<string, boolean>>(new Map())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [onlySuggested, setOnlySuggested] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState(false)
  // 点「全选建议项」时因应用正在运行而跳过的项；和应用一样，点过才提示，「全不选」后不再提示
  const [held, setHeld] = useState<Set<string>>(new Set())

  // 先筛每一项，再按应用分组。列表、汇总和批量勾选共用同一筛选结果。
  const q = query.trim().toLowerCase()
  const visible = scanApps
    .map((app) => {
      const appMatches = t(app.name).toLowerCase().includes(q)
      const items = app.items.map((item, i) => ({ item, id: key(app, i) })).filter(({ item }) =>
        (!onlySuggested || item.kind === 'suggested') &&
        (appMatches || t(item.name).toLowerCase().includes(q) || item.path.toLowerCase().includes(q)),
      )
      const suggested = items.filter(({ item }) => item.kind === 'suggested')
      return {
        app, items, suggested,
        occupied: totalSize(items.map(({ item }) => item)),
        estimated: totalSize(suggested.map(({ item }) => item)),
      }
    })
    .filter(({ items }) => items.length > 0)
    .sort((a, b) => b.estimated - a.estimated || b.occupied - a.occupied)

  const visibleCount = visible.reduce((count, group) => count + group.items.length, 0)
  const visibleSize = formatSize(visible.reduce((size, group) => size + group.occupied, 0))
  const selectedItems = scanApps.flatMap((app) => app.items.filter((_, i) => selected.has(key(app, i))))
  // 「全选建议项」只勾不用先退出应用的；要先退出的留给用户自己勾（应用行前面的勾选框照常能用）
  const eligible = visible.flatMap(({ app, suggested }) => app.needsQuit ? [] : suggested)
  const skipped = visible.flatMap(({ app, suggested }) => app.needsQuit ? suggested : [])
  const heldItems = scanApps.flatMap((app) => app.items.filter((_, i) => held.has(key(app, i)) && !selected.has(key(app, i))))

  const quitFirst = t({ zh: '需先退出', en: 'Quit first' })
  const setSelection = (ids: string[], pick: boolean) => {
    setSelected((current) => {
      const next = new Set(current)
      for (const id of ids) pick ? next.add(id) : next.delete(id)
      return next
    })
  }

  return (
    <WindowFrame className="rounded-[10px] p-2.5 desk:rounded-[14px] desk:px-[22px] desk:py-[18px]">
      <div className="hidden items-center justify-between desk:flex">
        <TrafficLights className="w-10" />
        <AppTabs active="scan" />
        <span className="w-10" />
      </div>

      <div className="flex items-center justify-between gap-3 px-0.5 desk:mt-4 desk:px-0">
        <p className="text-[13px] font-medium text-win-muted desk:text-[16px]">
          {onlySuggested
            ? t({ zh: `找到 ${visibleCount} 项建议清理\u2002·\u2002${visibleSize}`, en: `${visibleCount} suggested\u2002·\u2002${visibleSize}` })
            : t({
                zh: `找到 ${visibleCount} 项\u2002·\u2002共占用 ${visibleSize}`,
                en: `${visibleCount} found\u2002·\u2002${visibleSize} total`,
              })}
        </p>
        <div className="hidden items-center gap-3 desk:flex">
          <span className="text-[13px] text-win-subtle">{t({ zh: '演示数据', en: 'Demo data' })}</span>
          <span aria-hidden="true" className="inline-flex h-9 items-center gap-2 rounded-lg border border-win-line bg-win-panel px-3 text-[14px] font-medium">
            <RotateCw className="size-3.5" />
            {t({ zh: '重新扫描', en: 'Rescan' })}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-4 desk:mt-3">
        <label className="hidden h-[46px] flex-1 items-center gap-2.5 rounded-lg border border-[#38455d] bg-[#141b2b] px-3 desk:flex">
          <Search aria-hidden="true" className="size-4 text-win-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              if (Boolean(q) !== Boolean(e.target.value.trim())) setExpanded(new Map())
              setQuery(e.target.value)
            }}
            placeholder={t({ zh: '搜索文件、软件或路径', en: 'Search files, apps, or paths' })}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-win-subtle"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[13px] font-medium desk:px-0 desk:text-[15px]">
          <Checkbox
            state={onlySuggested ? 'on' : 'off'}
            onChange={() => setOnlySuggested(!onlySuggested)}
            label={t({ zh: '只看建议项', en: 'Suggested only' })}
            size={14}
          />
          {/* 点文字时浏览器会替我们点一下前面的勾选框 */}
          <span>{t({ zh: '只看建议项', en: 'Suggested only' })}</span>
        </label>
      </div>

      <div className="mt-1 rounded-lg border border-[#2b3244] bg-[#0c1019]/60 px-2 py-2 desk:mt-3 desk:rounded-xl desk:px-4 desk:py-3">
        <div className="flex items-center justify-between px-0.5 text-[10px] text-win-muted desk:text-[13px]">
          <p className="font-medium desk:text-[15px]">{t({ zh: '应用与工具', en: 'Apps & Tools' })}</p>
          <p>{t({ zh: '按预计释放排序', en: 'Sorted by Est. Freed' })}</p>
        </div>

        <ul className="mt-1 desk:mt-2">
          {visible.map(({ app, items, suggested, occupied, estimated }) => {
            const open = expanded.get(app.id) ?? Boolean(q)
            const picked = suggested.filter(({ id }) => selected.has(id)).length
            const count = (kind: ScanItem['kind']) => items.filter(({ item }) => item.kind === kind).length
            const parts = (short: boolean) =>
              [
                count('suggested') && t({ zh: short ? `${count('suggested')} 建议` : `${count('suggested')} 项建议清理`, en: short ? `${count('suggested')} suggested` : `${count('suggested')} suggested items` }),
                count('review') && t({ zh: short ? `${count('review')} 待确认` : `${count('review')} 项待确认`, en: short ? `${count('review')} to review` : `${count('review')} item to review` }),
                count('view') && t({ zh: short ? `${count('view')} 仅查看` : `${count('view')} 项仅查看`, en: short ? `${count('view')} view-only` : `${count('view')} view-only item` }),
              ]
                .filter(Boolean)
                .join(short ? ' · ' : '\u2002·\u2002')
            return (
              <li key={app.id} className="border-b border-[#2b3244] last:border-b-0">
                <div className="flex cursor-pointer items-center gap-2.5 py-2 desk:gap-4 desk:py-2.5" onClick={() => setExpanded((current) => new Map(current).set(app.id, !open))}>
                  <span className="hidden w-4 shrink-0 desk:block">
                    {suggested.length > 0 && (
                      <Checkbox
                        state={picked === 0 ? 'off' : picked === suggested.length ? 'on' : 'some'}
                        label={t({ zh: `勾选 ${t(app.name)} 的建议项`, en: `Select ${t(app.name)}’s suggested items` })}
                        onChange={() => setSelection(suggested.map(({ id }) => id), picked !== suggested.length)}
                      />
                    )}
                  </span>
                  {app.icon ? (
                    <img src={app.icon} alt="" className="size-[27px] desk:size-[33px]" />
                  ) : (
                    <span className="flex size-[27px] items-center justify-center rounded-md bg-win-row text-win-muted desk:size-[33px]">
                      <SquareTerminal aria-hidden="true" className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] leading-[22px] font-semibold desk:text-[17px] desk:leading-6">
                      {t(app.name)}
                      {app.needsQuit && <span className="ml-2 text-[10px] font-medium text-warn desk:hidden">{quitFirst}</span>}
                    </p>
                    <p className="flex flex-wrap gap-x-2 text-[10px] leading-4 text-win-muted desk:text-[13px] desk:leading-[19px]">
                      <span className="desk:hidden">{parts(true)}</span>
                      <span className="hidden desk:inline">{parts(false)}</span>
                      {app.needsQuit && <span className="hidden font-medium text-warn desk:inline">{quitFirst}</span>}
                    </p>
                  </div>
                  <p className="hidden w-[84px] text-right font-mono text-[15px] desk:block">{formatSize(occupied)}</p>
                  <p className="text-right font-mono text-[13px] leading-[19px] text-good desk:w-[150px] desk:text-[15px]">
                    <span className="block font-sans text-[10px] leading-[14px] text-win-subtle desk:hidden">{t({ zh: '可释放', en: 'Est. Freed' })}</span>
                    <span className="hidden desk:inline">{t({ zh: '可释放 ', en: 'Can free ' })}</span>
                    {formatSize(estimated)}
                  </p>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-label={t({ zh: open ? `收起 ${t(app.name)}` : `展开 ${t(app.name)}`, en: open ? `Collapse ${t(app.name)}` : `Expand ${t(app.name)}` })}
                    className="text-win-muted"
                  >
                    {open ? <ChevronDown aria-hidden="true" className="size-4" /> : <ChevronRight aria-hidden="true" className="size-4" />}
                  </button>
                </div>

                {open && (
                  <ul className="mb-2 rounded-md bg-win-row px-2.5 py-1 desk:ml-[30px] desk:rounded-lg desk:px-3">
                    {items.map(({ item, id }) => (
                      <li key={id} title={item.path} className="flex items-center gap-2.5 py-1.5 desk:gap-3">
                        {item.kind === 'view' ? (
                          <Ban aria-hidden="true" className="mx-px size-3.5 shrink-0 text-win-subtle" />
                        ) : (
                          <Checkbox state={selected.has(id) ? 'on' : 'off'} label={t(item.name)} onChange={() => setSelection([id], !selected.has(id))} />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-[12px] leading-[18px] font-medium desk:text-[14px] desk:leading-[21px] ${item.kind === 'view' ? 'text-win-muted' : ''}`}>{t(item.name)}</p>
                          <p className="text-[11px] leading-4 text-win-muted desk:text-[12.5px] desk:leading-[18px]">{t(item.note)}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end desk:flex-row-reverse desk:items-center desk:gap-5">
                          <p className="font-mono text-[12px] leading-[18px] desk:w-[76px] desk:text-right desk:text-[13.5px]">{formatSize(item.gb)}</p>
                          <p className={`text-[10px] leading-[14px] desk:text-[12px] ${statusColor[item.kind]}`}>{t(statusLabel[item.kind])}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
          {visible.length === 0 && <li className="py-6 text-center text-[13px] text-win-muted">{t({ zh: '没有匹配的项', en: 'No matching items' })}</li>}
        </ul>
      </div>

      {/* 底栏：批量勾选、已选统计、清理 */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 desk:mt-3 desk:flex-nowrap desk:gap-2.5">
        <button
          type="button"
          onClick={() => {
            setSelection(eligible.map(({ id }) => id), true)
            if (skipped.length > 0) setHeld(new Set(skipped.map(({ id }) => id)))
          }}
          disabled={!eligible.some(({ id }) => !selected.has(id))}
          className="rounded-md border border-good-line bg-good-wash px-2 py-1.5 text-[11px] leading-4 font-medium text-good disabled:cursor-default disabled:opacity-60 desk:px-3 desk:text-[14px] desk:leading-5"
        >
          {t({ zh: '全选建议项', en: 'Select All Suggested' })}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelected(new Set())
            setHeld(new Set())
          }}
          className="rounded-md border border-[#2a3040] bg-[#151822] px-2 py-1.5 text-[11px] leading-4 font-medium text-win-muted desk:px-3 desk:text-[14px] desk:leading-5"
        >
          {t({ zh: '全不选', en: 'Deselect All' })}
        </button>
        <p className="order-last basis-full px-0.5 text-[12px] font-medium desk:order-none desk:min-w-0 desk:flex-1 desk:basis-0 desk:truncate desk:px-1 desk:text-[15px]">
          {selectedItems.length > 0
            ? t({ zh: `已选 ${selectedItems.length} 项\u2002·\u2002预计释放 ${formatSize(totalSize(selectedItems))}`, en: `${selectedItems.length} selected\u2002·\u2002Est. freed ${formatSize(totalSize(selectedItems))}` })
            : t({ zh: '已选 0 项', en: '0 selected' })}
        </p>
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={() => setNotice(true)}
          className="ml-auto rounded-full bg-ink px-3 py-1.5 text-[12px] leading-4 font-medium text-on-accent disabled:cursor-default disabled:bg-[#828996] disabled:text-[#4f5d75] desk:px-4 desk:text-[14px] desk:leading-5"
        >
          {t({ zh: '清理', en: 'Clean' })}
        </button>
      </div>
      {/* 这句是应用底栏里的原话（应用里后面还有「查看」，演示里不做） */}
      {heldItems.length > 0 && (
        <p role="status" className="mt-1 px-0.5 text-[11px] leading-4 text-warn desk:px-0 desk:text-[13px] desk:leading-5">
          {t({
            zh: `另有 ${heldItems.length} 个建议项（${formatSize(totalSize(heldItems))}）因应用正在运行没勾选`,
            en:
              heldItems.length === 1
                ? `1 more suggested item (${formatSize(totalSize(heldItems))}) not selected because its app is running`
                : `${heldItems.length} more suggested items (${formatSize(totalSize(heldItems))}) not selected because their apps are running`,
          })}
        </p>
      )}

      {notice && (
        <DemoDialog label={t({ zh: '这是演示', en: 'This is a demo' })} onClose={() => setNotice(false)}>
          <p className="text-[17px] leading-[26px] font-bold">{t({ zh: '这是演示', en: 'This is a demo' })}</p>
          <p className="mt-3 text-[14px] leading-[22px] text-muted">
            {t({
              zh: '这里不会删除任何文件。下载 MaClean 后，在你的 Mac 上扫描和清理。',
              en: 'Nothing is deleted here. Download MaClean to scan and clean on your own Mac.',
            })}
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2.5 desk:flex-row desk:justify-end">
            <button
              type="button"
              onClick={() => setNotice(false)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-line bg-surface px-[19px] text-[14px] font-medium hover:bg-raised"
            >
              {t({ zh: '继续看演示', en: 'Keep exploring' })}
            </button>
            <ButtonLink href={site.downloadUrl || null} size="sm" download disabledLabel={t({ zh: '即将开放下载', en: 'Download coming soon' })} className="px-[19px]">
              {t({ zh: '下载 MaClean', en: 'Download MaClean' })}
              <ArrowDown aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </ButtonLink>
          </div>
        </DemoDialog>
      )}
    </WindowFrame>
  )
}
