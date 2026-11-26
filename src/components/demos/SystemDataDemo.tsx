import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { categories, disk, formatSize, mapSize, mobileMapSize, mobileTiles, tiles, type Category, type CategoryId } from '../../content/demo'
import { useLang } from '../../i18n'
import { TrafficLights, WindowFrame } from './chrome'

// 系统数据演示：点地图上的色块或图例切换分类，右边的明细跟着变。
// 桌面照应用窗口画（容量条、图例、两层地图、明细）；手机上简化成五个色块加明细

const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function SystemDataDemo() {
  const [selected, setSelected] = useState<CategoryId>('support')
  const current = categories.find((c) => c.id === selected)!
  return (
    <>
      <Desktop current={current} onSelect={setSelected} />
      <Mobile current={current} onSelect={setSelected} />
    </>
  )
}

type Props = { current: Category; onSelect: (id: CategoryId) => void }

function Desktop({ current, onSelect }: Props) {
  const { t, lang } = useLang()
  // 中文图例一行放得下，按内容宽度排开；英文名字长，七等分后允许折成两行
  const legend = lang === 'zh' ? 'flex justify-between gap-1' : 'grid grid-cols-7 gap-1.5'
  const legendLabel = `block text-[13px] leading-[18px] text-win-muted ${lang === 'zh' ? 'whitespace-nowrap' : ''}`
  const demoData = t({ zh: '演示数据', en: 'Demo data' })
  const panel = 'rounded-xl border border-win-line bg-win-panel'

  return (
    <WindowFrame className="hidden px-[22px] py-[18px] desk:block">
      {/* 窗口顶上只留红黄绿三个点和「演示数据」；应用的页签栏和窗口里的「系统数据」标题用户让去掉了（2026-11-26），
          上面的区块标题已经说明这是哪一页 */}
      <div className="flex items-center justify-between">
        <TrafficLights className="w-10" />
        <p className="text-[13px] text-win-subtle">{demoData}</p>
      </div>

      {/* 启动磁盘：容量条 + 图例（图例也是切换分类的按钮） */}
      <div className={`${panel} mt-4 p-3.5`}>
        <div className="flex items-baseline justify-between">
          <p className="text-[18px] leading-7 font-bold">{t({ zh: '启动磁盘', en: 'Startup Disk' })}</p>
          <p className="text-[14px] text-win-muted">
            {t({ zh: `已用 ${disk.used} GB / 总容量 ${disk.total} GB`, en: `Used ${disk.used} GB / Total ${disk.total} GB` })}
          </p>
        </div>
        <div aria-hidden="true" className="mt-3 flex h-2.5 gap-px overflow-hidden rounded-full">
          {categories.map((c) => (
            <span key={c.id} style={{ width: pct(c.gb, disk.total), background: c.color }} />
          ))}
          <span style={{ width: pct(disk.otherUsed, disk.total), background: 'var(--cat-other)' }} />
          <span style={{ width: pct(disk.free, disk.total), background: 'var(--cat-free)' }} />
        </div>
        <div className={`mt-3 ${legend}`}>
          {categories.map((c) => {
            const on = c.id === current.id
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(c.id)}
                style={on ? { borderColor: `color-mix(in srgb, ${c.color} 75%, transparent)`, background: `color-mix(in srgb, ${c.color} 16%, transparent)` } : undefined}
                className={`flex gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors ${on ? '' : 'border-transparent hover:bg-white/5'}`}
              >
                <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="min-w-0">
                  <span className={legendLabel}>{t(c.name)}</span>
                  <span className="block font-mono text-[16px] leading-6">{formatSize(c.gb)}</span>
                </span>
              </button>
            )
          })}
          {[
            { label: t({ zh: '其余已用', en: 'Other used space' }), gb: disk.otherUsed, color: 'var(--cat-other)' },
            { label: t({ zh: '可用', en: 'Available' }), gb: disk.free, color: 'var(--cat-free)' },
          ].map((x) => (
            <div key={x.label} className="flex gap-2 px-2 py-1.5">
              <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: x.color }} />
              <span className="min-w-0">
                <span className={legendLabel}>{x.label}</span>
                <span className="block font-mono text-[16px] leading-6">{formatSize(x.gb)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1.53fr)_minmax(0,1fr)] gap-3">
        {/* 占用空间地图 */}
        <div className={`${panel} p-3`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[17px] leading-7 font-bold">{t({ zh: '占用空间地图', en: 'Storage Map' })}</p>
            <p className="font-mono text-[12px] text-win-muted">
              {t({ zh: `合计 ${disk.mapped} GB\u2002·\u2002占已用 ${disk.mappedShare}%`, en: `Total ${disk.mapped} GB\u2002·\u2002${disk.mappedShare}% of used` })}
            </p>
          </div>
          <div className="relative mt-2" style={{ aspectRatio: `${mapSize.w} / ${mapSize.h}` }}>
            {tiles.map((tile, i) => {
              const cat = categories.find((c) => c.id === tile.cat)!
              const on = tile.cat === current.id
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(tile.cat)}
                  aria-label={`${t(cat.name)}：${t(tile.name)}`}
                  style={{
                    left: pct(tile.x, mapSize.w),
                    top: pct(tile.y, mapSize.h),
                    width: pct(tile.w, mapSize.w),
                    height: pct(tile.h, mapSize.h),
                    background: cat.tile,
                    opacity: (on ? 1 : 0.76) * (tile.dim ? 0.7 : 1),
                  }}
                  className={`absolute overflow-hidden rounded-[4px] px-1.5 py-1 text-left transition-opacity ${on ? 'text-win-ink' : 'text-[#c3ccdd]'}`}
                >
                  <span className="block truncate text-[12.5px] leading-[18px]">{t(tile.name)}</span>
                  {tile.size && <span className="block truncate font-mono text-[13px] leading-[18px] opacity-85">{tile.size}</span>}
                </button>
              )
            })}
          </div>
          <p className="mt-2.5 text-[12.5px] text-win-muted">
            {t({ zh: '废纸篓\u2002·\u2002630 KB', en: 'Trash\u2002·\u2002630 KB' })}
            <span className="mx-3" />
            {t({ zh: '本地快照\u2002·\u2002无本地快照', en: 'Local snapshots\u2002·\u2002No local snapshots' })}
          </p>
        </div>

        {/* 所选分类的明细 */}
        <div className={`${panel} flex flex-col p-3.5`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="flex min-w-0 items-baseline gap-2 text-[17px] leading-7 font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 -translate-y-0.5 rounded-full" style={{ background: current.color }} />
              <span className="truncate">{t(current.name)}</span>
            </p>
            <p className="shrink-0 font-mono text-[19px]">{formatSize(current.gb)}</p>
          </div>
          <p className="mt-1 text-[14px] leading-[21px] text-win-muted">{t(current.desc)}</p>
          {current.path && <p className="mt-1 font-mono text-[12.5px] text-win-subtle">{current.path}</p>}

          <p className="mt-3 border-t border-win-line pt-3 text-[13.5px] text-win-muted">{t({ zh: '占用最大的目录', en: 'Largest folders' })}</p>
          <ul className="mt-1.5 space-y-1.5 text-[13.5px]">
            {[...current.dirs.map((d) => ({ name: t(d.name), gb: d.gb, rest: false })), ...(current.rest ? [{ name: t({ zh: '其余', en: 'Other' }), gb: current.rest, rest: true }] : [])].map(
              (d) => (
                <li key={d.name} className="grid grid-cols-[minmax(0,1fr)_96px_64px] items-center gap-2">
                  <span className="truncate">{d.name}</span>
                  <span aria-hidden="true" className="h-[3px]">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: pct(d.gb, current.dirs[0].gb), background: d.rest ? '#788297' : current.color }}
                    />
                  </span>
                  <span className="text-right font-mono text-[12.5px]">{formatSize(d.gb)}</span>
                </li>
              ),
            )}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-win-line pt-3">
            <p className={`text-[13px] ${current.suggested ? 'text-good' : 'text-win-subtle'}`}>
              {current.suggested
                ? t({ zh: `${current.suggested} 建议清理`, en: `${current.suggested} suggested` })
                : t({ zh: '扫描结果里没有这一类的建议项', en: 'No suggested items in this category' })}
            </p>
            <a
              href="#scan"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line-2 bg-raised px-2.5 text-[14px] font-medium text-accent hover:bg-win-row"
            >
              {t({ zh: '查看扫描结果', en: 'View Scan Results' })}
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

