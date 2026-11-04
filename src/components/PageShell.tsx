import { StrictMode, useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { LangProvider, type L } from '../i18n'
import type { PageDepth } from '../paths'
import { Footer } from './Footer'
import { Header } from './Header'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource/noto-serif-sc/600.css'
import '../styles.css'

// 每个页面入口调用它挂载：双语上下文 + 页头 + 内容 + 页脚
export function mountPage({ title, depth, children }: { title: L; depth: PageDepth; children: ReactNode }) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LangProvider title={title}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header depth={depth} />
        <main id="main">{children}</main>
        <Footer depth={depth} />
        <ScrollToHash />
      </LangProvider>
    </StrictMode>,
  )
}

/** 内容是渲染后才出现的，浏览器打开带 #锚点 的链接时找不到目标；渲染完成后再跳一次 */
function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const frame = window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }))
    return () => window.cancelAnimationFrame(frame)
  }, [])
  return null
}
