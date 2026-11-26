import { Package, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatMb, uninstallApps, type UninstallApp } from '../../content/demo'
import { useLang } from '../../i18n'
import { Checkbox, DemoDialog, TrafficLights, WindowFrame } from './chrome'
import { useFitScreen } from './useFitScreen'

// 卸载应用演示：应用网格、搜索、「90 天未使用」筛选；点应用看卸载清单，
// 可以选只卸载本体；最后一步是「完成演示」，不执行任何操作

type Dialog = { app: UninstallApp; step: 'list' | 'confirm' } | null

export function UninstallDemo() {
  const { t, lang } = useLang()
  // 宽屏上和上面的标题、介绍合起来正好一屏：窗口高度固定，多出来的高度给应用网格，网格放不下时在里面滚动
  const frame = useRef<HTMLDivElement>(null)
  useFitScreen(frame, lang, '', { maxExtra: 110 })
  const [query, setQuery] = useState('')
  const [unusedOnly, setUnusedOnly] = useState(false)
  const [counting, setCounting] = useState(false)
  const [leftovers, setLeftovers] = useState(false)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [keepData, setKeepData] = useState(false)

  // 「重新统计」：显示一会儿「正在统计应用大小…」
  useEffect(() => {
    if (!counting) return
    const timer = window.setTimeout(() => setCounting(false), 1200)
    return () => window.clearTimeout(timer)
  }, [counting])

  const q = query.trim().toLowerCase()
  const apps = uninstallApps.filter(
    (app) => (!unusedOnly || app.unused) &&
      [app.name.zh, app.name.en, app.path, app.bundleId].some((value) => value.toLowerCase().includes(q)),
  )
  const open = (app: UninstallApp) => {
    setKeepData(false)
    setDialog({ app, step: 'list' })
  }
  const button = 'inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-line bg-raised px-5 text-[13px] font-bold hover:border-line-2'

  return (
    <WindowFrame ref={frame} className="desk:flex desk:flex-col">
      {/* 应用的页签栏和窗口里的标题都去掉了（和系统数据、扫描结果一样，2026-11-26）。
          宽屏上窗口顶上留红黄绿三个点和「演示数据」；手机上不画这一行，「演示数据」写在应用数量那一行的右边 */}
      <div className="hidden items-center justify-between px-[22px] pt-4 desk:flex">
        <TrafficLights className="w-10" />
        <p className="text-[13px] text-win-subtle">{t({ zh: '演示数据', en: 'Demo data' })}</p>
      </div>

      <div className="px-3 pt-0.5 pb-4 desk:flex desk:flex-1 desk:flex-col desk:px-[88px] desk:pt-1 desk:pb-5">

        {leftovers ? (
          <Leftovers onBack={() => setLeftovers(false)} buttonClass={button} />
        ) : (
          <>
            <div className="mt-2.5 flex flex-col gap-2 desk:flex-row desk:items-center desk:justify-between">
              <label className="flex h-10 items-center gap-2 rounded-[9px] border border-line bg-[#161c2b] px-3 desk:w-[375px]">
                <Search aria-hidden="true" className="size-4 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t({ zh: '搜索应用名称或标识符', en: 'Search app name or identifier' })}
                  className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted"
                />
              </label>
              <div className="flex items-center justify-between gap-4">
                <label className="flex h-10 cursor-pointer items-center gap-2 text-[13px]">
                  <Checkbox state={unusedOnly ? 'on' : 'off'} onChange={() => setUnusedOnly(!unusedOnly)} label={t({ zh: '90 天未使用', en: 'Unused for 90 days' })} />
                  <span>{t({ zh: '90 天未使用', en: 'Unused for 90 days' })}</span>
                </label>
                <button type="button" onClick={() => setCounting(true)} className={button}>
                  {t({ zh: '重新统计', en: 'Reanalyze' })}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="text-[13px] font-bold desk:text-[15px]">
                {counting
                  ? t({ zh: '正在统计应用大小…', en: 'Calculating app sizes…' })
                  : t({ zh: `${apps.length} 个应用`, en: apps.length === 1 ? '1 app' : `${apps.length} apps` })}
              </p>
              <p className="text-[11px] text-muted desk:text-[12px]">
                {t({ zh: '仅显示应用本体大小', en: 'App size only' })}
                <span className="desk:hidden">
                  {'\u2002·\u2002'}
                  {t({ zh: '演示数据', en: 'Demo data' })}
                </span>
              </p>
            </div>

            {/* 宽屏上网格撑满窗口剩下的高度，最少放得下三行 */}
            <div className="mt-2 h-[333px] overflow-y-auto pr-1.5 desk:h-auto desk:min-h-[306px] desk:flex-1 desk:basis-0 desk:[scrollbar-color:#3a425a_transparent] desk:[scrollbar-width:thin]">
              {apps.length === 0 ? (
                <p className="pt-16 text-center text-[13px] text-muted">{t({ zh: '没有找到应用', en: 'No apps found' })}</p>
              ) : (
                <ul className="grid grid-cols-2 gap-2.5 desk:grid-cols-5 desk:gap-3">
                  {apps.map((app) => (
                    <li key={app.id}>
                      <button
                        type="button"
                        onClick={() => open(app)}
                        className="flex h-[98px] w-full flex-col items-center justify-center rounded-lg border border-line bg-[#0e111b]/70 px-2 transition-colors hover:border-line-2 hover:bg-raised desk:h-[94px]"
                      >
                        <img src={app.icon} alt="" className="size-[37px]" />
                        <span className="mt-1 w-full truncate text-[14px] leading-[21px] font-bold">{t(app.name)}</span>
                        <span className="text-[12px] leading-[17px] text-muted">
                          {counting ? '…' : app.mb ? formatMb(app.mb, true) : t({ zh: '不可卸载', en: 'Can’t Uninstall' })}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-2.5 border-t border-line pt-3 desk:flex-row desk:items-center desk:justify-between">
              <p className="text-[11px] leading-4 text-muted desk:text-[12px]">
                {t({
                  zh: '点击应用图标可查看卸载清单。确认后，所选文件将移到废纸篓。',
                  en: 'Click an app icon to review its uninstall list. Confirm to move selected files to the Trash.',
                })}
              </p>
              <button type="button" onClick={() => setLeftovers(true)} className={`${button} self-end`}>
                {t({ zh: '查看卸载残留', en: 'View Uninstalled App Leftovers' })}
              </button>
            </div>
          </>
        )}
      </div>

      {dialog && <Review dialog={dialog} keepData={keepData} setKeepData={setKeepData} setDialog={setDialog} buttonClass={button} />}
    </WindowFrame>
  )
}

/** 卸载清单与确认 */
function Review({
  dialog,
  keepData,
  setKeepData,
  setDialog,
  buttonClass,
}: {
  dialog: NonNullable<Dialog>
  keepData: boolean
  setKeepData: (v: boolean) => void
  setDialog: (d: Dialog) => void
  buttonClass: string
}) {
  const { t } = useLang()
  const { app, step } = dialog
  const name = t(app.name)
  const close = () => setDialog(null)
  const head = (title: string) => (
    <div className="flex items-center gap-3">
      <img src={app.icon} alt="" className="size-9" />
      <div className="min-w-0">
        <p className="text-[18px] leading-[26px] font-bold">{title}</p>
        <p className="truncate text-[12px] text-muted">{app.path}</p>
      </div>
    </div>
  )

  // 苹果自带的应用不能卸载
  if (!app.mb) {
    return (
      <DemoDialog label={t({ zh: `不能卸载 ${name}`, en: `Can’t uninstall ${name}` })} onClose={close}>
        {head(t({ zh: `不能卸载 ${name}`, en: `Can’t uninstall ${name}` }))}
        <p className="mt-4 text-[14px] leading-[22px] text-muted">
          {t({ zh: '此应用受保护，无法通过 MaClean 卸载。', en: 'This app is protected and can’t be uninstalled with MaClean.' })}
        </p>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={close} className={buttonClass}>
            {t({ zh: '关闭', en: 'Close' })}
          </button>
        </div>
      </DemoDialog>
    )
  }

  const total = formatMb(app.mb + (keepData ? 0 : (app.cacheMb ?? 0)))
  const count = keepData ? 1 : 2
  const toTrash = (
    <p className="text-[16px] leading-6 font-bold text-good">
      {t({ zh: '将移到废纸篓', en: 'Will move to Trash' })}
      {'\u2002·\u2002'}
      {total}
    </p>
  )
  const primary = 'inline-flex h-10 items-center justify-center rounded-lg bg-ink px-5 text-[13px] font-bold text-on-accent hover:bg-white'

  if (step === 'confirm') {
    return (
      <DemoDialog key={step} label={t({ zh: `确认卸载 ${name}`, en: `Confirm uninstall of ${name}` })} onClose={close}>
        {head(t({ zh: `卸载 ${name}？`, en: `Uninstall ${name}?` }))}
        <p className="mt-4 text-[14px] leading-[22px]">
          {keepData
            ? t({ zh: '仅移走应用本体，应用数据将保留。', en: 'Only the app is moved; its data is kept.' })
            : t({ zh: '应用本体和已选数据将移到废纸篓。', en: 'The app and the selected data will be moved to the Trash.' })}
        </p>
        <div className="mt-4">{toTrash}</div>
        <p className="mt-6 text-[12px] text-muted">{t({ zh: '交互演示', en: 'Interactive demo' })}</p>
        <div className="mt-3 flex justify-end gap-2.5">
          <button type="button" onClick={() => setDialog({ app, step: 'list' })} className={buttonClass}>
            {t({ zh: '取消', en: 'Cancel' })}
          </button>
          <button type="button" onClick={close} className={primary}>
            {t({ zh: '完成演示', en: 'Finish demo' })}
          </button>
        </div>
      </DemoDialog>
    )
  }

  const rows = [
    { label: t({ zh: '应用本体', en: 'App Bundle' }), size: formatMb(app.mb, true), status: t({ zh: '本体', en: 'App' }) },
    ...(keepData ? [] : [{ label: t({ zh: '应用缓存', en: 'App Caches' }), size: formatMb(app.cacheMb ?? 0), status: t({ zh: '已选择', en: 'Selected' }) }]),
  ]
  return (
    <DemoDialog key={step} label={t({ zh: `卸载 ${name}`, en: `Uninstall ${name}` })} onClose={close}>
      {head(t({ zh: `卸载 ${name}`, en: `Uninstall ${name}` }))}
      <div className="mt-4">{toTrash}</div>
      <div aria-hidden="true" className="mt-2 h-1 rounded-full bg-good" />
      <table className="mt-3 w-full text-left text-[13px]">
        <thead className="text-[12px] text-muted">
          <tr>
            <th className="py-1.5 font-normal">{t({ zh: '路径', en: 'Path' })}</th>
            <th className="w-20 py-1.5 text-right font-normal">{t({ zh: '大小', en: 'Size' })}</th>
            <th className="w-20 py-1.5 text-right font-normal">{t({ zh: '状态', en: 'Status' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <td className="py-2 font-bold">{row.label}</td>
              <td className="py-2 text-right text-muted">{row.size}</td>
              <td className="py-2 text-right text-muted">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <label className="mt-3 flex cursor-pointer items-center gap-2.5 border-t border-line pt-3 text-[14px]">
        <button
          type="button"
          role="switch"
          aria-checked={keepData}
          onClick={() => setKeepData(!keepData)}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${keepData ? 'bg-accent' : 'bg-[#2c3348]'}`}
        >
          <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${keepData ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
        <span>{t({ zh: '保留应用数据（只卸载应用本体）', en: 'Keep app data (uninstall the app only)' })}</span>
      </label>
      <p className="mt-4 text-[12px] text-muted">
        {t({ zh: `将移到废纸篓 ${count} 项，共 ${total}`, en: count === 1 ? `1 item to the Trash, ${total} total` : `${count} items to the Trash, ${total} total` })}
      </p>
      <div className="mt-2 flex flex-wrap justify-between gap-2.5">
        <button type="button" onClick={close} className={buttonClass}>
          {t({ zh: '取消', en: 'Cancel' })}
        </button>
        <button type="button" onClick={() => setDialog({ app, step: 'confirm' })} className={primary}>
          {t({ zh: '卸载并移到废纸篓', en: 'Uninstall and Move to Trash' })}
        </button>
      </div>
    </DemoDialog>
  )
}

/** 已卸载应用留下的东西 */
function Leftovers({ onBack, buttonClass }: { onBack: () => void; buttonClass: string }) {
  const { t } = useLang()
  return (
    <div className="mt-3">
      <p className="text-[13px] text-muted">{t({ zh: '按应用查看', en: 'By app' })}</p>
      <div className="mt-2 rounded-lg border border-line bg-[#0e111b]/70 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-raised text-muted">
            <Package aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-[15px] leading-[22px] font-bold">Obsidian</p>
            <p className="text-[12px] text-muted">{t({ zh: '1 项待确认', en: '1 item to review' })}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-[13px]">
          <p className="font-medium">{t({ zh: '卸载残留缓存', en: 'Leftover Caches' })}</p>
          <p className="flex items-center gap-4">
            <span className="text-warn">{t({ zh: '待确认', en: 'To review' })}</span>
            <span className="font-mono">48 MB</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onBack} className={buttonClass}>
          {t({ zh: '返回卸载应用', en: 'Back to Uninstall Apps' })}
        </button>
      </div>
    </div>
  )
}
