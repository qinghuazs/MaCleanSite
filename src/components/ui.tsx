import type { ReactNode } from 'react'

// 通用小组件：按钮样式的链接

type ButtonProps = {
  href: string | null
  children: ReactNode
  /** 链接为空时显示的文字（按钮置灰不可点） */
  disabledLabel?: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  external?: boolean
  /** 让浏览器把链接当作文件下载 */
  download?: boolean
  className?: string
}

const base = 'inline-flex shrink-0 items-center justify-center gap-[9px] rounded-full font-medium whitespace-nowrap transition-colors duration-150'
const sizes = { md: 'h-[50px] px-[19px] text-[14px]', sm: 'h-10 px-3.5 text-[14px]' }
const variants = {
  primary: 'bg-ink text-on-accent hover:bg-white',
  secondary: 'border border-line bg-surface text-ink hover:border-line-2 hover:bg-raised',
}

export function ButtonLink({ href, children, disabledLabel, variant = 'primary', size = 'md', external, download, className = '' }: ButtonProps) {
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} ${sizes[size]} cursor-not-allowed border border-dashed border-line-2 text-subtle ${className}`}>
        {disabledLabel ?? children}
      </span>
    )
  }
  return (
    <a
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: '' } : {})}
    >
      {children}
    </a>
  )
}
