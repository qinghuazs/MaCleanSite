import { Check, Minus } from 'lucide-react'
import { useLayoutEffect, useRef, type ReactNode, type Ref } from 'react'

// 几个演示窗口共用的部件：窗口外框、红黄绿圆点、勾选框、「这是演示」提示。
// 应用顶上那一排页签原来也画在窗口里，2026-11-26 用户让去掉了（每一页的大标题已经说明是哪个功能）

/** 应用窗口的外框：深色底、星点、圆角描边 */
export function WindowFrame({ children, className = '', ref }: { children: ReactNode; className?: string; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={`stars relative overflow-hidden rounded-[14px] border border-win-line bg-win text-win-ink ${className}`}>
      {children}
    </div>
  )
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
