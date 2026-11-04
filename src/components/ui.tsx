import type { ReactNode } from 'react'

// 通用小组件：按钮链接、标签

type ButtonProps = {
  href: string | null
  children: ReactNode
  /** 链接为空时显示的文字（按钮置灰不可点） */
  disabledLabel?: ReactNode
  variant?: 'primary' | 'secondary' | 'light'
  size?: 'md' | 'sm'
  external?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-medium whitespace-nowrap transition-colors duration-150'
const sizes = { md: 'h-12 px-5 text-[0.98rem]', sm: 'h-9 px-3.5 text-sm' }
const variants = {
  primary: 'bg-ink text-paper hover:bg-ink-2',
  secondary: 'border border-line-2 text-ink hover:bg-paper-2',
  light: 'bg-night-ink text-night hover:bg-white',
}

export function ButtonLink({ href, children, disabledLabel, variant = 'primary', size = 'md', external }: ButtonProps) {
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} ${sizes[size]} cursor-not-allowed border border-dashed border-line-2 text-ink-3`}>
        {disabledLabel ?? children}
      </span>
    )
  }
  return (
    <a
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/** 候选项上的标签，颜色对应应用里的含义 */
export type TagTone = 'safe' | 'warn' | 'clay' | 'muted' | 'plain'

const tones: Record<TagTone, string> = {
  safe: 'bg-olive-wash text-olive-ink',
  warn: 'bg-amber-wash text-amber-ink',
  clay: 'bg-clay-wash text-clay-ink',
  muted: 'bg-paper-2 text-ink-3',
  plain: 'border border-line text-ink-2',
}

export function Tag({ tone = 'plain', icon, children }: { tone?: TagTone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.75rem] leading-5 font-medium ${tones[tone]}`}>
      {icon}
      {children}
    </span>
  )
}