function Mobile({ current, onSelect }: Props) {
  const { t, lang } = useLang()
  return (
    <div className="rounded-[14px] border border-line bg-canvas p-3 desk:hidden">
      <div className="flex items-baseline justify-between gap-3 px-0.5">
        <p className="text-[18px] leading-[27px] font-bold">{t({ zh: '系统数据', en: 'System Data' })}</p>
        <p className="text-[12px] text-muted">{t({ zh: '启动磁盘\u2002·\u2002演示数据', en: 'Startup Disk\u2002·\u2002Demo data' })}</p>
      </div>
      <p className="px-0.5 text-[13px] text-muted">
        {t({ zh: `已用 ${disk.used} GB / 总容量 ${disk.total} GB`, en: `Used ${disk.used} GB / Total ${disk.total} GB` })}
      </p>

      <div className="relative mt-1.5" style={{ aspectRatio: `${mobileMapSize.w} / ${mobileMapSize.h}` }}>
        {categories.map((c) => {
          const box = mobileTiles[c.id]
          const on = c.id === current.id
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(c.id)}
              style={{
                left: pct(box.x, mobileMapSize.w),
                top: pct(box.y, mobileMapSize.h),
                width: pct(box.w, mobileMapSize.w),
                height: pct(box.h, mobileMapSize.h),
                background: c.tile,
                opacity: on ? 1 : 0.76,
              }}
              className={`absolute flex flex-col overflow-hidden rounded-md border px-[7px] text-left ${box.big ? 'justify-center' : 'justify-center py-0.5'} ${
                on ? 'border-accent' : 'border-transparent'
              }`}
            >
              <span className={`font-bold ${box.big ? (lang === 'zh' ? 'text-[16px] leading-6' : 'text-[14px] leading-5') : lang === 'zh' ? 'truncate text-[12px] leading-[18px]' : 'truncate text-[11px] leading-[17px]'}`}>
                {t(c.name)}
              </span>
              <span className={box.big ? 'text-[16px] leading-6' : 'text-[12px] leading-[17px]'}>{formatSize(c.gb)}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3 px-0.5">
        <p className="text-[15px] leading-[23px] font-bold">{t(current.name)}</p>
        <p className="shrink-0 text-[15px] font-bold text-accent">{formatSize(current.gb)}</p>
      </div>
      <p className="px-0.5 text-[12px] leading-[18px] text-muted">{current.path ?? t(current.desc)}</p>
      <ul className="mt-3 space-y-2 border-t border-line px-0.5 pt-3">
        {current.dirs.slice(0, 3).map((d) => (
          <li key={d.name.en} className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[14px]">{t(d.name)}</span>
            <span className="shrink-0 text-[13px] text-muted">{formatSize(d.gb)}</span>
          </li>
        ))}
      </ul>
      <a href="#scan" className="mt-4 flex h-[43px] items-center justify-between rounded-[9px] bg-raised px-3 text-[14px] font-bold text-accent">
        {t({ zh: '查看扫描结果', en: 'View Scan Results' })}
        <ArrowRight aria-hidden="true" className="size-4" />
      </a>
    </div>
  )
}
