import { Check, Minus } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLang, type L } from '../../i18n'

// 几个演示窗口共用的部件：窗口外框、红黄绿圆点、应用的页签栏、勾选框、「这是演示」提示

export type AppTab = 'overview' | 'scan' | 'system' | 'terminal' | 'uninstall' | 'settings'

const tabs: { id: AppTab; label: L }[] = [
  { id: 'overview', label: { zh: '概览', en: 'Overview' } },
  { id: 'scan', label: { zh: '扫描结果', en: 'Scan Results' } },
  { id: 'system', label: { zh: '系统数据', en: 'System Data' } },
  { id: 'terminal', label: { zh: '终端待办', en: 'Terminal Tasks' } },
  { id: 'uninstall', label: { zh: '卸载应用', en: 'Uninstall Apps' } },
  { id: 'settings', label: { zh: '设置', en: 'Settings' } },
]

/** 应用窗口的外框：深色底、星点、圆角描边 */
export function WindowFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`stars relative overflow-hidden rounded-[14px] border border-win-line bg-win text-win-ink ${className}`}>{children}</div>
}

export function TrafficLights({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex gap-[7px] ${className}`}>
      <span className="size-[9px] rounded-full bg-[#f77e7b]" />
      <span className="size-[9px] rounded-full bg-[#ffc170]" />
      <span className="size-[9px] rounded-full bg-[#7bcfa1]" />
    </div>
  )
}

/**
 * 应用的页签栏，只是示意当前在哪一页，不能点。
 * 放不下时（手机上的英文）横向滚动，并把当前页签滚到看得见的地方
 */
export function AppTabs({ active, size = 'md' }: { active: AppTab; size?: 'md' | 'sm' | 'xs' }) {
  const { t, lang } = useLang()
  const box = useRef<HTMLDivElement>(null)
  const current = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = box.current
    const tab = current.current
    if (!el || !tab) return
    el.scrollLeft = tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2
  }, [lang, active])

  const text = { md: 'text-[14px] leading-[21px]', sm: 'text-[11px] leading-[17px]', xs: 'text-[10px] leading-[15px]' }[size]
  const pad = { md: 'px-3 py-1.5', sm: 'px-[5px] py-1', xs: 'px-[9px] py-1' }[size]
  const gap = { md: 'p-[5px]', sm: 'p-1', xs: 'p-[3px]' }[size]

  return (
    <div ref={box} aria-hidden="true" className={`no-scrollbar relative max-w-full overflow-x-auto rounded-full border border-tab-line bg-tab-bar ${gap}`}>
      <div className="flex w-max gap-px">
        {tabs.map((tab) => (
          <span
            key={tab.id}
            ref={tab.id === active ? current : undefined}
            className={`rounded-full font-medium whitespace-nowrap ${text} ${pad} ${tab.id === active ? 'bg-tab-on text-tab-on-ink' : 'text-win-muted'}`}
          >
            {t(tab.label)}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 勾选框：三种状态（没选、选了一部分、全选） */
export function Checkbox({
  state,
  onChange,
  label,
  size = 16,
}: {
  state: 'off' | 'some' | 'on'
  onChange: () => void
  label: string
  size?: number
}) {
  const on = state !== 'off'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === 'some' ? 'mixed' : state === 'on'}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
        on ? 'border-accent bg-accent text-on-accent' : 'border-[#4a5974] bg-[#161d2d] hover:border-win-muted'
      }`}
    >
      {state === 'on' && <Check aria-hidden="true" strokeWidth={3} style={{ width: size - 5, height: size - 5 }} />}
      {state === 'some' && <Minus aria-hidden="true" strokeWidth={3} style={{ width: size - 5, height: size - 5 }} />}
    </button>
  )
}

/** 用浏览器的模态弹窗接管键盘焦点，内容保持演示窗口的配色。 */
export function DemoDialog({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[420px] overflow-y-auto rounded-2xl border-0 bg-transparent p-0 text-ink backdrop:bg-canvas/70"
    >
      <div className="rounded-2xl border border-line bg-surface p-[18px] desk:p-6">
        {children}
      </div>
    </dialog>
  )
}
